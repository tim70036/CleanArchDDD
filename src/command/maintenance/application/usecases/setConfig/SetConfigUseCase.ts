import dayjs from 'dayjs';
import { InternalServerError, InvalidDataError } from '../../../../../common/CommonError';
import { Result, ErrOr } from '../../../../../core/Result';
import { UseCase } from '../../../../../core/UseCase';
import { Config } from '../../../domain/model/Config';
import { IConfigService } from '../../../domain/service/IConfigService';
import { SetConfigCTO } from './SetConfigDTO';

type Response = ErrOr<void>;

class SetConfigUseCase extends UseCase<SetConfigCTO, void> {
    private readonly configService: IConfigService;

    public constructor (configService: IConfigService) {
        super();
        this.configService = configService;
    }

    protected async Run (request: SetConfigCTO): Promise<Response> {
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
            this.logger.info(`save maintenance config [${JSON.stringify(config)}]`);
            return Result.Ok();
        } catch (error) {
            return new InternalServerError(`${(error as Error).stack}`);
        }
    }
}

export { SetConfigUseCase };
