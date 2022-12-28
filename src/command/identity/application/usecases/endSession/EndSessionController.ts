import { EndSessionUseCase } from './EndSessionUseCase';
import { WsController } from '../../../../../core/WsController';
import { WsMessage } from '../../../../../core/WsMessage';
import { EndSessionClientWsEvent } from './EndSessionClientWsEvent';
import { identityContainer } from '../../../container';

class EndSessionController extends WsController {
    private readonly useCase = identityContainer.resolve(EndSessionUseCase);

    protected async Run (wsMessage: WsMessage): Promise<void> {
        try {
            const clientWsEvent = EndSessionClientWsEvent.CreateFromRaw(JSON.stringify(wsMessage.eventData));
            await this.useCase.Execute(clientWsEvent);
            return;
        } catch (error) {
            this.logger.error(`${(error as Error).stack}`);
            return;
        }
    }
}

export { EndSessionController };
