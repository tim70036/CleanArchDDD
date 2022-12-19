import { GetConfigService } from '../../infra/service/GetConfigService';
import { GetConfigController } from './GetConfigController';
import { GetConfigUseCase } from './GetConfigUseCase';

const getConfigService = new GetConfigService();
const getConfigUseCase = new GetConfigUseCase(getConfigService);
const getConfigController = new GetConfigController(getConfigUseCase);

export { getConfigController };
