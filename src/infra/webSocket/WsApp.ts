import dayjs from 'dayjs';
import http from 'http';
import net from 'net';
import * as jwt from 'jsonwebtoken';
import WebSocket, { WebSocketServer } from 'ws';
import { redisClient, redisSubClient } from '../database/Redis';
import { CreateLogger } from '../../common/Logger';
import { ResponseCode } from '../../core/ResponseCode';
import { SessionData } from '../../command/identity/domain/model/Session';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { WsController } from '../../core/WsController';
import { WsRouter } from './WsRouter';
import { HeartbeatClientWsEvent } from '../../command/identity/application/usecases/heartbeat/HeartbeatClientWsEvent';
import { maintenanceMaster } from '../MaintenanceMaster';
import { MaintenanceStatus } from '../../command/maintenance/domain/model/MaintenanceStatus';
import { NewsServerWsEvent } from './NewsServerWsEvent';
import { WsMessage } from '../../core/WsMessage';

interface SmartSocket extends WebSocket {
    isAlive: boolean;
    pongCnt: number;
    ip: string;
}

const sessionPrefix = `session:uid`;

class WsApp {
    protected static readonly pingInterval = 30000; // Miliseconds

    protected static readonly pongPerHeartbeat = 2;

    protected static readonly checkMaintenanceInterval = 30000; // Miliseconds

    protected static readonly msgLimiterByUid = new RateLimiterMemory({
        points: 10,
        duration: 10, // Number of seconds before consumed points are reset.
    });

    protected readonly wss: WebSocketServer;

    // Each user corespond to a websocket instance. This map stores
    // the mapping of uid <-> ws instance.
    protected readonly wsMap: Map<string, SmartSocket>;

    protected readonly router: WsRouter;

    protected readonly logger;

    public constructor () {
        this.wss = new WebSocketServer({ noServer: true, clientTracking: false });
        this.wsMap = new Map<string, SmartSocket>();
        this.router = new WsRouter();
        this.logger = CreateLogger(this.constructor.name);
    }

    public async Init (): Promise<void> {
        this.wss.on('connection', this.HandleNewConnection);
        this.wss.on('error', (error) => this.logger.error(`wss on error: ${error}`));

        await redisSubClient.subscribe(WsController.globalChannelPrefix, (message, channel) => {
            this.logger.debug(`redis sub listner msg[${message}] channel[${channel}]`);
            this.wsMap.forEach((ws) => { ws.send(message); });
        });

        setInterval(this.PingAll, WsApp.pingInterval);
        setInterval(this.HandleMaintenance, WsApp.checkMaintenanceInterval);
    }

    public readonly HandleUpgrade = async (req: http.IncomingMessage, socket: net.Socket, head: Buffer): Promise<void> => {
        const token = req.headers.jwt as string;
        try {
            // Auth user session.
            const decoded = jwt.verify(token, process.env.JWT_KEY as string) as {
                uid: string;
            };

            const uid = decoded.uid;
            const sessionData = await redisClient.hGet(sessionPrefix, uid);
            if (typeof sessionData !== 'string') {
                this.logger.error(`cannot find session in redis for uid[${uid}] with jwt[${token}]`);
                socket.write(`HTTP/1.1 ${ResponseCode.Unauthorized} ${ResponseCode[ResponseCode.Unauthorized]}\r\n\r\n`);
                socket.destroy();
                return;
            }

            const session = JSON.parse(sessionData) as SessionData;

            if (token !== session.jwt) {
                this.logger.info(`session invalidated by newer session uid[${uid}]`);
                socket.write(`HTTP/1.1 ${ResponseCode.PreconditionFailed} ${ResponseCode[ResponseCode.PreconditionFailed]}\r\n\r\n`);
                socket.destroy();
                return;
            }

            // TODO: remove this dangerous log.
            this.logger.debug(`authorized uid[${uid}] jwt[${token}]`);

            // Passed auth, upgrade protocol to WebSocket.
            this.wss.handleUpgrade(req, socket, head, (ws: WebSocket) => {
                this.logger.debug(`handle upgrade done uid[${uid}]`);

                const ip = req.headers['x-forwarded-for'] ?? req.socket.remoteAddress ?? '';
                (ws as SmartSocket).ip = ip as string;

                this.wss.emit('connection', ws, uid); // Will trigger this.HandleNewConnection()
            });
        } catch (error: unknown) {
            this.logger.info(`not authorized with jwt[${token}] reason[${error}]`);
            socket.write(`HTTP/1.1 ${ResponseCode.Unauthorized} ${ResponseCode[ResponseCode.Unauthorized]}\r\n\r\n`);
            socket.destroy();
            return;
        }
    };

