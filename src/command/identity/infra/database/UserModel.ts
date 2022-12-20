import { BaseModel } from '../../../../infra/database/BaseModel';

class UserModel extends BaseModel {
    public static get tableName (): string {
        return 'User';
    }

    public static get idColumn (): string {
        return 'uid';
    }

    // public shortUid!: number;

    // public uid!: string;

    // public name!: string;

    // public isAI!: number;

    // public isDeleted!: number;

    // public lastLoginTime!: string;
}

export { UserModel };
