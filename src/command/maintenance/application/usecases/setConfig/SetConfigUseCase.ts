import moment from 'moment';
import { InternalServerError, InvalidDataError } from '../../../../../common/CommonError';
import { DomainErrorOr } from '../../../../../core/DomainError';
import { Result } from '../../../../../core/Error';
import { UseCase } from '../../../../../core/UseCase';
import { Config } from '../../../domain/model/Config';
import { IConfigService } from '../../../domain/service/IConfigService';
import { SetConfigCTO } from './SetConfigDTO';

type Response = DomainErrorOr<void>;

class SetConfigUseCase extends UseCase<SetConfigCTO, void> {
    private readonly configService: IConfigService;

    public constructor (configService: IConfigService) {
        super();
        this.configService = configService;
    }

    public async Run (request: SetConfigCTO): Promise<Response> {
        const startTime = moment(request.startTime).utc();
        if (!startTime.isValid())
            return new InvalidDataError(`invalid startTime`);

        const configOrError = Config.Create({
            startTime,
            announcement: request.announcement,
            ipWhitelist: request.ipWhitelist,
        });

        if (configOrError.IsFailure())
            return new InvalidDataError(`invalid config data value error[${configOrError.Error}]`);

        const config = configOrError.Value;

        try {
            await this.configService.Save(config);
            this.logger.info(`save maintenance config [${JSON.stringify(config)}]`);
            return Result.Ok();
        } catch (err: unknown) {
            return new InternalServerError(`${(err as Error).stack}`);
        }
    }
}

export { SetConfigUseCase };