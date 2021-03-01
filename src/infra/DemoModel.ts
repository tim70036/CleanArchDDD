import { Model, RelationMappings, QueryBuilder } from 'objection';
import { BaseModel } from './BaseModel';


class CashTransaction extends BaseModel {
    // Model settings
    public static readonly tableName: string = 'CashTransaction';

    public static readonly idColumn: string = 'txnId';

    public static readonly relationMappings: RelationMappings = {};
}


class TavernInfo extends BaseModel {
    // Model settings
    public static readonly tableName: string = 'TavernInfo';

    public static readonly idColumn: string = 'tavernId';

    public static readonly relationMappings: RelationMappings = {};
}


class MemberInfo extends BaseModel {
    // Model settings
    public static readonly tableName: string = 'MemberInfo';

    public static readonly idColumn: string = 'memId';

    public static readonly relationMappings: RelationMappings = {
        tavernInfo: {
            relation: Model.BelongsToOneRelation,
            modelClass: TavernInfo,
            join: {
                from: 'MemberInfo.tavernId',
                to: 'TavernInfo.tavernId',
            },
        },
    };


    // Sub query example.
    public static async FectchMember (memId: string): Promise<MemberInfo[]> {
        const query = MemberInfo.query().where('memId', MemberInfo.FetchMemberQuery(memId));
        console.log(query.toKnexQuery().toQuery());

        const result = await query;
        return result;
    }

    // Note that this query is not executed.
    // You can put this inside other query.
    public static FetchMemberQuery (memId: string): QueryBuilder<Model, Model[]> {
        return MemberInfo.query().where({ memId: memId }).select('memId');
    }
}


class UserAccount extends BaseModel {
    // Model settings
    public static readonly tableName: string = 'UserAccount';

    public static readonly idColumn: string = 'uid';

    // Usage of this thing:
    // https://stackoverflow.com/questions/60512031/in-objection-js-whats-the-benefit-of-setting-up-relationmappings
    public static readonly relationMappings: RelationMappings = {
        userMemberInfo: {
            relation: Model.HasManyRelation,
            modelClass: MemberInfo,
            join: {
                from: 'UserAccount.uid',
                to: 'MemberInfo.uid',
            },
        },

        userCashTx: {
            relation: Model.HasManyRelation,
            modelClass: CashTransaction,
            join: {
                from: 'UserAccount.uid',
                to: 'CashTransaction.uid',
            },
        },

        mySelf: {
            relation: Model.HasOneRelation,
            modelClass: UserAccount,
            join: {
                from: 'UserAccount.uid',
                to: 'UserAccount.uid',
            }
        }
    };

    // Select all example.
    public static async FetchAllUsers (): Promise<UserAccount[]> {
        const result = await UserAccount.query().select('uid');
        return result;
    }

    // Join example 1.
    // Using knex join.
    public static async FetchWithMemberRaw (): Promise<UserAccount[]> {
        const query = UserAccount.query()
            .join('MemberInfo', 'MemberInfo.uid', 'UserAccount.uid')
            .select('UserAccount.*', 'MemberInfo.*');

        console.log(query.toKnexQuery().toQuery());
        const result = await query;
        return result;
    }

    public static async FetchWithMembersRelated (uid: string): Promise<UserAccount[]> {
        // To use relatedQuery:
        // Must specify for().
        // Must specify relationMappings.
        const query1 = UserAccount.relatedQuery('userMemberInfo').for(uid);
        console.log('\nUsing relatedQuery():');
        console.log(query1.toKnexQuery().toQuery());

        // $relatedQuery() is used on model instance:
        // No need for().
        const user = await UserAccount.query().findById(uid);
        const query2 = user.$relatedQuery('userMemberInfo');
        console.log('\nUsing $relatedQuery():');
        console.log(query2.toKnexQuery().toQuery());

        const result = await query2;
        return result;
    }

    public static async FetchWithMemberGraph (uid: string): Promise<UserAccount> {
        // Fetch will get data using multiple queries.
        // const query1 = UserAccount.query().findById(uid).withGraphFetched('[userMemberInfo, mySelf]');
        const query1 = UserAccount.query().findById(uid).withGraphFetched('[userMemberInfo.tavernInfo]');
        // const query1 = UserAccount.query().findById(uid).withGraphFetched('[userMemberInfo, mySelf.mySelf.mySelf]');

        // Joined will get data using only 1 query.
        const query2 = UserAccount.query().findById(uid).withGraphJoined('userMemberInfo');

        // Unfortunately, we cannot print query under this eager loading shit.

        const result = await query1;
        return result;
    }
}


export {
    UserAccount,
    MemberInfo
};
