import express from 'express';
import { getConfigController } from '../../../query/maintenance/application/getConfig';
import { switchOffController } from '../../../command/maintenance/application/usecases/switchOff';
import { AdminServerAuth } from '../middleware/AdminServerAuth';
import { container } from 'tsyringe';
import { SetConfigController } from '../../../command/maintenance/application/usecases/setConfig/SetConfigController';


const adminRouter = express.Router();
adminRouter.use(AdminServerAuth);

adminRouter.put('/maintenance/config',
    (req, res) => { container.resolve(SetConfigController).Execute(req, res); }
);

adminRouter.get('/maintenance/config',
    (req, res) => { getConfigController.Execute(req, res); }
);

adminRouter.post('/maintenance/switch-off',
    (req, res) => { switchOffController.Execute(req, res); }
);

export { adminRouter };
