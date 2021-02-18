// Load in any environment variables from .env file before doing anything.
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import http from 'http';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import compression from 'compression';

import { UserAccount } from './infra/DemoModel';

function RunServer (): void {
    // Init
    const app = express();

    // Express setting
    app.enable('trust proxy');

    // Middleware setting
    app.use(helmet()); // Secure HTTP header
    app.use(cookieParser()); // Parse Cookie header and populate req.cookies
    app.use(bodyParser.json({ limit: '5mb' }));
    app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));
    app.use(compression()); // Compress all responses

    // Start node server
    const server = http.createServer(app);
    const port = process.env.PORT ?? '8080';
    server.keepAliveTimeout = 65000; // Override default timeout to avoid HTTP 502 on AWS ALB
    server.listen(port);
}

RunServer();

// Demo.
(async (): Promise<void> => {
    const result: UserAccount[] = await UserAccount.FetchAllMembers();
    console.log(result);
})();
