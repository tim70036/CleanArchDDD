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

class NotExistError extends DomainError {
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

class ExpireError extends DomainError {
    public constructor (message: string) {
        super({ message: `server error: ${message}` });
    }
}

class GoneError extends DomainError {
    public constructor (message: string) {
        super({ message: `server error: ${message}` });
    }
}

class UnavailableError extends DomainError {
    public constructor (message: string) {
        super({ message: `server error: ${message}` });
    }
}

export {
    InvalidDataError,
    NotAuthorizedError,
    NotAuthenticatedError,
    InvalidOperationError,
    NotExistError,
    DuplicatedError,
    InternalServerError,
    IgnoreError,
    ExpireError,
    GoneError,
    UnavailableError
};
