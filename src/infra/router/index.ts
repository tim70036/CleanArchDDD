import { Application } from 'express';
import { MaintenanceBlocker } from './middleware/MaintenanceBlocker';
import { testRouter } from './TestRouter';
import { apiRouter } from './ApiRouter';
import { adminRouter } from './AdminRouter';


function InitRouter (app: Application): void {
    app.use(MaintenanceBlocker);

    app.use('/api', apiRouter);
    app.use('/admin', adminRouter);
    app.use('/test', testRouter);
}

export {
    InitRouter,
};
