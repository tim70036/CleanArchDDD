import { fromBinaryUUID, toBinaryUUID } from 'binary-uuid';
import { EntityId } from '../../../../core/EntityId';
import { Result, ErrOr } from '../../../../core/Result';
import { User } from '../../domain/model/User';
import { IUserRepo } from '../../domain/repo/IUserRepo';
import { UserModel } from '../database/UserModel';
import { DeviceAuthModel } from '../database/DeviceAuthModel';
import { LineAuthModel } from '../database/LineAuthModel';
import { NotExistError } from '../../../../common/CommonError';
import { UserMapper } from '../mapper/UserMapper';
import { Transaction } from '../../../../core/Transaction';

class UserRepo extends IUserRepo {
    public constructor () {
        super();
    }

    public Exists (id: EntityId, trx?: Transaction | undefined): Promise<boolean> {
        throw new Error('Method not implemented.');
    }

    public async ShortUidExists (shortUid: number): Promise<boolean> {
        const userDTO = await UserModel.query().where('shortUid', shortUid);
        return userDTO.length > 0;
    }

    public async Get (id: EntityId): Promise<ErrOr<User>> {
        const userDTO = await UserModel.query().where('uid', id.Value);
        if (userDTO.length <= 0)
            return new NotExistError(`cannot find uid[${id.Value}] in table[${UserModel.tableName}]`);

        const deviceAuthDTO = await DeviceAuthModel.query().where('uid', id.Value);
        if (deviceAuthDTO.length <= 0)
            return new NotExistError(`cannot find uid[${id.Value}] in table[${DeviceAuthModel.tableName}]`);

        const lineAuthDTO = await LineAuthModel.query().where('uid', id.Value);
        if (lineAuthDTO.length <= 0)
            return new NotExistError(`cannot find uid[${id.Value}] in table[${LineAuthModel.tableName}]`);

        const userOrError = UserMapper.ToDomain({
            userDTO: userDTO[0],
            deviceAuthDTO: deviceAuthDTO[0],
            lineAuthDTO: lineAuthDTO[0],
        });

        return userOrError;
    }

    public async GetByDeviceId (deviceId: string): Promise<ErrOr<User>> {
        const result = await DeviceAuthModel.query().where('deviceId', deviceId);
        if (result.length <= 0)
            return new NotExistError(`cannot find deviceId[${deviceId}] in table[${DeviceAuthModel.tableName}]`);

        const uidOrError = EntityId.CreateFrom(fromBinaryUUID(result[0].uid));
        if (uidOrError.IsFailure())
            return uidOrError;
        const uid = uidOrError.Value;

        const userOrError = await this.Get(uid);
        if (userOrError.IsFailure())
            return userOrError;
        const user = userOrError.Value;

        return Result.Ok(user);
    }

    public async GetByLineId (lineId: string): Promise<ErrOr<User>> {
        const result = await LineAuthModel.query().where('lineId', lineId);
        if (result.length <= 0)
            return new NotExistError(`cannot find lineId[${lineId}] in table[${LineAuthModel.tableName}]`);

        const uidOrError = EntityId.CreateFrom(fromBinaryUUID(result[0].uid));
        if (uidOrError.IsFailure())
            return uidOrError;
        const uid = uidOrError.Value;

        const userOrError = await this.Get(uid);
        if (userOrError.IsFailure())
            return userOrError;
        const user = userOrError.Value;

        return Result.Ok(user);
    }

    public async Save (user: User, trx: Transaction): Promise<void> {
        await UserModel.query(trx.Raw).insert({
            uid: toBinaryUUID(user.id.Value),
            shortUid: user.props.shortUid,
            name: user.props.name.props.value,
            isBanned: user.props.isBanned ? 1 : 0,
            isAI: user.props.isAI ? 1 : 0,
            isDeleted: user.props.isDeleted ? 1 : 0,
            lastLoginTime: user.props.lastLoginTime.format(),
        }).onConflict().merge();

        const deviceAuth = user.props.deviceAuth;
        await DeviceAuthModel.query(trx.Raw).insert({
            uid: toBinaryUUID(user.id.Value),
            deviceId: deviceAuth.props.deviceId,
            isValid: deviceAuth.props.isValid ? 1 : 0,
        }).onConflict().merge();

        const lineAuth = user.props.lineAuth;
        await LineAuthModel.query(trx.Raw).insert({
            uid: toBinaryUUID(user.id.Value),
            lineId: lineAuth.props.lineId,
            isValid: lineAuth.props.isValid ? 1 : 0,
        }).onConflict().merge();

        return;
    }
}

export { UserRepo };
