// Error handling inspired by this article https://khalilstemmler.com/articles/enterprise-typescript-nodejs/functional-error-handling/
// Modified some to reduce the complexity.

// Primitive class that represent a failure.
class Failure<TF, TS> extends Error { // Extending Error class since I want stack info for debugging.
    private readonly value: TF;

    public constructor (value: TF) {
        super();
        this.name = this.constructor.name;
        this.message = JSON.stringify(value);
        this.value = value;
    }

    public get Value (): TS {
        throw new Error('unable to retrieve value from failed result');
    }

    public get Error (): TF {
        return this.value;
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

// Helper functions that create success or failure result. Also, notice it returns union type of success and failure.
// For example: let result: Either = execute(); We can use Result to create return value inside execute().
// We can also use Combine to check multiple results together.
class Result {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static Fail<TF> (failure: TF): Either<TF, any> {
        return new Failure(failure);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static Ok<TS> (success?: TS): Either<any, TS> {
        return new Success(success);
    }


    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static Combine (results: Either<any, any>[]): Either<any, any> {
        for (const result of results)
            if (result.IsFailure()) return result;
        return Result.Ok();
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static ExistError (results: Either<any, any>[]): boolean {
        for (const result of results)
            if (result.IsFailure()) return true;
        return false;
    }
}

export {
    Failure,
    Success,
    Either,
    Result,
};
