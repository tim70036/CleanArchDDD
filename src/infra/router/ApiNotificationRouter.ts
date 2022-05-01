import express from 'express';
import { UserSessionAuth } from './middleware/UserSessionAuth';
import { getAnnouncementDispatcher } from '../../query/notification/application/getAnnouncement';

const apiNotificationRouter = express.Router();

apiNotificationRouter.use(UserSessionAuth);

apiNotificationRouter.get('/announcement',
    (req, res) => { getAnnouncementDispatcher.Dispatch(req, res); }
);


export { apiNotificationRouter };
