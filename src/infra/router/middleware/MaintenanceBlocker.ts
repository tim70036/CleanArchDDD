import * as express from 'express';
import { CreateLogger } from '../../../common/Logger';
import { saferJoi } from '../../../common/SaferJoi';
import { ResponseCode } from '../../../core/ResponseCode';
import { redisClient } from '../../database/Redis';

enum MaintenanceSetting {
    Min = 0,

    BlockNone = 0,
    BlockUsers = 1,
    BlockAll = 2,

    Max = 2,
}

const maintenancePrefix = {
    status: 'maintenance:status:',
    whitelist: 'maintenance:whitelist:'
};

interface Whitelist {
    whitelist: string[];
}

type Blocker = (req: express.Request, res: express.Response, next: express.NextFunction) => void ;

class MaintenanceBlocker {
    private readonly refreshInterval = 30000;

    private readonly blockAllExcludeDomains = ['admin', 'test'];

    private readonly blockUsersExcludeDomains = ['admin', 'game', 'worker', 'test'];

    private readonly blockUsersExcludePaths = ['/api/user/heartbeat', '/api/buddy/buddies', '/api/buddy/applications'];

    private readonly logger = CreateLogger('MaintenanceBlocker');

    private maintenanceStatus: MaintenanceSetting = MaintenanceSetting.BlockAll;

    private whitelist: string[] = [];

    public constructor () {
        this.GetMaintenanceInfo();
        setInterval(this.GetMaintenanceInfo, this.refreshInterval);
    }


    public Create (): Blocker {
        return (req: express.Request, res: express.Response, next: express.NextFunction): void => {
            if (this.maintenanceStatus === MaintenanceSetting.BlockNone) {
                next();
                return;
            }

            const baseRoute = this.GetBaseRoute(req);

            if (this.maintenanceStatus === MaintenanceSetting.BlockAll) {
                if (this.blockAllExcludeDomains.includes(baseRoute)) {
                    next();
                    return;
                }

                this.logger.debug(`request blocked due to maintenance, ip: [${req.ip}] `);
                res.sendStatus(ResponseCode.ServiceUnavailable);
                return;
            }

            // Block users, check exclude domain and whitelist
            if (this.blockUsersExcludeDomains.includes(baseRoute) || this.blockUsersExcludePaths.includes(req.url)) {
                next();
                return;
            }

            if (this.whitelist.includes(req.ip)) {
                next();
                return;
            }

            this.logger.debug(`request blocked due to maintenance, ip: [${req.ip}] `);
            res.sendStatus(ResponseCode.ServiceUnavailable);
            return;
        };
    }

    public GetStatus (): () => MaintenanceSetting {
        return (): MaintenanceSetting => this.maintenanceStatus;
    }

    private readonly GetMaintenanceInfo = async (): Promise<void> => {
        try {
            this.maintenanceStatus = await this.GetMaintenanceStatus();
            this.whitelist = await this.GetWhitelist();
            this.logger.info(`refresh maintenance status, setting: [${this.maintenanceStatus}], whitelist: [${this.whitelist}] `);
        } catch (err: unknown) {
            this.logger.error(`${(err as Error).stack}`);
        }
    }

    private GetBaseRoute (req: express.Request): string {
        const paths = req.url.split('/');
        if (paths.length < 2)
            return '';
        return paths[1];
    }

    private async GetMaintenanceStatus (): Promise<MaintenanceSetting> {
        const result = await redisClient.GetAsync(maintenancePrefix.status);
        const schema = saferJoi.number().min(MaintenanceSetting.Min).max(MaintenanceSetting.Max);
        const { error } = schema.validate(Number(result));

        if (result === null || error)
            return MaintenanceSetting.BlockNone;

        return Number(result);
    }

    private async GetWhitelist (): Promise<string[]> {
        const result = await redisClient.GetAsync(maintenancePrefix.whitelist);

        if (result === null)
            return [];

        const dto = JSON.parse(result) as Whitelist;
        return dto.whitelist;
    }
}

const maintenanceInstance = new MaintenanceBlocker();
const maintenanceBlocker = maintenanceInstance.Create();
const maintenanceStatus = maintenanceInstance.GetStatus();

export { maintenanceBlocker, maintenanceStatus, maintenancePrefix, MaintenanceSetting };
