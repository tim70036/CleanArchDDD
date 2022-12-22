import { SessionRepo } from '../../../infra/repo/SessionRepo';
import { EndSessionUseCase } from './EndSessionUseCase';
import { EndSessionController } from './EndSessionController';

const sessionRepo = new SessionRepo();

const endSessionUseCase = new EndSessionUseCase(sessionRepo);
const endSessionController = new EndSessionController(endSessionUseCase);

export { endSessionController };
