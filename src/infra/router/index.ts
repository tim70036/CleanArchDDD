import { Application } from 'express';
import { MaintenanceBlocker } from './middleware/MaintenanceBlocker';
import { testRouter } from './test';
import { apiRouter } from './api';
import { adminRouter } from './admin';

// TODO: https://medium.com/swlh/automatic-api-documentation-in-node-js-using-swagger-dd1ab3c78284
function InitRouter (app: Application): void {
    app.use(MaintenanceBlocker);

    app.use('/api', apiRouter);
    app.use('/admin', adminRouter);
    app.use('/test', testRouter);
}

export {
    InitRouter,
};
