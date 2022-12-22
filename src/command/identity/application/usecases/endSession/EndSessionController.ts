import { EndSessionUseCase } from './EndSessionUseCase';
import { WsController } from '../../../../../core/WsController';
import { WsMessage } from '../../../../../core/WsMessage';
import { EndSessionClientWsEvent } from './EndSessionClientWsEvent';

class EndSessionController extends WsController {
    private readonly useCase: EndSessionUseCase;

    public constructor (useCase: EndSessionUseCase) {
        super();
        this.useCase = useCase;
    }

    protected async Run (wsMessage: WsMessage): Promise<void> {
        try {
            const clientWsEvent = EndSessionClientWsEvent.CreateFromRaw(JSON.stringify(wsMessage.eventData));
            await this.useCase.Execute(clientWsEvent);
            return;
        } catch (err: unknown) {
            this.logger.error(`${(err as Error).stack}`);
            return;
        }
    }
}

export { EndSessionController };
