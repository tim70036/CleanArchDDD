
import { ValueObject } from '../../../../core/ValueObject';
import { DomainErrorOr } from '../../../../core/DomainError';
import { saferJoi } from '../../../../common/SaferJoi';
import { Result } from '../../../../core/Result';
import { InvalidDataError } from '../../../../common/CommonError';

interface LineAuthProps {
    lineId: string;
    isValid: boolean;
}

class LineAuth extends ValueObject<LineAuthProps> {
    private static readonly schema = saferJoi.object({
        lineId: saferJoi.string().allow(''),
        isValid: saferJoi.bool()
    });

    public static Create (props: LineAuthProps): DomainErrorOr<LineAuth> {
        const { error } = LineAuth.schema.validate(props);
        if (error) return new InvalidDataError(`Failed creating class[${LineAuth.name}] with message[${error.message}]`);

        return Result.Ok<LineAuth>(
            new LineAuth({ ...props })
        );
    }

    public static CreateDefault (): DomainErrorOr<LineAuth> {
        const props = {
            lineId: '',
            isValid: false
        };

        return LineAuth.Create(props);
    }
}

export { LineAuthProps, LineAuth };
