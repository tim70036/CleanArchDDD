import { Err } from '../core/Err';
import { StatusCode } from './StatusCode';

class InvalidDataError extends Err {
    public ToStatusCode (): StatusCode {
        return StatusCode.BadRequest;
    }
}

class NotAuthenticatedError extends Err {
    public ToStatusCode (): StatusCode {
        return StatusCode.Unauthorized;
    }
}

class NotAuthorizedError extends Err {
    public ToStatusCode (): StatusCode {
        return StatusCode.Forbidden;
    }
}

class InvalidOperationError extends Err {
    public ToStatusCode (): StatusCode {
        return StatusCode.Forbidden;
    }
}

class NotExistError extends Err {
    public ToStatusCode (): StatusCode {
        return StatusCode.NotFound;
    }
}

class DuplicatedError extends Err {
    public ToStatusCode (): StatusCode {
        return StatusCode.Conflict;
    }
}

class InternalServerError extends Err {
    public ToStatusCode (): StatusCode {
        return StatusCode.InternalServerError;
    }
}

class IgnoreError extends Err {
    public ToStatusCode (): StatusCode {
        return StatusCode.NotAcceptable;
    }
}

class ExpireError extends Err {
    public ToStatusCode(): StatusCode {
        return StatusCode.Expired;
    }
}

class GoneError extends Err {
    public ToStatusCode (): StatusCode {
        return StatusCode.Gone;
    }
}

class UnavailableError extends Err {
    public ToStatusCode (): StatusCode {
        return StatusCode.ServiceUnavailable;
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
