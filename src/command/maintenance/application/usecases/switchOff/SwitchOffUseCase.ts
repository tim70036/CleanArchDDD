import { InternalServerError } from '../../../../../common/CommonError';
import { ErrOr } from '../../../../../core/Err';
import { Result } from '../../../../../core/Result';
import { UseCase } from '../../../../../core/UseCase';
import { MaintenanceStatus } from '../../../domain/model/MaintenanceStatus';
import { IConfigService } from '../../../domain/service/IConfigService';

type Response = ErrOr<void>;

class SwitchOffUseCase extends UseCase<void, void> {
    private readonly configService: IConfigService;

    public constructor (configService: IConfigService) {
        super();
        this.configService = configService;
    }

    protected async Run (): Promise<Response> {
        try {
            await this.configService.SetStatus(MaintenanceStatus.Off);
            this.logger.info(`switch off maintenance`);
            return Result.Ok();
        } catch (err: unknown) {
            return new InternalServerError(`${(err as Error).stack}`);
        }
    }
}

export { SwitchOffUseCase };
