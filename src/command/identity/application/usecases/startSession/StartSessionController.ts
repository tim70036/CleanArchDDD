import { StartSessionUseCase } from './StartSessionUseCase';
import { WsController } from '../../../../../core/WsController';
import { WsMessage } from '../../../../../core/WsMessage';
import { StartSessionClientWsEvent } from './StartSessionWsEvent';
import { identityContainer } from '../../../container';

class StartSessionController extends WsController {
    private readonly useCase = identityContainer.resolve(StartSessionUseCase);

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
