import { DomainErrorOr } from '../../../../core/DomainError';
import { Service } from '../../../../core/Service';
import { GetConfigSTO } from '../../application/getConfig/GetConfigDTO';

abstract class IGetConfigService extends Service {
    public abstract Get (): Promise<DomainErrorOr<GetConfigSTO>>;
}

export { IGetConfigService };
