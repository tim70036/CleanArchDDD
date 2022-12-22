import * as express from 'express';
import { IgnoreError, NotExistError, DuplicatedError, InvalidDataError, InvalidOperationError, NotAuthenticatedError, NotAuthorizedError, ExpireError, GoneError, UnavailableError } from '../common/CommonError';
import { CreateLogger } from '../common/Logger';
import { DomainError } from './DomainError';
import { ResponseCode } from './ResponseCode';

abstract class Controller {
    protected logger;

    public constructor () {
        this.logger = CreateLogger(this.constructor.name);
    }

    public async Execute (req: express.Request, res: express.Response): Promise<void> {
        try {
            await this.Run(req, res);
        } catch (err: unknown) {
            this.logger.error(`${(err as Error).stack}`);
        }
    }

    protected Success<T> (res: express.Response, payload?: T): void {
        res.json({
            data: payload ?? null
        });
    }

    protected Fail (res: express.Response, error: DomainError): void {
        const responseCode = this.GetResponseCode(error);
        this.logger.info(`<- ${responseCode}`);

        if (!(error instanceof IgnoreError))
            this.logger.error(error);

        res.sendStatus(responseCode);
    }

    protected FailWithMessageReturn (res: express.Response, error: DomainError): void {
        const responseCode = this.GetResponseCode(error);
        this.logger.info(`<- ${responseCode}`);

        if (!(error instanceof IgnoreError))
            this.logger.error(error);

        res.status(responseCode).json({
            data: error.toString()
        });
    }

    protected GetResponseCode (error: DomainError): ResponseCode {
        if (error instanceof InvalidDataError)
            return ResponseCode.BadRequest;
        if (error instanceof NotAuthenticatedError)
            return ResponseCode.Unauthorized;
        if (error instanceof NotAuthorizedError)
            return ResponseCode.Forbidden;
        if (error instanceof InvalidOperationError)
            return ResponseCode.Forbidden;
        if (error instanceof NotExistError)
            return ResponseCode.NotFound;
        if (error instanceof DuplicatedError)
            return ResponseCode.Conflict;
        if (error instanceof IgnoreError)
            return ResponseCode.NotAcceptable;
        if (error instanceof ExpireError)
            return ResponseCode.Expired;
        if (error instanceof GoneError)
            return ResponseCode.Gone;
        if (error instanceof UnavailableError)
            return ResponseCode.ServiceUnavailable;

        return ResponseCode.InternalServerError;
    }

    protected abstract Run (req: express.Request, res: express.Response): Promise<void>;
}

export {
    Controller
};
