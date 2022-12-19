import { InternalServerError } from '../../../../common/CommonError';
import { DomainErrorOr } from '../../../../core/DomainError';
import { Result } from '../../../../core/Error';
import { UseCase } from '../../../../core/UseCase';
import { IGetConfigService } from '../../domain/repo/IGetConfigService';
import { GetConfigSTO } from './GetConfigDTO';

type Response = DomainErrorOr<GetConfigSTO>

class GetConfigUseCase extends UseCase<void, GetConfigSTO> {
    private readonly getConfigService: IGetConfigService;

    public constructor (getConfigService: IGetConfigService) {
        super();
        this.getConfigService = getConfigService;
    }

    public async Run (): Promise<Response> {
        try {
            const configOrError = await this.getConfigService.Get();
            if (configOrError.IsFailure()) return configOrError;

            return Result.Ok(configOrError.Value);
        } catch (err: unknown) {
            return new InternalServerError(`${(err as Error).stack}`);
        }
    }
}

export { GetConfigUseCase };
