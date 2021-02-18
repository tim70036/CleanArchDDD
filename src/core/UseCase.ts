import { DomainErrorOr } from './DomainError';
import { DomainEvent, EventBus } from './DomainEvent';

// UseCase acts as huge a mediator that controls the dance of each component.
// It's either command or query.
abstract class UseCase<TRequest, TResponse> {
    // Domain event we should fire after the UseCase is done.
    protected afterEvent?: DomainEvent;

    protected constructor (event?: DomainEvent) {
        this.afterEvent = event;
    }

    // Exposed method for Controllers to call.
    // It's separate from actual implementation of UseCase, since we want have some hook and control in this parent class.
    public async Execute (request?: TRequest): Promise<DomainErrorOr<TResponse>> {
        const response = await this.Run(request);

        if (typeof this.afterEvent !== 'undefined') EventBus.Publish(this.afterEvent);
        return response;
    }

    // The actual implementation goes into this method.
    protected abstract Run(request?: TRequest): Promise<DomainErrorOr<TResponse>> | DomainErrorOr<TResponse>;
}

export {
    UseCase,
};
