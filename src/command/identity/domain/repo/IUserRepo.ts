import { DomainErrorOr } from '../../../../core/DomainError';
import { Repo } from '../../../../core/Repo';
import { User } from '../model/User';

abstract class IUserRepo extends Repo<User> {
    public abstract GetByPassword (account: string, password: string): Promise<DomainErrorOr<User>>

    public abstract GetByDeviceId (deviceId: string): Promise<DomainErrorOr<User>>;

    public abstract AccountExists (account: string): Promise<boolean>;

    public abstract DeviceIdExists (deviceId: string): Promise<boolean>;

    public abstract ShortUidExists (shortUid: number): Promise<boolean>;
}

export {
    IUserRepo
};
