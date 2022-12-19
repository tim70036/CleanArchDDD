import { ConfigService } from '../../../infra/service/ConfigService';
import { SetConfigController } from './SetConfigController';
import { SetConfigUseCase } from './SetConfigUseCase';


const configService = new ConfigService();
const setConfigUseCase = new SetConfigUseCase(configService);
const setConfigController = new SetConfigController(setConfigUseCase);

export { setConfigController };
