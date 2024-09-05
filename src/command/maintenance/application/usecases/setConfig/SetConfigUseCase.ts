import dayjs from 'dayjs';
import { InternalServerError, InvalidDataError } from '../../../../../common/CommonError';
import { Result, ErrOr } from '../../../../../core/Result';
import { UseCase } from '../../../../../core/UseCase';
import { Config } from '../../../domain/model/Config';
import { IConfigService } from '../../../domain/service/IConfigService';
import { SetConfigCTO } from './SetConfigDTO';
import { maintenanceContainer } from '../../../container';

class SetConfigUseCase extends UseCase<SetConfigCTO, void> {
    private readonly configService = maintenanceContainer.resolve<IConfigService>('IConfigService');

    protected async Run (request: SetConfigCTO): Promise<ErrOr<void>> {
        const startTime = dayjs(request.startTime).utc();
        if (!startTime.isValid())
            return new InvalidDataError(`invalid startTime`);

        const configOrError = Config.Create({
            startTime,
            announcement: request.announcement,
            ipWhitelist: request.ipWhitelist,
        });

        if (configOrError.IsFailure())
            return configOrError;

        const config = configOrError.Value;

        try {
            await this.configService.Save(config);
            this.logger.info(`save maintenance config`, {
                config: JSON.stringify(config)
            });
            return Result.Ok();
        } catch (error) {
            return new InternalServerError(`${(error as Error).stack}`);
        }
    }
}

export { SetConfigUseCase };
