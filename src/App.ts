// Load in any environment variables from .env file before doing anything.
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import http from 'http';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import compression from 'compression';

import { InitRouter } from './infra/router';
import { InitDatabase } from './infra/database';
import { InitSubscriber } from './infra/subscriber';
import { CreateLogger } from './common/Logger';

const logger = CreateLogger('app');
function RunServer (): void {
    // Init
    const app = express();

    // Express setting
    app.enable('trust proxy');

    // Middleware setting
    app.use(helmet()); // Secure HTTP header
    app.use(cookieParser()); // Parse Cookie header and populate req.cookies
    app.use(express.json({ limit: '5mb' }));
    app.use(express.urlencoded({ extended: true, limit: '5mb' }));
    app.use(compression()); // Compress all responses

    // Databases
    InitDatabase();

    // Routes
    InitRouter(app);

    // Domain event subsribers
    InitSubscriber();
    logger.info(`component intialized`);


    // Start node server
    const server = http.createServer(app);
    const port = process.env.PORT ?? '8080';
    server.keepAliveTimeout = 65000; // Override default timeout to avoid HTTP 502 on AWS ALB
    server.listen(port);
    logger.info(`start listening on port[${port}]`);
}

RunServer();
