
import { Result } from '../../../../core/Error';
import { ValueObject } from '../../../../core/ValueObject';
import { DomainErrorOr } from '../../../../core/DomainError';
import { saferJoi } from '../../../../common/SaferJoi';

interface NameProps {
    value: string;
}

class Name extends ValueObject<NameProps> {
    private static readonly schema = saferJoi.string().min(1).max(8);

    public get Value (): string {
        return this.props.value;
    }

    public static Create (name: string): DomainErrorOr<Name> {
        const { error } = Name.schema.validate(name);
        if (error) return Result.Fail(`Failed creating class[${Name.name}] with message[${error.message}]`);

        return Result.Ok<Name>(
            new Name({ value: name })
        );
    }
}

export { NameProps, Name };
