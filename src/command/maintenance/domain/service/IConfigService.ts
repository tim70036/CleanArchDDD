import { DomainService } from '../../../../core/DomainService';
import { Config } from '../model/Config';
import { MaintenanceStatus } from '../model/MaintenanceStatus';

interface IConfigService extends DomainService {
    SetStatus (status: MaintenanceStatus): Promise<void>;
    Save (config: Config): Promise<void>;
}

export {
    IConfigService
};
