
import { Result } from '../../../../core/Error';
import { ValueObject } from '../../../../core/ValueObject';
import { DomainErrorOr } from '../../../../core/DomainError';
import { saferJoi } from '../../../../common/SaferJoi';

interface TextProps {
    value: string;
}

class Text extends ValueObject<TextProps> {
    private static readonly schema = saferJoi.string().min(0).max(200);

    public get Value (): string {
        return this.props.value;
    }

    public static Create (text: string): DomainErrorOr<Text> {
        const { error } = Text.schema.validate(text);
        if (error) return Result.Fail(`Failed creating class[${Text.name}] with message[${error.message}]`);

        return Result.Ok<Text>(
            new Text({ value: text })
        );
    }
}

export { TextProps, Text };
