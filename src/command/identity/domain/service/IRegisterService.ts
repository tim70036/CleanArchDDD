import { ErrOr } from '../../../../core/Err';
import { Service } from '../../../../core/Service';
import { User } from '../model/User';

abstract class IRegisterService extends Service {
    public abstract CreateDefaultUser(): Promise<ErrOr<User>>;
}

export { IRegisterService };
