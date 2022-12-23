import { ErrOr } from '../../../../core/Result';
import { Service } from '../../../../core/Service';
import { Session } from '../model/Session';

abstract class ISessionService extends Service {
    public abstract Auth(token: string): Promise<ErrOr<Session>>;
}

export { ISessionService };
