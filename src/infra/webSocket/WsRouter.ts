import { CreateLogger } from '../../common/Logger';
import { WsController } from '../../core/WsController';
import { WsMessage } from '../../core/WsMessage';

import { heartbeatController } from '../../command/identity/application/usecases/heartbeat';
import { HeartbeatClientWsEvent } from '../../command/identity/application/usecases/heartbeat/HeartbeatClientWsEvent';
import { WsEventCode } from '../../core/WsEvent';

class WsRouter {
    protected readonly routeMap: Map<WsEventCode, WsController>;

    protected readonly logger;

    public constructor () {
        this.routeMap = new Map<WsEventCode, WsController>();
        this.logger = CreateLogger(this.constructor.name);

        this.Register();
    }

    public HandleMessage (rawMessage: string, uid: string): void {
        this.logger.debug(`handle message uid[${uid}] rawMessage[${rawMessage}]`);
        try {
            const message = WsMessage.CreateFromRaw(rawMessage, uid);

            if (!this.routeMap.has(message.eventCode)) {
                this.logger.error(`invalid eventCode[${message.eventCode}]`);
                return;
            }

            this.routeMap.get(message.eventCode)?.Execute(message);
        } catch (err: unknown) {
            this.logger.error(`${(err as Error).stack}`);
        }
    }

    protected Register (): void {
        this.routeMap.set(HeartbeatClientWsEvent.code, heartbeatController);
    }
}

export { WsRouter };
