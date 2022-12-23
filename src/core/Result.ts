// Error handling inspired by this article https://khalilstemmler.com/articles/enterprise-typescript-nodejs/functional-error-handling/
// Modified some to reduce the complexity.

import { StatusCode } from '../common/StatusCode';

// Primitive class that represent a failure.
abstract class Failure<TF, TS> extends Error { // Extending Error class since I want stack info for debugging.
    private readonly errValue: TF;

    public constructor (errValue: TF) {
        super();
        this.name = this.constructor.name;
        this.message = JSON.stringify(errValue);
        this.errValue = errValue;
    }

    public get Value (): TS {
        throw new Error('unable to retrieve value from failed result');
    }

    public get Error (): TF {
        return this.errValue;
    }

    public IsFailure (): this is Failure<TF, TS> {
        return true;
    }

    public IsSuccess (): this is Success<TF, TS> {
        return false;
    }

    // Override default toString so we can debug much more easier.
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public toString (): string {
        return this.stack ?? '';
    }
}

// Primitive class that represent a success.
class Success<TF, TS> {
    private readonly value?: TS;

    public constructor (value?: TS) {
        this.value = value;
    }

    public get Value (): TS {
        return this.value as TS;
    }

    public IsFailure (): this is Failure<TF, TS> {
        return false;
    }

    public IsSuccess (): this is Success<TF, TS> {
        return true;
    }
}

// Union type, useful for caller to receive result from a function that returns either Success or Failure.
// For example: let result: Either = execute(); where execute() returns either Success or Failure type.
type Either<TF, TS> = Failure<TF, TS> | Success<TF, TS>;

// Alias for domain failure. Narrow down the failure type should contain string instead of abritrary type.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
abstract class Err extends Failure<string, any> {
    public constructor (message: string) {
        super(message);
    }

    // Used for mapping error to http response status code. All
    // subclass should implement this.
    public abstract ToStatusCode (): StatusCode;
}

// Alias for domain failure Either. Narrow down the result should be either DomainError or abritrary Success.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ErrOr<TS> = Err | Success<any, TS>;

// Helper functions that create success or failure result. Also, notice it returns union type of success and failure.
// For example: let result: ErrOr = execute(); We can use Result to create return value inside execute().
// We can also use Combine to check multiple results together.
class Result {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static Ok<TS> (success?: TS): ErrOr<TS> {
        return new Success(success);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static Combine (results: ErrOr<any>[]): ErrOr<any> {
        for (const result of results)
            if (result.IsFailure()) return result;
        return Result.Ok();
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static ExistError (results: ErrOr<any>[]): boolean {
        for (const result of results)
            if (result.IsFailure()) return true;
        return false;
    }
}

export {
    Err,
    ErrOr,
    Result,
};
