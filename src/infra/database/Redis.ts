/* eslint-disable @typescript-eslint/naming-convention */
import { createClient } from 'redis'; // Using npm alias to avoid conflict with the old redis package.
import { CreateLogger } from '../../common/Logger';

const redisClient = createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/${process.env.REDIS_DB}`,
    socket: {
        reconnectStrategy: (curRetryCount) => Math.min(curRetryCount * 50, 500), // Return wait time in milliseconds prior to attempting a reconnect.
    }
});

// Subscribing to a channel requires a dedicated stand-alone connection.
// You can easily get one by .duplicate()ing an existing Redis connection.
const redisSubClient = redisClient.duplicate();


const instances = [
    { client: redisClient, name: 'RedisClient' },
    { client: redisSubClient, name: 'RedisSubClient' },
];

instances.forEach((instance) => {
    const logger = CreateLogger(instance.name);
    // The client is initiating a connection to the server.
    instance.client.on('connect', () => {
        logger.info(`start connecting to ${process.env.REDIS_HOST} on port[${process.env.REDIS_PORT}] DB[${process.env.REDIS_DB}]`);
    });

    // The client successfully initiated the connection to the server.
    // Client will emit ready once a connection is established. Commands issued before the ready event are queued, then replayed just before this event is emitted.
    instance.client.on('ready', () => {
        logger.info(`connected to ${process.env.REDIS_HOST} on port[${process.env.REDIS_PORT}] DB[${process.env.REDIS_DB}]`);
    });

    // The client disconnected the connection to the server via .quit() or .disconnect().
    instance.client.on('end', () => {
        logger.warn(`disconnected`);
    });

    // The client is trying to reconnect to the server.
    instance.client.on('reconnecting', () => {
        logger.warn(`reconnecting`);
    });

    instance.client.on('error', (err) => {
        logger.error(err);
    });
});

const defaultExpire = {
    ThreeMinutes: 60 * 3,
    FiveMinutes: 60 * 5,
    OneHour: 60 * 60,
    OneDay: 60 * 60 * 24,
    SevenDays: 60 * 60 * 24 * 7,
    ThirtyDays: 60 * 60 * 24 * 30,
    NineDays: 60 * 60 * 24 * 90
};

export { redisClient, redisSubClient, defaultExpire };
