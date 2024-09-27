import { container } from "tsyringe";
import { IConfigService } from "./domain/service/IConfigService";
import { ConfigService } from "./infra/service/ConfigService";
import { SetConfigUseCase } from "./application/usecases/setConfig/SetConfigUseCase";
import { SetConfigController } from "./application/usecases/setConfig/SetConfigController";
import { SwitchOffUseCase } from "./application/usecases/switchOff/SwitchOffUseCase";
import { SwitchOffController } from "./application/usecases/switchOff/SwitchOffController";

const maintenanceContainer = container.createChildContainer();

maintenanceContainer.register(SetConfigUseCase, { useClass: SetConfigUseCase });
maintenanceContainer.register(SetConfigController, {
  useClass: SetConfigController,
});

maintenanceContainer.register(SwitchOffUseCase, { useClass: SwitchOffUseCase });
maintenanceContainer.register(SwitchOffController, {
  useClass: SwitchOffController,
});

maintenanceContainer.register<IConfigService>("IConfigService", {
  useClass: ConfigService,
});

export { maintenanceContainer };
