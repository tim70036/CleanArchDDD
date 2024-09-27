import { container } from "tsyringe";
import { IGetConfigService } from "./domain/repo/IGetConfigService";
import { GetConfigService } from "./infra/service/GetConfigService";
import { GetConfigUseCase } from "./application/getConfig/GetConfigUseCase";
import { GetConfigController } from "./application/getConfig/GetConfigController";

const maintenanceContainer = container.createChildContainer();

maintenanceContainer.register(GetConfigUseCase, { useClass: GetConfigUseCase });
maintenanceContainer.register(GetConfigController, {
  useClass: GetConfigController,
});

maintenanceContainer.register<IGetConfigService>("IGetConfigService", {
  useClass: GetConfigService,
});

export { maintenanceContainer };
