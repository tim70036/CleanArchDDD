import { DomainErrorOr } from '../../../../core/DomainError';
import { Service } from '../../../../core/Service';
import { User } from '../model/User';

interface IRegisterService extends Service {
    CreateDefaultUser(): DomainErrorOr<User>;
}

export {
    IRegisterService
};
