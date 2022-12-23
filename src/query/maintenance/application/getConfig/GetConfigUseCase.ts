import { InternalServerError } from '../../../../common/CommonError';
import { Result, ErrOr } from '../../../../core/Result';
import { UseCase } from '../../../../core/UseCase';
import { IGetConfigService } from '../../domain/repo/IGetConfigService';
import { GetConfigSTO } from './GetConfigDTO';

type Response = ErrOr<GetConfigSTO>

class GetConfigUseCase extends UseCase<void, GetConfigSTO> {
    private readonly getConfigService: IGetConfigService;

    public constructor (getConfigService: IGetConfigService) {
        super();
        this.getConfigService = getConfigService;
    }

    protected async Run (): Promise<Response> {
        try {
            const configOrError = await this.getConfigService.Get();
            if (configOrError.IsFailure()) return configOrError;

            return Result.Ok(configOrError.Value);
        } catch (error) {
            return new InternalServerError(`${(error as Error).stack}`);
        }
    }
}

export { GetConfigUseCase };
