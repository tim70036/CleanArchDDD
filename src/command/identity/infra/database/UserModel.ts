import { BaseModel } from '../../../../infra/database/BaseModel';

class UserModel extends BaseModel {
    public uid!: string;

    public shortUid!: number;

    public name!: string;

    public isBanned!: number;

    public isAI!: number;

    public isDeleted!: number;

    public lastLoginTime!: string;

    public static get tableName (): string {
        return 'User';
    }

    public static get idColumn (): string {
        return 'uid';
    }
}

export { UserModel };
