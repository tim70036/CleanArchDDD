import { ErrorOr } from '../../../../core/Error';
import { Service } from '../../../../core/Service';
import { Session } from '../model/Session';

abstract class ISessionService extends Service {
    public abstract Auth(token: string): Promise<ErrorOr<Session>>;
}

export { ISessionService };
