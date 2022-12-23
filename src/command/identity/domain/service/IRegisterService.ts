import { ErrorOr } from '../../../../core/Error';
import { Service } from '../../../../core/Service';
import { User } from '../model/User';

abstract class IRegisterService extends Service {
    public abstract CreateDefaultUser(): Promise<ErrorOr<User>>;
}

export { IRegisterService };
