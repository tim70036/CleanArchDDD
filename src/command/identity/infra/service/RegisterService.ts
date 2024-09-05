import dayjs from 'dayjs';
import { v1 as uuidv1 } from 'uuid';
import { Result, ErrOr } from '../../../../core/Result';
import { DeviceAuth } from '../../domain/model/DeviceAuth';
import { Name } from '../../domain/model/Name';
import { User } from '../../domain/model/User';
import { IRegisterService } from '../../domain/service/IRegisterService';
import { IUserRepo } from '../../domain/repo/IUserRepo';
import { DuplicatedError, InternalServerError } from '../../../../common/CommonError';
import { LineAuth } from '../../domain/model/LineAuth';
import { identityContainer } from '../../container';

class RegisterService extends IRegisterService {
    private readonly userRepo = identityContainer.resolve<IUserRepo>('IUserRepo');

    public async CreateDefaultUser (): Promise<ErrOr<User>> {
        const shortUidOrError = await this.GenUniqueShortUid();
        if (shortUidOrError.IsFailure())
            return shortUidOrError;

        const shortUid = shortUidOrError.Value;
        const nameOrError = Name.Create('default');
        const deviceAuthOrError = DeviceAuth.CreateDefault();
        const lineAuthOrError = LineAuth.CreateDefault();

        const dtoResult = Result.Combine([nameOrError, deviceAuthOrError, lineAuthOrError]);
        if (dtoResult.IsFailure())
            return dtoResult;

        const name = nameOrError.Value as Name;
        const deviceAuth = deviceAuthOrError.Value as DeviceAuth;
        const lineAuth = lineAuthOrError.Value as LineAuth;

        const userOrError = User.Create({
            shortUid: shortUid,
            name: name,
            isBanned: false,
            isDeleted: false,
            isAI: false,
            lastLoginTime: dayjs.utc(),
            lineAuth: lineAuth,
            deviceAuth: deviceAuth,
        });

        return userOrError;
    }

    private async GenUniqueShortUid (): Promise<ErrOr<number>> {
        for (let tryCount = 0 ; tryCount < 10 ; tryCount += 1) {
            try {
                const shortUid = parseInt(uuidv1(), 16) % 100000000;
                const didExist = await this.userRepo.ShortUidExists(shortUid);
                if (!didExist) return Result.Ok(shortUid);

                this.logger.warn(`generated duplicated shortUid`, {
                    shortUid: shortUid,
                    tryCount: tryCount,
                });
            } catch (error) {
                return new InternalServerError(`${(error as Error).stack}`);
            }
        }

        return new DuplicatedError(`cannot generate an unique shortUid`);
    }
}

export { RegisterService };
