import { Result, ErrOr } from "../../../../core/Result";
import { ValueObject } from "../../../../core/ValueObject";
import { saferJoi } from "../../../../common/SaferJoi";
import { InvalidDataError } from "../../../../common/CommonError";

interface DeviceAuthProps {
  deviceId: string;
  isValid: boolean;
}

class DeviceAuth extends ValueObject<DeviceAuthProps> {
  private static readonly schema = saferJoi.object({
    deviceId: saferJoi.string().min(6).max(100).allow(""),
    isValid: saferJoi.bool(),
  });

  public static Create(props: DeviceAuthProps): ErrOr<DeviceAuth> {
    const { error } = DeviceAuth.schema.validate(props);
    if (error)
      return new InvalidDataError(
        `Failed creating class[${DeviceAuth.name}] with message[${error.message}]`,
      );

    return Result.Ok<DeviceAuth>(new DeviceAuth({ ...props }));
  }

  public static CreateDefault(): ErrOr<DeviceAuth> {
    const props = {
      deviceId: "",
      isValid: false,
    };

    return DeviceAuth.Create(props);
  }
}

export { DeviceAuthProps, DeviceAuth };
