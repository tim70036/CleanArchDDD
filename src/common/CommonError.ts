import { DomainError } from '../core/Error';

class InvalidDataError extends DomainError {}

class NotAuthorizedError extends DomainError {}

class NotAuthenticatedError extends DomainError {}

class InvalidOperationError extends DomainError {}

class NotExistError extends DomainError {}

class DuplicatedError extends DomainError {}

class InternalServerError extends DomainError {}

class IgnoreError extends DomainError {}

class ExpireError extends DomainError {}

class GoneError extends DomainError {}

class UnavailableError extends DomainError {}

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
