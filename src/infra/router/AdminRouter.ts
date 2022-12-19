import express from 'express';
import { getConfigController } from '../../query/maintenance/application/getConfig';
import { switchOffController } from '../../command/maintenance/application/usecases/switchOff';
import { setConfigController } from '../../command/maintenance/application/usecases/setConfig';
import { AdminServerAuth } from './middleware/AdminServerAuth';


const adminRouter = express.Router();
adminRouter.use(AdminServerAuth);

adminRouter.put('/maintenance/config',
    (req, res) => { setConfigController.Execute(req, res); }
);

adminRouter.get('/maintenance/config',
    (req, res) => { getConfigController.Execute(req, res); }
);

adminRouter.post('/maintenance/switch-off',
    (req, res) => { switchOffController.Execute(req, res); }
);

export { adminRouter };
