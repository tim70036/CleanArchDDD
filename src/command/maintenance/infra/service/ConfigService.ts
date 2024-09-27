import { redisClient } from "../../../../infra/database/Redis";
import { Config } from "../../domain/model/Config";
import { MaintenanceStatus } from "../../domain/model/MaintenanceStatus";
import { IConfigService } from "../../domain/service/IConfigService";

class ConfigService extends IConfigService {
  private readonly maintenanceKey = "maintenance";

  public async SetStatus(status: MaintenanceStatus): Promise<void> {
    await redisClient.hSet(this.maintenanceKey, "status", status);
  }

  public async Save(config: Config): Promise<void> {
    await redisClient.hSet(
      this.maintenanceKey,
      "startTime",
      config.props.startTime.format(),
    );
    await redisClient.hSet(
      this.maintenanceKey,
      "announcement",
      config.props.announcement,
    );
    await redisClient.hSet(
      this.maintenanceKey,
      "ipWhitelist",
      JSON.stringify(config.props.ipWhitelist),
    );
  }
}

export { ConfigService };
