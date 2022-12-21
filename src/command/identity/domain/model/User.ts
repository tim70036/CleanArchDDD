import dayjs from 'dayjs';
import { Name } from './Name';
import { AggregateRoot } from '../../../../core/AggregateRoot';
import { saferJoi } from '../../../../common/SaferJoi';
import { DeviceAuth } from './DeviceAuth';
import { DomainErrorOr } from '../../../../core/DomainError';
import { Result } from '../../../../core/Result';
import { UserCreatedEvent } from '../event/UserCreatedEvent';
import { InvalidDataError } from '../../../../common/CommonError';
import { LineAuth } from './LineAuth';
import { EntityId } from '../../../../core/EntityId';

interface UserProps {
    shortUid: number;
    name: Name;
    isBanned: boolean;
    isDeleted: boolean;
    isAI: boolean;
    lastLoginTime: dayjs.Dayjs;

    deviceAuth: DeviceAuth;
    lineAuth: LineAuth;
}

class User extends AggregateRoot<UserProps> {
    private static readonly schema = saferJoi.object({
        shortUid: saferJoi.number().integer(),
        name: saferJoi.object().instance(Name),
        isBanned: saferJoi.bool(),
        isDeleted: saferJoi.bool(),
        isAI: saferJoi.bool(),
        lastLoginTime: saferJoi.object().instance(dayjs.Dayjs),

        deviceAuth: saferJoi.object().instance(DeviceAuth),
        lineAuth: saferJoi.object().instance(LineAuth),
    });

    public static Create (props: UserProps): DomainErrorOr<User> {
        const { error } = User.schema.validate(props);
        if (error) return new InvalidDataError(`Failed creating class[${User.name}] with message[${error.message}]`);

        const user = new User(props);
        user.domainEvents.push(new UserCreatedEvent(user.id));

        return Result.Ok(user);
    }

    public static CreateFrom (props: UserProps, id: EntityId): DomainErrorOr<User> {
        const { error } = User.schema.validate(props);
        if (error) return new InvalidDataError(`Failed creating class[${User.name}] with message[${error.message}]`);

        const user = new User(props, id);
        user.domainEvents.push(new UserCreatedEvent(user.id));

        return Result.Ok(user);
    }
}

export { User };
