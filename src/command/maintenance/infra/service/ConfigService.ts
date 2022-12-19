import { redisClient } from '../../../../infra/database/Redis';
import { Config } from '../../domain/model/Config';
import { MaintenanceStatus } from '../../domain/model/MaintenanceStatus';
import { IConfigService } from '../../domain/service/IConfigService';

class ConfigService implements IConfigService {
    private readonly maintenanceKey = 'maintenance';

    public async SetStatus (status: MaintenanceStatus): Promise<void> {
        await redisClient.hSet(this.maintenanceKey, 'status', status);
    }

    public async Save (config: Config): Promise<void> {
        await redisClient.hSet(this.maintenanceKey, 'startTime', config.StartTime.format());
        await redisClient.hSet(this.maintenanceKey, 'announcement', config.Announcement);
        await redisClient.hSet(this.maintenanceKey, 'ipWhitelist', JSON.stringify(config.IpWhitelist));
    }
}

export { ConfigService };
