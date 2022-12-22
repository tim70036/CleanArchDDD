import { DomainErrorOr } from '../../../../core/DomainError';
import { Service } from '../../../../core/Service';
import { User } from '../model/User';

abstract class IRegisterService extends Service {
    public abstract CreateDefaultUser(): Promise<DomainErrorOr<User>>;
}

export { IRegisterService };
