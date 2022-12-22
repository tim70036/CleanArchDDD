import { DomainErrorOr } from '../../../../core/DomainError';
import { Service } from '../../../../core/Service';
import { Session } from '../model/Session';

abstract class ISessionService extends Service {
    public abstract Auth(token: string): Promise<DomainErrorOr<Session>>;
}

export { ISessionService };
