import { InvalidDataError } from '../../../../common/CommonError';
import { Result, ErrOr } from '../../../../core/Result';
import { redisClient } from '../../../../infra/database/Redis';
import { GetConfigSTO } from '../../application/getConfig/GetConfigDTO';
import { IGetConfigService } from '../../domain/repo/IGetConfigService';

class GetConfigService extends IGetConfigService {
    private readonly maintenanceKey = 'maintenance';

    public async Get (): Promise<ErrOr<GetConfigSTO>> {
        const startTime = await redisClient.hGet(this.maintenanceKey, 'startTime');
        const announcement = await redisClient.hGet(this.maintenanceKey, 'announcement');
        const ipWhitelist = await redisClient.hGet(this.maintenanceKey, 'ipWhitelist');
        const status = await redisClient.hGet(this.maintenanceKey, 'status');

        if (typeof startTime === 'undefined') return new InvalidDataError('maintenance data in redis ');
        if (typeof announcement === 'undefined') return new InvalidDataError('maintenance data in redis do not contain announcement');
        if (typeof ipWhitelist === 'undefined') return new InvalidDataError('maintenance data in redis do not contain ipWhitelist');
        if (typeof status === 'undefined') return new InvalidDataError('maintenance data in redis do not contain status');

        return Result.Ok({
            startTime,
            announcement,
            ipWhitelist: JSON.parse(ipWhitelist) as string[],
            status,
        });
    }
}

export { GetConfigService };
