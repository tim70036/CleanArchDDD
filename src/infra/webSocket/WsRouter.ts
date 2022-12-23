import { CreateLogger } from '../../common/Logger';
import { WsController } from '../../core/WsController';
import { WsMessage } from '../../core/WsMessage';

import { WsEventCode } from '../../core/WsEvent';
import { StartSessionClientWsEvent } from '../../command/identity/application/usecases/startSession/StartSessionWsEvent';
import { EndSessionClientWsEvent } from '../../command/identity/application/usecases/endSession/EndSessionClientWsEvent';
import { startSessionController } from '../../command/identity/application/usecases/startSession';
import { endSessionController } from '../../command/identity/application/usecases/endSession';

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
        } catch (error) {
            this.logger.error(`${(error as Error).stack}`);
        }
    }

    protected Register (): void {
        this.routeMap.set(StartSessionClientWsEvent.code, startSessionController);
        this.routeMap.set(EndSessionClientWsEvent.code, endSessionController);
    }
}

export { WsRouter };
