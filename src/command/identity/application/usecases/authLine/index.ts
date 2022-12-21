import { UserRepo } from '../../../infra/repo/UserRepo';
import { AuthLineUseCase } from './AuthLineUseCase';
import { AuthLineController } from './AuthLineController';

import { SessionRepo } from '../../../infra/repo/SessionRepo';
import { RegisterService } from '../../../infra/service/RegisterService';

const userRepo = new UserRepo();

const sessionRepo = new SessionRepo();

const registerService = new RegisterService(userRepo);

const authLineUseCase = new AuthLineUseCase(userRepo, sessionRepo, registerService);
const authLineController = new AuthLineController(authLineUseCase);

export { authLineController };
