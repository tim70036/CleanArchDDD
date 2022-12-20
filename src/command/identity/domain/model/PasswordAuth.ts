
import { Result } from '../../../../core/Error';
import { ValueObject } from '../../../../core/ValueObject';
import { DomainErrorOr } from '../../../../core/DomainError';
import { saferJoi } from '../../../../common/SaferJoi';

interface PasswordAuthProps {
    account: string;
    password: string;
    isValid: boolean;
}

class PasswordAuth extends ValueObject<PasswordAuthProps> {
    private static readonly schema = saferJoi.object({
        account: saferJoi.string().min(6).max(20).allow(''),
        password: saferJoi.string().min(8).max(20).allow(''),
        isValid: saferJoi.bool()
    });

    public static Create (props: PasswordAuthProps): DomainErrorOr<PasswordAuth> {
        const { error } = PasswordAuth.schema.validate(props);
        if (error) return Result.Fail(`Failed creating class[${PasswordAuth.name}] with message[${error.message}]`);

        return Result.Ok<PasswordAuth>(
            new PasswordAuth({ ...props })
        );
    }

    public static CreateDefault (): DomainErrorOr<PasswordAuth> {
        const props = {
            account: '',
            password: '',
            isValid: false
        };

        return PasswordAuth.Create(props);
    }
}

export { PasswordAuthProps, PasswordAuth };
