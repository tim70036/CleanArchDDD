/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// Load in any environment variables from .env file before doing anything.
import dotenv from 'dotenv';
dotenv.config();

import 'reflect-metadata';

import express from 'express';
import http from 'http';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import responseTime from 'response-time';

// Init library before all other components.
import { InitDayjs } from './common/Dayjs';
InitDayjs();

import { InitRouter } from './infra/router';
import { InitDatabase } from './infra/database';
import { InitSubscriber } from './infra/subscriber';
import { maintenanceMaster } from './infra/MaintenanceMaster';
import { CreateLogger } from './common/Logger';
import { wsApp } from './infra/webSocket';

const logger = CreateLogger('app');

async function Run (): Promise<void> {
    // Databases
    await InitDatabase();

    // Domain event subscribers
    InitSubscriber();

    maintenanceMaster.Init();

    logger.info(`component initialized`);

    RunHttpApp();
    await RunWsApp();
}

function RunHttpApp (): void {
    const app = express();

    // Express setting
    app.enable('trust proxy');

    // Middleware setting
    app.use(helmet()); // Secure HTTP header
    app.use(cookieParser()); // Parse Cookie header and populate req.cookies
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ extended: true, limit: '50mb' }));
    app.use(compression()); // Compress all responses

    // Log out slow api.
    app.use(responseTime(function (req, res, time) {
        if (time > 5000) {
            logger.warn(`slow response detected ${req.method} ${req.url}`, {
                method: req.method,
                url: req.url,
                responseTimeMs: time
            });
        }
    }));

    // Routes
    InitRouter(app);

    // Start node server
    const server = http.createServer(app);
    const port = process.env.PORT_HTTP ?? '8080';
    server.keepAliveTimeout = 65000; // Override default timeout to avoid HTTP 502 on AWS ALB
    server.listen(port);
    logger.info(`HttpApp start listening on port[${port}]`);
}

async function RunWsApp (): Promise<void> {
    await wsApp.Init();

    const server = http.createServer();
    server.on('upgrade', wsApp.HandleUpgrade);

    const port = process.env.PORT_WS ?? '9487';
    server.listen(port);
    logger.info(`WsApp start listening on port[${port}]`);
}

Run();
