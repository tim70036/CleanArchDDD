
import { Result } from '../../../../core/Result';
import { ValueObject } from '../../../../core/ValueObject';
import { DomainErrorOr } from '../../../../core/DomainError';
import { saferJoi } from '../../../../common/SaferJoi';
import { InvalidDataError } from '../../../../common/CommonError';

interface TextProps {
    value: string;
}

class Text extends ValueObject<TextProps> {
    private static readonly schema = saferJoi.string().min(0).max(200);

    public static Create (text: string): DomainErrorOr<Text> {
        const { error } = Text.schema.validate(text);
        if (error) return new InvalidDataError(`Failed creating class[${Text.name}] with message[${error.message}]`);

        return Result.Ok<Text>(
            new Text({ value: text })
        );
    }
}

export { TextProps, Text };
