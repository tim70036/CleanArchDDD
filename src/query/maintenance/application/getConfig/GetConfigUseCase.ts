import { InternalServerError } from '../../../../common/CommonError';
import { ErrOr } from '../../../../core/Result';
import { UseCase } from '../../../../core/UseCase';
import { IGetConfigService } from '../../domain/repo/IGetConfigService';
import { GetConfigSTO } from './GetConfigDTO';

class GetConfigUseCase extends UseCase<void, GetConfigSTO> {
    private readonly getConfigService: IGetConfigService;

    public constructor (getConfigService: IGetConfigService) {
        super();
        this.getConfigService = getConfigService;
    }

    protected async Run (): Promise<ErrOr<GetConfigSTO>> {
        try {
            return await this.getConfigService.Get();
        } catch (error) {
            return new InternalServerError(`${(error as Error).stack}`);
        }
    }
}

export { GetConfigUseCase };
