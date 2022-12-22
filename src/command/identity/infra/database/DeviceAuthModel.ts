import { BaseModel } from '../../../../infra/database/BaseModel';

class DeviceAuthModel extends BaseModel {
    public uid!: Buffer;

    public deviceId!: string;

    public isValid!: number;

    public static get tableName (): string {
        return 'DeviceAuth';
    }

    public static get idColumn (): string {
        return 'uid';
    }
}

export { DeviceAuthModel };
