import { ErrorOr } from '../../../../core/Error';
import { Service } from '../../../../core/Service';
import { GetConfigSTO } from '../../application/getConfig/GetConfigDTO';

abstract class IGetConfigService extends Service {
    public abstract Get (): Promise<ErrorOr<GetConfigSTO>>;
}

export { IGetConfigService };
