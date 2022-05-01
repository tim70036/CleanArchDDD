enum ResponseCode{
    OK = 200,
    BadRequest = 400,
    Unauthorized = 401,
    Forbidden = 403,
    NotFound = 404,
    NotAcceptable = 406,
    Conflict = 409,
    InternalServerError = 500,
    ServiceUnavailable = 503
}

export { ResponseCode };
