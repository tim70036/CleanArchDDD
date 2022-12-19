import { Model } from 'objection';
import { knexClient } from './Database';
import { redisClient, redisSubClient } from './Redis';

async function InitDatabase (): Promise<void> {
    Model.knex(knexClient);
    await redisClient.connect();
    await redisSubClient.connect();
}

export { InitDatabase };
