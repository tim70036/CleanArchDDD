import { Result, ErrOr } from "../../../../../core/Result";
import { UseCase } from "../../../../../core/UseCase";
import { IUserRepo } from "../../../domain/repo/IUserRepo";
import { AuthDeviceCTO } from "./AuthDeviceDTO";
import { DeviceAuth } from "../../../domain/model/DeviceAuth";
import {
  InternalServerError,
  NotAuthorizedError,
  UnavailableError,
} from "../../../../../common/CommonError";
import { Transaction } from "../../../../../core/Transaction";
import { IRegisterService } from "../../../domain/service/IRegisterService";
import { DomainEventBus } from "../../../../../core/DomainEvent";
import { Session } from "../../../domain/model/Session";
import { ISessionRepo } from "../../../domain/repo/ISessionRepo";
import { identityContainer } from "../../../container";

class AuthDeviceUseCase extends UseCase<AuthDeviceCTO, Session> {
  private readonly userRepo = identityContainer.resolve<IUserRepo>("IUserRepo");

  private readonly sessionRepo =
    identityContainer.resolve<ISessionRepo>("ISessionRepo");

  private readonly registerService =
    identityContainer.resolve<IRegisterService>("IRegisterService");

  protected async Run(request: AuthDeviceCTO): Promise<ErrOr<Session>> {
    let user;
    try {
      const userOrError = await this.userRepo.GetByDeviceId(request.deviceId);
      if (userOrError.IsSuccess()) {
        user = userOrError.Value;
        user.Login();
      } else {
        const userOrError = await this.registerService.CreateDefaultUser();
        if (userOrError.IsFailure()) return userOrError;

        const deviceAuthOrError = DeviceAuth.Create({
          deviceId: request.deviceId,
          isValid: true,
        });
        if (deviceAuthOrError.IsFailure()) return deviceAuthOrError;

        user = userOrError.Value;
        user.props.deviceAuth = deviceAuthOrError.Value;
        this.logger.info(`new user created`, {
          uid: user.id.Value,
          deviceId: request.deviceId,
        });
      }
    } catch (error) {
      return new InternalServerError(`${(error as Error).stack}`);
    }

    if (user.props.isBanned)
      return new UnavailableError(`uid[${user.id.Value}] is banned`);
    if (user.props.isDeleted)
      return new NotAuthorizedError(`uid[${user.id.Value}] is deleted`);

    const sessionOrError = Session.CreateNew(user.id);
    if (sessionOrError.IsFailure()) return sessionOrError;
    const session = sessionOrError.Value;

    const trx = await Transaction.Acquire(this.constructor.name);
    try {
      await this.userRepo.Save(user, trx);
      await this.sessionRepo.Save(session, trx);
      await trx.Commit();

      DomainEventBus.PublishForAggregate(user);
      DomainEventBus.PublishForAggregate(session);

      this.logger.info(`auth success`, {
        uid: user.id.Value,
      });
      return Result.Ok(session);
    } catch (error) {
      await trx.Rollback();
      return new InternalServerError(`${(error as Error).stack}`);
    }
  }
}

export { AuthDeviceUseCase };
