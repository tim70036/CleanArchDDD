import { EntityId } from '../../../../core/EntityId';
import { BaseModel } from '../../../../infra/database/BaseModel';
import { User } from '../../domain/model/User';
import { DomainErrorOr } from '../../../../core/DomainError';
import { Result } from '../../../../core/Error';
import Objection from 'objection';

class PasswordAuthModel extends BaseModel {
    public static get tableName (): string {
        return 'PasswordAuth';
    }

    public static get idColumn (): string {
        return 'uid';
    }

    public uid!: string;

    public account!: string;

    public password!: string;

    public isValid!: number;
}

export { PasswordAuthModel };
