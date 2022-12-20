import { UserModel } from '../../../infra/database/UserModel';
import { UserRepo } from '../../../infra/repo/UserRepo';
import { PasswordAuthModel } from '../../../infra/database/PasswordAuthModel';
import { AuthDeviceUseCase } from './AuthDeviceUseCase';
import { AuthDeviceController } from './AuthDeviceController';
import { DeviceAuthModel } from '../../../infra/database/DeviceAuthModel';

import { SessionRepo } from '../../../infra/repo/SessionRepo';

const userModel = new UserModel();
const deviceAuthModel = new DeviceAuthModel();
const passwordAuthModel = new PasswordAuthModel();
const userRepo = new UserRepo(userModel, deviceAuthModel, passwordAuthModel);

const sessionRepo = new SessionRepo();

const authDeviceUseCase = new AuthDeviceUseCase(userRepo);
const authDeviceController = new AuthDeviceController(authDeviceUseCase);

export { authDeviceController };
