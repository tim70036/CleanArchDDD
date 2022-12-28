import express from 'express';
import { AuthDeviceController } from '../../../command/identity/application/usecases/authDevice/AuthDeviceController';
import { identityContainer } from '../../../command/identity/container';
import { AuthLineController } from '../../../command/identity/application/usecases/authLine/AuthLineController';

const authRouter = express.Router();

authRouter.post('/device',
    (req, res) => { identityContainer.resolve(AuthDeviceController).Execute(req, res); }
);

authRouter.post('/line',
    (req, res) => { identityContainer.resolve(AuthLineController).Execute(req, res); }
);

export { authRouter };
