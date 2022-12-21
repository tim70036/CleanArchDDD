import { UserRepo } from '../../../infra/repo/UserRepo';
import { AuthDeviceUseCase } from './AuthDeviceUseCase';
import { AuthDeviceController } from './AuthDeviceController';

import { SessionRepo } from '../../../infra/repo/SessionRepo';
import { RegisterService } from '../../../infra/service/RegisterService';

const userRepo = new UserRepo();

const sessionRepo = new SessionRepo();

const registerService = new RegisterService(userRepo);

const authDeviceUseCase = new AuthDeviceUseCase(userRepo, sessionRepo, registerService);
const authDeviceController = new AuthDeviceController(authDeviceUseCase);

export { authDeviceController };
