import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import { DomainErrorOr } from '../../../../core/DomainError';
import { Result } from '../../../../core/Result';
import { DeviceAuth } from '../../domain/model/DeviceAuth';
import { Name } from '../../domain/model/Name';
import { User } from '../../domain/model/User';
import { IRegisterService } from '../../domain/service/IRegisterService';
import { IUserRepo } from '../../domain/repo/IUserRepo';
import { DuplicatedError, InternalServerError } from '../../../../common/CommonError';
import { LineAuth } from '../../domain/model/LineAuth';

class RegisterService extends IRegisterService {
    private readonly userRepo: IUserRepo;

    public constructor (userRepo: IUserRepo) {
        super();
        this.userRepo = userRepo;
    }

    public async CreateDefaultUser (): Promise<DomainErrorOr<User>> {
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

    private async GenUniqueShortUid (): Promise<DomainErrorOr<number>> {
        for (let tryCount = 0 ; tryCount < 10 ; tryCount += 1) {
            try {
                const shortUid = parseInt(uuidv4(), 16) % 100000000;
                const didExist = await this.userRepo.ShortUidExists(shortUid);
                if (!didExist) return Result.Ok(shortUid);

                this.logger.warn(`generated duplicated shortUid[shortUid]`);
            } catch (err: unknown) {
                return new InternalServerError(`${(err as Error).stack}`);
            }
        }

        return new DuplicatedError(`cannot generate an unique shortUid`);
    }
}

export {
    RegisterService
};
