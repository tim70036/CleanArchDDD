import { Application } from 'express';
import { maintenanceBlocker } from './middleware/MaintenanceBlocker';
import { testRouter } from './TestRouter';
import { apiRouter } from './ApiRouter';


function InitRouter (app: Application): void {
    app.use(maintenanceBlocker);

    app.use('/api', apiRouter);
    app.use('/test', testRouter);
}

export {
    InitRouter,
};
