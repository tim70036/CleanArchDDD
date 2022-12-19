import { HeartbeatUseCase } from './HeartbeatUseCase';
import { WsController } from '../../../../../core/WsController';
import { WsMessage } from '../../../../../core/WsMessage';
import { HeartbeatClientWsEvent } from './HeartbeatClientWsEvent';

class HeartbeatController extends WsController {
    private readonly useCase: HeartbeatUseCase;

    public constructor (useCase: HeartbeatUseCase) {
        super();
        this.useCase = useCase;
    }

    protected async Run (wsMessage: WsMessage): Promise<void> {
        try {
            const clientWsEvent = HeartbeatClientWsEvent.CreateFromRaw(JSON.stringify(wsMessage.eventData));
            await this.useCase.Execute(clientWsEvent);
            return;
        } catch (err: unknown) {
            this.logger.error(`${(err as Error).stack}`);
            return;
        }
    }
}

export { HeartbeatController };
