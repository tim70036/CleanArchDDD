import { SessionRepo } from '../../../infra/repo/SessionRepo';
import { HeartbeatController } from './HeartbeatController';
import { HeartbeatUseCase } from './HeartbeatUseCase';

const heartbeatRepo = new SessionRepo();

const heartbeatUseCase = new HeartbeatUseCase(heartbeatRepo);
const heartbeatController = new HeartbeatController(heartbeatUseCase);

export { heartbeatController };
