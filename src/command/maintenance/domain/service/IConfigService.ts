import { Service } from '../../../../core/Service';
import { Config } from '../model/Config';
import { MaintenanceStatus } from '../model/MaintenanceStatus';

interface IConfigService extends Service {
    SetStatus (status: MaintenanceStatus): Promise<void>;
    Save (config: Config): Promise<void>;
}

export {
    IConfigService
};
