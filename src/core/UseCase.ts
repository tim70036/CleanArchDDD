import { ErrorOr } from './Error';
import { CreateLogger } from '../common/Logger';

// UseCase acts as huge a mediator that controls the dance of each component.
// It's either command or query.
abstract class UseCase<TRequest, TResponse> {
    protected logger;

    public constructor () {
        this.logger = CreateLogger(this.constructor.name);
    }

    // Exposed method for Controllers to call.
    // It's separate from actual implementation of UseCase, since we want have some hook and control in this parent class.
    public async Execute (request?: TRequest): Promise<ErrorOr<TResponse>> {
        const response = await this.Run(request);
        return response;
    }

    // The actual implementation goes into this method.
    protected abstract Run(request?: TRequest): Promise<ErrorOr<TResponse>> | ErrorOr<TResponse>;
}

export {
    UseCase,
};
