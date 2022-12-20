
import { Result } from '../../../../core/Error';
import { ValueObject } from '../../../../core/ValueObject';
import { DomainErrorOr } from '../../../../core/DomainError';
import { saferJoi } from '../../../../common/SaferJoi';
import dayjs from 'dayjs';

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

    public static Create (props: ConfigProps): DomainErrorOr<Config> {
        const { error } = Config.schema.validate(props);
        if (error) return Result.Fail(`Failed creating class[${Config.name}] with message[${error.message}]`);

        return Result.Ok<Config>(
            new Config({ ...props })
        );
    }
}

export { ConfigProps, Config };
