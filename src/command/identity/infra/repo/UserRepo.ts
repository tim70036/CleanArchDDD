import Objection from 'objection';
import { DomainErrorOr } from '../../../../core/DomainError';
import { EntityId } from '../../../../core/EntityId';
import { Result } from '../../../../core/Result';
import { User } from '../../domain/model/User';
import { IUserRepo } from '../../domain/repo/IUserRepo';
import { UserModel } from '../database/UserModel';
import { DeviceAuthModel } from '../database/DeviceAuthModel';
import { PasswordAuthModel } from '../database/PasswordAuthModel';

class UserRepo extends IUserRepo {
    private readonly userModel: UserModel;

    private readonly deviceAuthModel: DeviceAuthModel;

    private readonly passwordAuthModel: PasswordAuthModel;

    public constructor (userModel: UserModel, deviceAuthModel: DeviceAuthModel, passwordAuthModel: PasswordAuthModel) {
        super();
        this.userModel = userModel;
        this.deviceAuthModel = deviceAuthModel;
        this.passwordAuthModel = passwordAuthModel;
    }

    public Exists (id: EntityId, trx?: Objection.Transaction | undefined): Promise<boolean> {
        throw new Error('Method not implemented.');
    }

    public DeviceIdExists (deviceId: string): Promise<boolean> {
        throw new Error('Method not implemented.');
    }

    public async AccountExists (account: string): Promise<boolean> {
        const isExist = await this.passwordAuthModel.AccountExists(account);
        return isExist;
    }


    public async Get (uid: EntityId): Promise<DomainErrorOr<User>> {
        const userResultOrError = await this.userModel.Get(uid);
        const passwordResultOrError = await this.passwordAuthModel.GetByUid(uid);
        const dtoResult = Result.Combine([userResultOrError, passwordResultOrError]);

        if (dtoResult.IsFailure())
            return Result.Fail(dtoResult.Error);

        const userResult = userResultOrError.Value as UserModel;
        const passwordResult = passwordResultOrError.Value as PasswordAuthModel;

        const userOrError = UserMapper.ToDomain({
            userModel: userResult,
            passwordAuthModel: passwordResult,
            lineAuthModel: lineResult,
            appleAuthModel: appleResult,
            deviceAuthModel: deviceResult,
            googleAuthModel: googleResult,
            facebookAuthModel: facebookResult,

            emailCertificationModel: emailCertificationResult,
            phoneCertificationModel: phoneCertificationResult,
            realNameCertificationModel: realNameCertificationResult
        });

        if (userOrError.IsFailure())
            return Result.Fail(userOrError.Error);
        const user = userOrError.Value;

        return Result.Ok(user);
    }

    public async GetByPassword (account: string, password: string): Promise<DomainErrorOr<User>> {
        const userResultOrError = await this.passwordAuthModel.GetByPasswordAuth(account, password);
        if (userResultOrError.IsFailure())
            return Result.Fail(userResultOrError.Error);
        const userResult = userResultOrError.Value;

        const uidOrError = EntityId.CreateFrom(userResult.uid);
        if (uidOrError.IsFailure())
            return Result.Fail(uidOrError.Error);
        const uid = uidOrError.Value;

        const userOrError = await this.Get(uid);
        if (userOrError.IsFailure())
            return Result.Fail(userOrError.Error);
        const user = userOrError.Value;

        return Result.Ok(user);
    }

    public async GetByDeviceId (deviceId: string): Promise<DomainErrorOr<User>> {
        const userResultOrError = await this.deviceAuthModel.GetByDeviceAuth(deviceId);
        if (userResultOrError.IsFailure())
            return Result.Fail(userResultOrError.Error);
        const userResult = userResultOrError.Value;

        const uidOrError = EntityId.CreateFrom(userResult.uid);
        if (uidOrError.IsFailure())
            return Result.Fail(uidOrError.Error);
        const uid = uidOrError.Value;

        const userOrError = await this.Get(uid);
        if (userOrError.IsFailure())
            return Result.Fail(userOrError.Error);
        const user = userOrError.Value;

        return Result.Ok(user);
    }

    public async Save (user: User, trx: Objection.Transaction): Promise<void> {
        await this.userModel.Save(user, trx);
        await this.passwordAuthModel.Save(user, trx);
        await this.lineAuthModel.Save(user, trx);
        await this.appleAuthModel.Save(user, trx);
        await this.deviceAuthModel.Save(user, trx);
        await this.googleAuthModel.Save(user, trx);
        await this.facebookAuthModel.Save(user, trx);

        await this.emailCertificationModel.Save(user, trx);
        await this.phoneCertificationModel.Save(user, trx);
        await this.realNameCertificationModel.Save(user, trx);

        if (user.IsDisable)
            await this.DeleteSession(user.Id);

        return;
    }
}

export { UserRepo };
