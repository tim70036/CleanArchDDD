import * as express from 'express';
import { CreateLogger } from '../../../common/Logger';

const logger = CreateLogger('AdminServerAuth');
function AdminServerAuth (req: express.Request, res: express.Response, next: express.NextFunction): void {
    const jtoken = req.headers.jtoken;

    if (jtoken !== process.env.ADMIN_API_KEY) {
        logger.warn(`not authorized`, {
            jtoken: jtoken,
        });

        res.status(403).json({});
        return;
    }

    next();
    return;
}

export { AdminServerAuth };
