import { SessionRepo } from '../../../infra/repo/SessionRepo';
import { StartSessionUseCase } from './StartSessionUseCase';
import { StartSessionController } from './StartSessionController';

const sessionRepo = new SessionRepo();

const startSessionUseCase = new StartSessionUseCase(sessionRepo);
const startSessionController = new StartSessionController(startSessionUseCase);

export { startSessionController };
