import express from 'express';
import { apiNotificationRouter } from './ApiNotificationRouter';

const apiRouter = express.Router();
apiRouter.use('/notification', apiNotificationRouter);

export { apiRouter };
