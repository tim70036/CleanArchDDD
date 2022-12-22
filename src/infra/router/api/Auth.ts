import express from 'express';
import { authDeviceController } from '../../../command/identity/application/usecases/authDevice';

const authRouter = express.Router();

authRouter.post('/device',
    (req, res) => { authDeviceController.Execute(req, res); }
);

authRouter.post('/line',
    (req, res) => { authDeviceController.Execute(req, res); }
);

export { authRouter };
