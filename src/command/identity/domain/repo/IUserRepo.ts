import { DomainErrorOr } from '../../../../core/DomainError';
import { Repo } from '../../../../core/Repo';
import { User } from '../model/User';

abstract class IUserRepo extends Repo<User> {
    public abstract GetByDeviceId (deviceId: string): Promise<DomainErrorOr<User>>;

    public abstract GetByLineId (lineId: string): Promise<DomainErrorOr<User>>;

    public abstract ShortUidExists (shortUid: number): Promise<boolean>;
}

export { IUserRepo };
