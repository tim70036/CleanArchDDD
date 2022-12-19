import { DomainErrorOr } from '../../../../core/DomainError';
import { DomainService } from '../../../../core/DomainService';
import { GetConfigSTO } from '../../application/getConfig/GetConfigDTO';

interface IGetConfigService extends DomainService {
    Get (): Promise<DomainErrorOr<GetConfigSTO>>;
}

export {
    IGetConfigService
};
