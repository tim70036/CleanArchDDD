/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Knex from 'knex';
import { CreateLogger } from '../../common/Logger';

const knexLogger = CreateLogger('KnexClient');
const knexClient = Knex({
    client: 'mysql',
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PWD,
        database: process.env.DB_NAME,
        timezone: 'Z'
    },

    // Stack trace capture for all query builders, raw queries and schema builders.
    // This has small performance overhead, so it is advised to use only for development.
    asyncStackTraces: false,

    // Connection pool.
    pool: {
        min: 2,
        max: 15,

        // This is called when the pool aquires a new connection from the database server.
        // Also, done(err, connection) callback must be called for knex to be able to decide if the connection is ok or it should be discarded.
        afterCreate: function (connection: any, done: any): void {
            knexLogger.debug(`connection created threadId[${connection.threadId}]`);
            done(null, connection);
        },
    },

    // How long (in ms) knex should wait before throwing a timeout error when acquiring a connection is not possible.
    // Could happen if all connections in pool are being used.
    acquireConnectionTimeout: 60000,

    // Knex contains some internal log functions for printing.
    // Here we overwrite these by providing alternative functions.
    // Different log functions can be used for separate knex instances.
    log: {
        warn (message: string): void {
            knexLogger.warn(message);
        },
        error (message: string): void {
            knexLogger.error(message);
        },
        deprecate (message: string): void {
            knexLogger.debug(message);
        },
        debug (message: string): void {
            knexLogger.debug(message);
        },
    },
});

export {
    knexClient,
};
