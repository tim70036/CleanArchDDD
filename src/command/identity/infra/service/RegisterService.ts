import dayjs from 'dayjs';
import { DomainErrorOr } from '../../../../core/DomainError';
import { Result } from '../../../../core/Result';
import { DeviceAuth } from '../../domain/model/DeviceAuth';
import { Name } from '../../domain/model/Name';
import { PasswordAuth } from '../../domain/model/PasswordAuth';
import { User } from '../../domain/model/User';
import { IRegisterService } from '../../domain/service/IRegisterService';

class RegisterService implements IRegisterService {
    public CreateDefaultUser (): DomainErrorOr<User> {
        const nameOrError = Name.Create('default');
        const passwordAuthOrError = PasswordAuth.CreateDefault();
        const deviceAuthOrError = DeviceAuth.CreateDefault();

        const dtoResult = Result.Combine([nameOrError, passwordAuthOrError, deviceAuthOrError]);
        if (dtoResult.IsFailure())
            return dtoResult;

        const name = nameOrError.Value as Name;
        const passwordAuth = passwordAuthOrError.Value as PasswordAuth;
        const deviceAuth = deviceAuthOrError.Value as DeviceAuth;

        const userOrError = User.Create({
            shortUid: shortUid,
            name: name,
            isBanned: false,
            isDeleted: false,
            isAI: false,
            lastLoginTime: dayjs.utc(),
            passwordAuth: passwordAuth,
            deviceAuth: deviceAuth,
        });

        return userOrError;
    }
}

export {
    RegisterService
};
