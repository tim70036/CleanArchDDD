import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import { redisClient } from '../../database/Redis';
import { CreateLogger } from '../../../common/Logger';
import { ResponseCode } from '../../../core/ResponseCode';
import { SessionData } from '../../../command/identity/domain/model/Session';

// Note that if you change this function, remember to also modify UserSessionAuthPhoton where photon server autenticate their client.
const logger = CreateLogger('UserSessionAuth');

const sessionPrefix = `session:uid`;

async function UserSessionAuth (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    const token = req.headers.jwt as string;
    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY as string) as {
            uid: string;
        };

        const uid = decoded.uid;
        const sessionData = await redisClient.hGet(sessionPrefix, uid);
        if (typeof sessionData !== 'string') {
            logger.error(`cannot find session in redis for uid[${uid}] with jwt[${token}]`);
            res.sendStatus(ResponseCode.Unauthorized);
            return;
        }

        const session = JSON.parse(sessionData) as SessionData;

        if (token !== session.jwt) {
            logger.info(`session invalidated by newer session uid[${uid}]`);
            res.sendStatus(ResponseCode.PreconditionFailed);
            return;
        }

        req.user = session;

        // TODO: remove this dangerous log.
        logger.debug(`authorized uid[${req.user.uid}] jwt[${token}]`);

        next();
        return;
    } catch (error: unknown) {
        logger.info(`API request : -> ${req.method} ${req.originalUrl} from ip [${req.ips}] not authorized with jwt[${token}] reason[${error}]`);
        res.sendStatus(ResponseCode.Unauthorized);
        return;
    }
}

export { UserSessionAuth };
