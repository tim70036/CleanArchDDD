
import { Result } from '../../../../core/Error';
import { ValueObject } from '../../../../core/ValueObject';
import { DomainErrorOr } from '../../../../core/DomainError';
import { saferJoi } from '../../../../common/SaferJoi';

interface TitleProps {
    value: string;
}

class Title extends ValueObject<TitleProps> {
    private static readonly schema = saferJoi.string().min(0).max(20);

    public static Create (title: string): DomainErrorOr<Title> {
        const { error } = Title.schema.validate(title);
        if (error) return Result.Fail(`Failed creating class[${Title.name}] with message[${error.message}]`);

        return Result.Ok<Title>(
            new Title({ value: title })
        );
    }
}

export { TitleProps, Title };
