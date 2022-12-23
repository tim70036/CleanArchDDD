
import { Result, ErrOr } from '../../../../core/Result';
import { ValueObject } from '../../../../core/ValueObject';
import { saferJoi } from '../../../../common/SaferJoi';
import dayjs from 'dayjs';
import { InvalidDataError } from '../../../../common/CommonError';

interface ConfigProps {
    startTime: dayjs.Dayjs;
    announcement: string;
    ipWhitelist: string[];
}

class Config extends ValueObject<ConfigProps> {
    private static readonly schema = saferJoi.object({
        startTime: saferJoi.object().instance(dayjs.Dayjs),
        announcement: saferJoi.string().min(0).max(1000),
        ipWhitelist: saferJoi.array().items(saferJoi.string().ip()).min(0).max(100),
    });

    public static Create (props: ConfigProps): ErrOr<Config> {
        const { error } = Config.schema.validate(props);
        if (error) return new InvalidDataError(`Failed creating class[${Config.name}] with message[${error.message}]`);

        return Result.Ok<Config>(
            new Config({ ...props })
        );
    }
}

export { ConfigProps, Config };
