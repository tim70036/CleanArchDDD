import { SessionRepo } from '../../command/identity/infra/repo/SessionRepo';
import { SessionService } from '../../command/identity/infra/service/SessionService';
import { WsApp } from './WsApp';

const sessionRepo = new SessionRepo();
const sessionService = new SessionService(sessionRepo);
const wsApp = new WsApp(sessionService);

export { wsApp };
