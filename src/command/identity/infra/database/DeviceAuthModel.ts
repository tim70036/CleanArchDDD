import { EntityId } from '../../../../core/EntityId';
import { BaseModel } from '../../../../infra/database/BaseModel';
import { User } from '../../domain/model/User';
import { DomainErrorOr } from '../../../../core/DomainError';
import { Result } from '../../../../core/Result';
import Objection from 'objection';

class DeviceAuthModel extends BaseModel {
    public static get tableName (): string {
        return 'DeviceAuth';
    }

    public static get idColumn (): string {
        return 'uid';
    }

    public uid!: string;

    public deviceId!: string;

    public isValid!: number;
}

export { DeviceAuthModel };
