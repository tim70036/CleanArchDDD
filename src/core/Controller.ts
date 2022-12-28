import * as express from 'express';
import { CreateLogger } from '../common/Logger';
import { Err } from './Result';
import { IgnoreError } from '../common/CommonError';

abstract class Controller {
    protected logger;

    public constructor () {
        this.logger = CreateLogger(this.constructor.name);
    }

    public async Execute (req: express.Request, res: express.Response): Promise<void> {
        this.logger.debug(`-> ${req.method} ${req.originalUrl} session[${JSON.stringify(req.session)}]`);
        try {
            await this.Run(req, res);
        } catch (error) {
            this.logger.error(`${(error as Error).stack}`);
        }
    }

    protected Success<T> (res: express.Response, payload?: T): void {
        this.logger.debug(`<- ${res.req.method} ${res.req.originalUrl} 200 session[${JSON.stringify(res.req.session)}]`);
        res.json({
            data: payload ?? null
        });
    }

    protected Fail<T> (res: express.Response, error: Err, payload?: T): void {
        const statusCode = error.ToStatusCode();

        if (error instanceof IgnoreError) this.logger.info(`<- ${res.req.method} ${res.req.originalUrl} status[${statusCode}] session[${JSON.stringify(res.req.session)}] error[${error}]`);
        else this.logger.error(`<- ${res.req.method} ${res.req.originalUrl} status[${statusCode}] session[${JSON.stringify(res.req.session)}] error[${error}]`);

        res.status(statusCode).json({
            data: payload ?? null
        });
    }

    protected abstract Run (req: express.Request, res: express.Response): Promise<void>;
}

export {
    Controller
};
