import { Service } from "../../../../core/Service";
import { Config } from "../model/Config";
import { MaintenanceStatus } from "../model/MaintenanceStatus";

abstract class IConfigService extends Service {
  public abstract SetStatus(status: MaintenanceStatus): Promise<void>;

  public abstract Save(config: Config): Promise<void>;
}

export { IConfigService };
