import dayjs from "dayjs";
import { Name } from "./Name";
import { AggregateRoot } from "../../../../core/AggregateRoot";
import { saferJoi } from "../../../../common/SaferJoi";
import { PasswordAuth } from "./PasswordAuth";
import { DeviceAuth } from "./DeviceAuth";
import { DomainErrorOr } from "../../../../core/DomainError";

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

    }
}

export { User };
