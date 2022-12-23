import { ErrorOr } from '../../../../core/Error';
import { Repo } from '../../../../core/Repo';
import { User } from '../model/User';

abstract class IUserRepo extends Repo<User> {
    public abstract GetByDeviceId (deviceId: string): Promise<ErrorOr<User>>;

    public abstract GetByLineId (lineId: string): Promise<ErrorOr<User>>;

    public abstract ShortUidExists (shortUid: number): Promise<boolean>;
}

export { IUserRepo };
