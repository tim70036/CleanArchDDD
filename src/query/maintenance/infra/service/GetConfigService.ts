import { DomainErrorOr } from '../../../../core/DomainError';
import { Result } from '../../../../core/Error';
import { redisClient } from '../../../../infra/database/Redis';
import { GetConfigSTO } from '../../application/getConfig/GetConfigDTO';
import { IGetConfigService } from '../../domain/repo/IGetConfigService';

class GetConfigService implements IGetConfigService {
    private readonly maintenanceKey = 'maintenance';

    public async Get (): Promise<DomainErrorOr<GetConfigSTO>> {
        const startTime = await redisClient.hGet(this.maintenanceKey, 'startTime');
        const announcement = await redisClient.hGet(this.maintenanceKey, 'announcement');
        const ipWhitelist = await redisClient.hGet(this.maintenanceKey, 'ipWhitelist');
        const status = await redisClient.hGet(this.maintenanceKey, 'status');

        if (typeof startTime !== 'string') return Result.Fail('maintenance data in redis do not contain start time');
        if (typeof announcement !== 'string') return Result.Fail('maintenance data in redis do not contain announcement');
        if (typeof ipWhitelist !== 'string') return Result.Fail('maintenance data in redis do not contain ipWhitelist');
        if (typeof status !== 'string') return Result.Fail('maintenance data in redis do not contain status');

        return Result.Ok({
            startTime,
            announcement,
            ipWhitelist: JSON.parse(ipWhitelist) as string[],
            status,
        });
    }
}

export { GetConfigService };