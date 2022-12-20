import { DomainErrorOr } from '../../../../core/DomainError';
import { Service } from '../../../../core/Service';
import { GetConfigSTO } from '../../application/getConfig/GetConfigDTO';

interface IGetConfigService extends Service {
    Get (): Promise<DomainErrorOr<GetConfigSTO>>;
}

export {
    IGetConfigService
};
