import { Application } from 'express';
import { MaintenanceBlocker } from './middleware/MaintenanceBlocker';
import { testRouter } from './test';
import { apiRouter } from './api';
import { adminRouter } from './admin';

function InitRouter (app: Application): void {
    app.use(MaintenanceBlocker);

    app.use('/api', apiRouter);
    app.use('/admin', adminRouter);
    app.use('/test', testRouter);
}

export {
    InitRouter,
};
