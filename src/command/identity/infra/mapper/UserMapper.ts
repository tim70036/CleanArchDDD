import { ModelObject } from 'objection';
import { fromBinaryUUID } from 'binary-uuid';
import { ErrorOr } from '../../../../core/Error';
import { DeviceAuthModel } from '../database/DeviceAuthModel';
import { UserModel } from '../database/UserModel';
import { LineAuthModel } from '../database/LineAuthModel';
import { EntityId } from '../../../../core/EntityId';
import { Name } from '../../domain/model/Name';
import dayjs from 'dayjs';
import { LineAuth } from '../../domain/model/LineAuth';
import { DeviceAuth } from '../../domain/model/DeviceAuth';
import { Result } from '../../../../core/Result';
import { User } from '../../domain/model/User';

class UserMapper {
    public static ToDomain (dto: {
        userDTO: ModelObject<UserModel>;
        deviceAuthDTO: ModelObject<DeviceAuthModel>;
        lineAuthDTO: ModelObject<LineAuthModel>;
    }): ErrorOr<User> {
        const uidOrError = EntityId.CreateFrom(fromBinaryUUID(dto.userDTO.uid));
        const nameOrError = Name.Create(dto.userDTO.name);

        const deviceAuthOrError = DeviceAuth.Create({ deviceId: dto.deviceAuthDTO.deviceId, isValid: dto.deviceAuthDTO.isValid === 1 });
        const lineAuthOrError = LineAuth.Create({ lineId: dto.lineAuthDTO.lineId, isValid: dto.lineAuthDTO.isValid === 1 });

        const dtoResult = Result.Combine([uidOrError, nameOrError, deviceAuthOrError, lineAuthOrError]);
        if (dtoResult.IsFailure())
            return dtoResult;

        const userOrError = User.CreateFrom({
            shortUid: dto.userDTO.shortUid,
            name: nameOrError.Value as Name,
            isBanned: dto.userDTO.isBanned === 1,
            isDeleted: dto.userDTO.isDeleted === 1,
            isAI: dto.userDTO.isAI === 1,
            lastLoginTime: dayjs.utc(dto.userDTO.lastLoginTime),

            deviceAuth: deviceAuthOrError.Value as DeviceAuth,
            lineAuth: lineAuthOrError.Value as LineAuth,
        }, uidOrError.Value as EntityId);

        return userOrError;
    }
}

export { UserMapper };
