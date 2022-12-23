import { StatusCode } from '../common/StatusCode';
import { Failure, Success } from './Result';

// Alias for domain failure. Narrow down the failure type should contain string instead of abritrary type.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
abstract class Err extends Failure<string, any> {
    public constructor (message: string) {
        super(message);
    }

    public abstract ToStatusCode (): StatusCode;
}

// Alias for domain failure Either. Narrow down the result should be either DomainError or abritrary Success.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ErrOr<TS> = Err | Success<any, TS>;

export {
    Err,
    ErrOr,
};
