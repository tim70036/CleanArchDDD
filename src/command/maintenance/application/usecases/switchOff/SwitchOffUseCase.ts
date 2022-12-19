import { InternalServerError } from '../../../../../common/CommonError';
import { DomainErrorOr } from '../../../../../core/DomainError';
import { Result } from '../../../../../core/Error';
import { UseCase } from '../../../../../core/UseCase';
import { MaintenanceStatus } from '../../../domain/model/MaintenanceStatus';
import { IConfigService } from '../../../domain/service/IConfigService';

type Response = DomainErrorOr<void>;

class SwitchOffUseCase extends UseCase<void, void> {
    private readonly configService: IConfigService;

    public constructor (configService: IConfigService) {
        super();
        this.configService = configService;
    }

    public async Run (): Promise<Response> {
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
