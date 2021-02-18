import { RelationMappings } from 'objection';
import { BaseModel } from './BaseModel';

class MemberInfo extends BaseModel {
    // Model settings
    public static readonly tableName: string = 'MemberInfo';

    public static readonly idColumn: string = 'memId';

    public static readonly relationMappings: RelationMappings = {};
}

class UserAccount extends BaseModel {
    // Model settings
    public static readonly tableName: string = 'UserAccount';

    public static readonly idColumn: string = 'uid';

    public static readonly relationMappings: RelationMappings = {};

    public static async FetchAllUsers (): Promise<UserAccount[]> {
        const result = await UserAccount.query().select('uid');
        return result;
    }

    public static async FetchAllMembers (): Promise<UserAccount[]> {
        const result = await UserAccount.query().join('MemberInfo', 'MemberInfo.uid', 'UserAccount.uid').select('UserAccount.*', 'MemberInfo.*');
        return result;
    }
}

export {
    UserAccount,
    MemberInfo
};
