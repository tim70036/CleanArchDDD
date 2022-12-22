import * as express from 'express';
import { CreateLogger } from '../../../common/Logger';
import { ResponseCode } from '../../../core/ResponseCode';
import { SessionService } from '../../../command/identity/infra/service/SessionService';
import { SessionRepo } from '../../../command/identity/infra/repo/SessionRepo';
import { DuplicatedError } from '../../../common/CommonError';

const logger = CreateLogger('SessionAuth');
const sessionRepo = new SessionRepo();
const sessionService = new SessionService(sessionRepo);

async function SessionAuth (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
        const token = req.headers.jwt as string;
        const sessionOrError = await sessionService.Auth(token);

        if (sessionOrError.IsFailure()) {
            logger.info(`auth failed due to error[${sessionOrError}] request[${req.method} ${req.originalUrl}] from ip[${req.ips}]`);
            if (sessionOrError instanceof DuplicatedError) {
                res.sendStatus(ResponseCode.PreconditionFailed);
                return;
            }

            res.sendStatus(ResponseCode.Unauthorized);
            return;
        }

        const session = sessionOrError.Value;
        logger.debug(`authorized uid[${session.id.Value}]`);
        req.session = session;
        next();
        return;
    } catch (err: unknown) {
        logger.error(`${err}`);
        res.sendStatus(ResponseCode.InternalServerError);
    }
}

export { SessionAuth };
