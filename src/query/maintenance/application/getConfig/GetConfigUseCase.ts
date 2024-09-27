import { InternalServerError } from "../../../../common/CommonError";
import { ErrOr } from "../../../../core/Result";
import { UseCase } from "../../../../core/UseCase";
import { maintenanceContainer } from "../../container";
import { IGetConfigService } from "../../domain/repo/IGetConfigService";
import { GetConfigSTO } from "./GetConfigDTO";

class GetConfigUseCase extends UseCase<void, GetConfigSTO> {
  private readonly getConfigService =
    maintenanceContainer.resolve<IGetConfigService>("IGetConfigService");

  protected async Run(): Promise<ErrOr<GetConfigSTO>> {
    try {
      return await this.getConfigService.Get();
    } catch (error) {
      return new InternalServerError(`${(error as Error).stack}`);
    }
  }
}

export { GetConfigUseCase };
