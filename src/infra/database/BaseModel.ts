/* eslint-disable @typescript-eslint/naming-convention */


import { Model } from 'objection';
import { knexReplicaClient } from './Database';

class BaseModel extends Model {

}

BaseModel.tableName = 'Base';
const ReadOnlyModel = BaseModel.bindKnex(knexReplicaClient);

export {
    BaseModel,
    ReadOnlyModel,
};
