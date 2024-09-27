 
/* eslint-disable @typescript-eslint/no-explicit-any */
// Error handling inspired by this article https://khalilstemmler.com/articles/enterprise-typescript-nodejs/functional-error-handling/
// Modified some to reduce the complexity.

import { StatusCode } from "../common/StatusCode";

// Primitive class that represent a failure.
abstract class Failure<TF, TS> extends Error {
  // Extending Error class since I want stack info for debugging.
  public constructor(value?: TF) {
    super();
    this.name = this.constructor.name;
    this.message = JSON.stringify(value);
  }

  public get Value(): TS {
    throw new Error("unable to retrieve value from failed result");
  }

  public IsFailure(): this is Failure<TF, TS> {
    return true;
  }

  public IsSuccess(): this is Success<TF, TS> {
    return false;
  }

  // Override default toString so logger can print out error easily.
  // EX: console.log(`${error}`) or logger.info(`${error}`)
   
  public toString(): string {
    return this.stack ?? "";
  }
}

// Primitive class that represent a success.
class Success<TF, TS> {
  private readonly value?: TS;

  public constructor(value?: TS) {
    this.value = value;
  }

  public get Value(): TS {
    return this.value as TS;
  }

  public IsFailure(): this is Failure<TF, TS> {
    return false;
  }

  public IsSuccess(): this is Success<TF, TS> {
    return true;
  }
}

// Union type, useful for caller to receive result from a function that returns either Success or Failure.
// For example: let result: Either = execute(); where execute() returns either Success or Failure type.
// type Either<TF, TS> = Failure<TF, TS> | Success<TF, TS>;

// Specify some restrictions that subclass should implement.
abstract class Err extends Failure<any, any> {
  public constructor(message: any) {
    super(message);
  }

  // Used for mapping error to http response status code. All
  // subclass should implement this.
  public abstract ToStatusCode(): StatusCode;
}

// Alias for domain failure Either. Narrow down the result should be either DomainError or abritrary Success.
type ErrOr<TS> = Err | Success<any, TS>;

// Helper functions that create success or failure result. Also, notice it returns union type of success and failure.
// For example: let result: ErrOr = execute(); We can use Result to create return value inside execute().
// We can also use Combine to check multiple results together.
class Result {
  public static Ok<TS>(success?: TS): ErrOr<TS> {
    return new Success(success);
  }

  public static Combine(results: ErrOr<any>[]): ErrOr<any> {
    for (const result of results) if (result.IsFailure()) return result;
    return Result.Ok();
  }

  public static ExistError(results: ErrOr<any>[]): boolean {
    for (const result of results) if (result.IsFailure()) return true;
    return false;
  }
}

export { Err, ErrOr, Result };
