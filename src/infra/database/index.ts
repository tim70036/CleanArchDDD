import { Model } from 'objection';
import { knexClient } from './Database';

function InitDatabase (): void {
    Model.knex(knexClient);
}

export { InitDatabase };
