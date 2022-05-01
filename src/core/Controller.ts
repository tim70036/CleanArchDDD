import * as express from 'express';
import { IgnoreError, DoesNotExistError, DuplicatedError, InvalidDataError, InvalidOperationError, NotAuthenticatedError, NotAuthorizedError } from '../common/CommonError';
import { CreateLogger } from '../common/Logger';
import { DomainError } from './DomainError';
import { ResponseCode } from './ResponseCode';

abstract class Controller {
    protected logger;

    public constructor () {
        this.logger = CreateLogger(this.constructor.name);
    }

    public async Execute (req: express.Request, res: express.Response): Promise<void> {
        this.logger.info(`-> ${req.method} ${req.path}`);

        try {
            await this.Run(req, res);
        } catch (err: unknown) {
            this.logger.error(err);
        }
    }

    protected Success<T> (res: express.Response, payload?: T): void {
        this.logger.info(`<- ${ResponseCode.OK} OK`);

        res.json({
            data: payload ?? null
        });
    }

    protected Fail (res: express.Response, error: DomainError): void {
        const responseCode = this.GetResponseCode(error);
        if (!(error instanceof IgnoreError)) {
            this.logger.info(`<- ${responseCode}`);
            this.logger.error(`error: [${error.Error.message}]`);
        }
        res.sendStatus(responseCode);
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
        if (error instanceof DoesNotExistError)
            return ResponseCode.NotFound;
        if (error instanceof DuplicatedError)
            return ResponseCode.Conflict;
        if (error instanceof IgnoreError)
            return ResponseCode.NotAcceptable;

        return ResponseCode.InternalServerError;
    }

    protected abstract Run (req: express.Request, res: express.Response): Promise<void>;
}

export {
    Controller
};