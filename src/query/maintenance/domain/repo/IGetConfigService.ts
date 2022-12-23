import { ErrOr } from '../../../../core/Result';
import { Service } from '../../../../core/Service';
import { GetConfigSTO } from '../../application/getConfig/GetConfigDTO';

abstract class IGetConfigService extends Service {
    public abstract Get (): Promise<ErrOr<GetConfigSTO>>;
}

export { IGetConfigService };
