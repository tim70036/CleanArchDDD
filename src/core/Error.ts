// Error handling inspired by this article https://khalilstemmler.com/articles/enterprise-typescript-nodejs/functional-error-handling/
// Modified some to reduce the complexity.

// Primitive class that represent a failure.
class Failure<TF, TS> {
    private readonly error: TF;

    public constructor (error: TF) {
        this.error = error;
    }

    public get Value (): TS {
        throw new Error('unable to retrieve value from failed result');
    }

    public get Error (): TF {
        return this.error;
    }

    public IsFailure (): this is Failure<TF, TS> {
        return true;
    }

    public IsSuccess (): this is Success<TF, TS> {
        return false;
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
    public static Fail<TF, TS> (failure: TF): Either<TF, TS> {
        return new Failure(failure);
    }

    public static Ok<TF, TS> (success?: TS): Either<TF, TS> {
        return new Success(success);
    }

    public static Combine<TF, TS> (results: Either<TF, TS>[]): Either<TF, TS> {
        for (const result of results)
            if (result.IsFailure()) return result;
        return Result.Ok();
    }
}

export {
    Failure,
    Success,
    Either,
    Result,
};
