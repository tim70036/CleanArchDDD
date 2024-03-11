import * as express from 'express';
import { MaintenanceStatus } from '../../../command/maintenance/domain/model/MaintenanceStatus';
import { CreateLogger } from '../../../common/Logger';
import { StatusCode } from '../../../common/StatusCode';
import { maintenanceMaster } from '../../MaintenanceMaster';

const allowDomainsWhenBlockAll = ['admin', 'test'];
const allowDomainsWhenWhitelist = ['admin', 'test', 'game', 'worker'];

const logger = CreateLogger('MaintenanceBlocker');
function MaintenanceBlocker (req: express.Request, res: express.Response, next: express.NextFunction): void {
    if (maintenanceMaster.Status === MaintenanceStatus.Off) {
        next();
        return;
    }

    const apiDomain = GetApiDomain(req);
    const status = maintenanceMaster.Status;
    if ((status === MaintenanceStatus.BlockAll && allowDomainsWhenBlockAll.includes(apiDomain)) ||
        (status === MaintenanceStatus.AllowWhitelist && allowDomainsWhenWhitelist.includes(apiDomain)) ||
        (status === MaintenanceStatus.AllowWhitelist && maintenanceMaster.IpWhitelist.includes(req.ip ?? ''))) {
        next();
        return;
    }

    logger.debug(`request blocked due to maintenance, ip: [${req.ip}] `);
    res.status(StatusCode.ServiceUnavailable).send(maintenanceMaster.Announcement);
}

function GetApiDomain (req: express.Request): string {
    const paths = req.url.split('/');
    if (paths.length < 2)
        return '';
    return paths[1];
}

export { MaintenanceBlocker };
