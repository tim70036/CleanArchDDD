enum StatusCode {
    OK = 200,
    BadRequest = 400,
    Unauthorized = 401,
    Forbidden = 403,
    NotFound = 404,
    NotAcceptable = 406,
    Conflict = 409,
    InternalServerError = 500,
    ServiceUnavailable = 503,
    Expired = 419,
    Gone = 410,

    /* This code remained for user session expire, should not return this code in other places. */
    PreconditionFailed = 412,
}

export { StatusCode };
