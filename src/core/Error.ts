import { Failure, Success } from './Result';

// Alias for domain failure. Narrow down the failure type should contain string instead of abritrary type.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
abstract class DomainError extends Failure<string, any> {
    public constructor (message: string) {
        super(message);
    }
}

// Alias for domain failure Either. Narrow down the result should be either DomainError or abritrary Success.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ErrorOr<TS> = DomainError | Success<any, TS>;

export {
    DomainError,
    ErrorOr,
};
