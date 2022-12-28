import { InternalServerError } from '../../../../../common/CommonError';
import { Result, ErrOr } from '../../../../../core/Result';
import { UseCase } from '../../../../../core/UseCase';
import { maintenanceContainer } from '../../../container';
import { MaintenanceStatus } from '../../../domain/model/MaintenanceStatus';
import { IConfigService } from '../../../domain/service/IConfigService';


class SwitchOffUseCase extends UseCase<void, void> {
    private readonly configService = maintenanceContainer.resolve<IConfigService>('IConfigService');

    protected async Run (): Promise<ErrOr<void>> {
        try {
            await this.configService.SetStatus(MaintenanceStatus.Off);
            this.logger.info(`switch off maintenance`);
            return Result.Ok();
        } catch (error) {
            return new InternalServerError(`${(error as Error).stack}`);
        }
    }
}

export { SwitchOffUseCase };
