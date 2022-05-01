import { DomainError } from '../core/DomainError';

class InvalidDataError extends DomainError {
    public constructor (message: string) {
        super({ message: `invalid data: ${message}` });
    }
}

class NotAuthorizedError extends DomainError {
    public constructor (message: string) {
        super({ message: `not authorized: ${message}` });
    }
}

class NotAuthenticatedError extends DomainError {
    public constructor (message: string) {
        super({ message: `not authenticated: ${message}` });
    }
}

class InvalidOperationError extends DomainError {
    public constructor (message: string) {
        super({ message: `invalid operation: ${message}` });
    }
}

class DoesNotExistError extends DomainError {
    public constructor (message: string) {
        super({ message: `not exist: ${message}` });
    }
}

class DuplicatedError extends DomainError {
    public constructor (message: string) {
        super({ message: `duplicated: ${message}` });
    }
}

class InternalServerError extends DomainError {
    public constructor (message: string) {
        super({ message: `server error: ${message}` });
    }
}

class IgnoreError extends DomainError {
    public constructor (message: string) {
        super({ message: `server error: ${message}` });
    }
}

export {
    InvalidDataError,
    NotAuthorizedError,
    NotAuthenticatedError,
    InvalidOperationError,
    DoesNotExistError,
    DuplicatedError,
    InternalServerError,
    IgnoreError
};
