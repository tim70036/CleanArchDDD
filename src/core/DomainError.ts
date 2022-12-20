import { Failure, Success } from './Error';

interface ErrorDTO {
    message: string;
}

// Alias for domain failure. Narrow down the failure type should contain ErrorDTO instead of abritrary type.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
abstract class DomainError extends Failure<ErrorDTO, any> implements Error {
    public readonly name: string;

    public readonly message: string;

    // Stack trace is very helpful, thus we're implementing js Error interface.
    public readonly stack?: string;

    public constructor (error: ErrorDTO) {
        super(error);
        this.message = error.message;
        this.name = this.constructor.name;
        this.stack = (new Error).stack;
    }
}

// Alias for domain failure Either. Narrow down the result should be either DomainError or abritrary Success.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DomainErrorOr<TS> = DomainError | Success<any, TS>;

export {
    DomainError,
    DomainErrorOr,
};
