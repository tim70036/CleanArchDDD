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

    protected Fail<T> (res: express.Response, error: Err, payload?: T): void {
        const statusCode = error.ToStatusCode();

        if (error instanceof IgnoreError) this.logger.info(`<- ${statusCode} ${error}`);
        else this.logger.error(`<- ${statusCode} ${error}`);

        res.status(statusCode).json({
            data: payload ?? null
        });
    }

    protected abstract Run (req: express.Request, res: express.Response): Promise<void>;
}

export {
    Controller
};
