import { BaseModel } from "../../../../infra/database/BaseModel";

class DeviceAuthModel extends BaseModel {
  public uid!: Buffer;

  public deviceId!: string;

  public isValid!: number;

  public static readonly tableName = "DeviceAuth";

  public static readonly idColumn = "uid";
}

export { DeviceAuthModel };
