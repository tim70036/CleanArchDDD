import dayjs from "dayjs";
import { Name } from "./Name";
import { AggregateRoot } from "../../../../core/AggregateRoot";
import { saferJoi } from "../../../../common/SaferJoi";
import { PasswordAuth } from "./PasswordAuth";
import { DeviceAuth } from "./DeviceAuth";
import { DomainErrorOr } from "../../../../core/DomainError";
import { Result } from "../../../../core/Error";
import { UserCreatedEvent } from "../event/UserCreatedEvent";

interface UserProps {
    shortUid: number;
    name: Name;
    isBanned: boolean;
    isDeleted: boolean;
    isAI: boolean;
    lastLoginTime: dayjs.Dayjs;

    passwordAuth: PasswordAuth;
    deviceAuth: DeviceAuth;
}

class User extends AggregateRoot<UserProps> {
    private static readonly schema = saferJoi.object({
        shortUid: saferJoi.number().integer(),
        name: saferJoi.object().instance(Name),
        isBanned: saferJoi.bool(),
        isDeleted: saferJoi.bool(),
        isAI: saferJoi.bool(),
        lastLoginTime: saferJoi.object().instance(dayjs.Dayjs),

        passwordAuth:saferJoi.object().instance(PasswordAuth),
        deviceAuth: saferJoi.object().instance(DeviceAuth),
    });

    public static Create(props: UserProps): DomainErrorOr<User> {
        const { error } = User.schema.validate(props);
        if (error) return Result.Fail(`Failed creating class[${User.name}] with message[${error.message}]`);

        const user = new User(props);
        user.domainEvents.push(new UserCreatedEvent(user.id));

        return Result.Ok(user);
    }
}

export { User };