    protected readonly HandleNewConnection = async (ws: SmartSocket, uid: string): Promise<void> => {
        this.logger.info(`handle new connection uid[${uid}] ip[${ws.ip}]`);

        // TODO: move this to a new class? WsMaintenance?
        if (this.IsBlockedByMaintenance(ws.ip)) {
            this.logger.debug(`new connection blocked under maintenance uid[${uid}] ip[${ws.ip}] maintenanceStatus[${maintenanceMaster.Status}]`);
            ws.close(1001, `socket closed due to server under maintenance`);
            return;
        }

        // Case: a new conneciton replaces a old connection from the same user.
        // We have to close old connection and clean up.
        if (this.wsMap.has(uid)) {
            this.logger.info(`closing old connection for uid[${uid}]`);
            const oldWs = this.wsMap.get(uid);
            oldWs?.close(1000, `this connection is replaced by a new connection from the same user.`);
        }

        // Store ws into wsMap for future messaging.
        this.wsMap.set(uid, ws);

        // Setup message handler.
        ws.on('message', async (message) => {
            // Rate limiter check.
            try {
                await WsApp.msgLimiterByUid.consume(uid, 1);
            } catch (error: unknown) {
                this.logger.error(`rate limit failed uid[${uid}] error[${error}]`);
                return;
            }

            this.router.HandleMessage(message.toString(), uid);
        });

        await redisSubClient.subscribe(`${WsController.userChannelPrefix}${uid}`, (message, channel) => {
            this.logger.debug(`redis sub listner channel[${channel}] msg[${message}]`);
            this.wsMap.get(uid)?.send(message);
        });

        // Setup heartbeat.
        ws.isAlive = true;
        ws.pongCnt = 0;
        ws.on('pong', () => { this.HandlePong(ws, uid); });
        this.Heartbeat(ws, uid); // Send heartbeat here so application can know client is connected as soon as possible.

        // Setup disconnect handle.
        ws.on('close', async (code, reason) => {
            this.logger.info(`on close uid[${uid}] code[${code}] reason[${reason}]`);
            if (this.wsMap.get(uid) === ws) this.wsMap.delete(uid); // In case that this is an old connection. There could be a new connection already established for this user.
            if (!this.wsMap.has(uid)) {
                await redisSubClient.unsubscribe(`${WsController.userChannelPrefix}${uid}`);
                WsApp.msgLimiterByUid.delete(uid); // TODO: is this a good idea? hacker can bypass rate limter by makeing lots of new connection.
            }
        });
        ws.on('error', (error) => this.logger.error(`on error uid[${uid}] error[${error}]`));

        // Send maintenance news if needed.
        const minsTillMaintenance = dayjs.duration(maintenanceMaster.StartTime.diff(dayjs.utc())).asMinutes();
        if (minsTillMaintenance > 0 && minsTillMaintenance <= 30) {
            const newsServerEvent = NewsServerWsEvent.Create(`伺服器將在 ${Math.floor(minsTillMaintenance)} 分鐘後進行維修`);
            const message = WsMessage.Create(NewsServerWsEvent.code, newsServerEvent, 'server');
            this.logger.info(`sending maintenance news to new connected ws uid[${uid}]`);

            ws.send(message.Serialize());
        }
    };

    // Both the server and the client could be unaware of the broken state of the connection (e.g. when pulling the cord).
    // To detect dead client, server sends ping for each time interval and client must respond with pong.
    // Server will need release the resource of dead client, otherwise resource could drained up.
    protected readonly PingAll = (): void => {
        this.wsMap.forEach((ws, uid) => {
            if (!ws.isAlive) {
                this.logger.info(`terminating dead ws uid[${uid}]`);
                ws.terminate(); // Will trigger on close.
                return;
            }

            this.logger.debug(`ping ws uid[${uid}]`);
            ws.isAlive = false;
            ws.ping();
        });
    };

    protected readonly HandlePong = (ws: SmartSocket, uid: string): void => {
        this.logger.debug(`on pong uid[${uid}] pongCnt[${ws.pongCnt}]`);
        ws.isAlive = true;
        ws.pongCnt += 1;

        if (ws.pongCnt >= WsApp.pongPerHeartbeat) {
            ws.pongCnt = 0;
            this.Heartbeat(ws, uid);
        }
    };

    protected readonly Heartbeat = (ws: SmartSocket, uid: string): void => {
        const rawHeartbeatMessage = {
            eventCode: HeartbeatClientWsEvent.code,
            eventData: {
                uid: uid,
                ip: ws.ip,
            }
        };

        this.router.HandleMessage(JSON.stringify(rawHeartbeatMessage), uid);
    };

    protected readonly HandleMaintenance = (): void => {
        this.wsMap.forEach((ws, uid) => {
            if (this.IsBlockedByMaintenance(ws.ip)) {
                this.logger.debug(`connection closed under maintenance uid[${uid}] ip[${ws.ip}] maintenanceStatus[${maintenanceMaster.Status}]`);
                ws.close(1001, `socket closed due to server under maintenance`);
            }
        });

        if (this.ShouldSendMaintenanceNews()) {
            const minsTillMaintenance = dayjs.duration(maintenanceMaster.StartTime.diff(dayjs.utc())).asMinutes();
            const newsServerEvent = NewsServerWsEvent.Create(`伺服器將在 ${Math.floor(minsTillMaintenance)} 分鐘後進行維修`);
            const message = WsMessage.Create(NewsServerWsEvent.code, newsServerEvent, 'server');
            this.logger.info(`sending maintenance news to all ws`);

            this.wsMap.forEach((ws) => { ws.send(message.Serialize()); });
        }
    };

    protected readonly IsBlockedByMaintenance = (ip: string): boolean => {
        if (maintenanceMaster.Status === MaintenanceStatus.Off) return false;
        if (maintenanceMaster.Status === MaintenanceStatus.AllowWhitelist && !maintenanceMaster.IpWhitelist.includes(ip)) return true;
        if (maintenanceMaster.Status === MaintenanceStatus.BlockAll) return true;
        return false;
    };

    protected readonly ShouldSendMaintenanceNews = (): boolean => {
        const now = dayjs.utc();
        for (const minsBeforeMaintenance of [30, 15, 10, 5]) {
            const sendNewsTime = maintenanceMaster.StartTime.subtract(minsBeforeMaintenance, 'minutes');
            const milisecTillSendNews = dayjs.duration(sendNewsTime.diff(now)).asMilliseconds();
            this.logger.debug(`checking sendNewsTime[${sendNewsTime}] milisecTillSendNews[${milisecTillSendNews}]`);
            if (milisecTillSendNews >= 0 && milisecTillSendNews < WsApp.checkMaintenanceInterval) return true;
        }

        return false;
    };
}
export { WsApp };
