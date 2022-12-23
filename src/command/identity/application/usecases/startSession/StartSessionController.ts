import { StartSessionUseCase } from './StartSessionUseCase';
import { WsController } from '../../../../../core/WsController';
import { WsMessage } from '../../../../../core/WsMessage';
import { StartSessionClientWsEvent } from './StartSessionWsEvent';

class StartSessionController extends WsController {
    private readonly useCase: StartSessionUseCase;

    public constructor (useCase: StartSessionUseCase) {
        super();
        this.useCase = useCase;
    }

    protected async Run (wsMessage: WsMessage): Promise<void> {
        try {
            const clientWsEvent = StartSessionClientWsEvent.CreateFromRaw(JSON.stringify(wsMessage.eventData));
            await this.useCase.Execute(clientWsEvent);
            return;
        } catch (error) {
            this.logger.error(`${(error as Error).stack}`);
            return;
        }
    }
}

export { StartSessionController };
