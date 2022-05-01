/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/unbound-method */
import redis, { RedisClient } from 'redis';
import { CreateLogger } from '../../common/Logger';
import { promisify } from 'util';

const logger = CreateLogger('Redis');

const client = redis.createClient({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    db: process.env.REDIS_DB,
});

client.on('connect', () => {
    logger.info(`connected to ${process.env.REDIS_HOST} on port[${process.env.REDIS_PORT}] DB[${process.env.REDIS_DB}]`);
});

// Client will emit ready once a connection is established. Commands issued before the ready event are queued, then replayed just before this event is emitted.
client.on('ready', () => {
    logger.info(`ready`);
});

client.on('reconnecting', (info) => {
    logger.warn(`reconnecting with attempt[${info.attempt}]`);
});

client.on('warning', (info) => {
    logger.warn(info);
});

client.on('error', (err) => {
    logger.error(err);
});
interface AsyncRedisClient extends RedisClient {
    GetAsync(arg1: string): Promise<string | null>;
    MGetAsync(arg1: string[]): Promise<(string | null)[]>;
    SetAsync(arg1: string, arg2: string): Promise<unknown>;
    SetExpireAsync(arg1: string, arg2: string, arg3: string, arg4: number): Promise<unknown>;
    DelAsync(arg1: string): Promise<number>;
    ScanAsync(arg1: string, arg2: string, arg3: string): Promise<[string, string[]]>;
}

const redisClient: AsyncRedisClient = client as AsyncRedisClient;
redisClient.GetAsync = promisify(client.get).bind(client);
redisClient.SetAsync = promisify(client.set).bind(client);
redisClient.SetExpireAsync = promisify(client.set).bind(client);
redisClient.DelAsync = promisify(client.del).bind(client);
redisClient.MGetAsync = promisify(client.mget).bind(client);
redisClient.ScanAsync = promisify(client.scan).bind(client);

export { redisClient };
