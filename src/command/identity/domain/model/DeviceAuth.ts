
import { Result } from '../../../../core/Error';
import { ValueObject } from '../../../../core/ValueObject';
import { DomainErrorOr } from '../../../../core/DomainError';
import { saferJoi } from '../../../../common/SaferJoi';

interface DeviceAuthProps {
    deviceId: string;
    isValid: boolean;
}

class DeviceAuth extends ValueObject<DeviceAuthProps> {
    private static readonly schema = saferJoi.object({
        deviceId: saferJoi.string().min(6).max(100).allow(''),
        isValid: saferJoi.bool()
    })

    public static Create (props: DeviceAuthProps): DomainErrorOr<DeviceAuth> {
        const { error } = DeviceAuth.schema.validate(props);
        if (error) return Result.Fail(`Failed creating class[${DeviceAuth.name}] with message[${error.message}]`);

        return Result.Ok<DeviceAuth>(
            new DeviceAuth({ ...props })
        );
    }

    public static CreateDefault (): DomainErrorOr<DeviceAuth> {
        const props = {
            deviceId: '',
            isValid: false
        };

        return DeviceAuth.Create(props);
    }
}

export { DeviceAuthProps, DeviceAuth };
