import { ConfigService } from '../../../infra/service/ConfigService';
import { SwitchOffController } from './SwitchOffController';
import { SwitchOffUseCase } from './SwitchOffUseCase';

const configService = new ConfigService();
const switchOffUseCase = new SwitchOffUseCase(configService);
const switchOffController = new SwitchOffController(switchOffUseCase);

export { switchOffController };
