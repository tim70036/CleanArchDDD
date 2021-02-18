// Have to disable typecheck because hard to override Objection static method...
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import { Model } from 'objection';
import { knexClient } from './Database';

class BaseModel extends Model {
    // Override query() from Model.
    // Allow us to choose which knex instance to use in query.
    public static query () {
        return super.query(knexClient);
    }
}

class ReadOnlyModel extends Model {
    // Override query() from Model.
    // Allow us to choose which knex instance to use in query.
    // Should pass in read replica connections in the future.
    public static query () {
        return super.query(knexClient);
    }
}

export {
    BaseModel,
    ReadOnlyModel
};
