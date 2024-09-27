import { container } from "tsyringe";
import { IRegisterService } from "./domain/service/IRegisterService";
import { RegisterService } from "./infra/service/RegisterService";
import { ISessionRepo } from "./domain/repo/ISessionRepo";
import { SessionRepo } from "./infra/repo/SessionRepo";
import { ISessionService } from "./domain/service/ISessionService";
import { SessionService } from "./infra/service/SessionService";
import { IUserRepo } from "./domain/repo/IUserRepo";
import { UserRepo } from "./infra/repo/UserRepo";
import { AuthDeviceUseCase } from "./application/usecases/authDevice/AuthDeviceUseCase";
import { AuthDeviceController } from "./application/usecases/authDevice/AuthDeviceController";
import { AuthLineController } from "./application/usecases/authLine/AuthLineController";
import { AuthLineUseCase } from "./application/usecases/authLine/AuthLineUseCase";
import { EndSessionUseCase } from "./application/usecases/endSession/EndSessionUseCase";
import { EndSessionController } from "./application/usecases/endSession/EndSessionController";
import { StartSessionUseCase } from "./application/usecases/startSession/StartSessionUseCase";
import { StartSessionController } from "./application/usecases/startSession/StartSessionController";
import { SessionMapper } from "./infra/mapper/SessionMapper";
import { UserMapper } from "./infra/mapper/UserMapper";

const identityContainer = container.createChildContainer();

identityContainer.register(AuthDeviceUseCase, { useClass: AuthDeviceUseCase });
identityContainer.register(AuthDeviceController, {
  useClass: AuthDeviceController,
});

identityContainer.register(AuthLineUseCase, { useClass: AuthLineUseCase });
identityContainer.register(AuthLineController, {
  useClass: AuthLineController,
});

identityContainer.register(EndSessionUseCase, { useClass: EndSessionUseCase });
identityContainer.register(EndSessionController, {
  useClass: EndSessionController,
});

identityContainer.register(StartSessionUseCase, {
  useClass: StartSessionUseCase,
});
identityContainer.register(StartSessionController, {
  useClass: StartSessionController,
});

identityContainer.register<IRegisterService>("IRegisterService", {
  useClass: RegisterService,
});
identityContainer.register<ISessionService>("ISessionService", {
  useClass: SessionService,
});

identityContainer.register<IUserRepo>("IUserRepo", { useClass: UserRepo });
identityContainer.register<ISessionRepo>("ISessionRepo", {
  useClass: SessionRepo,
});

identityContainer.register(UserMapper, { useClass: UserMapper });
identityContainer.register(SessionMapper, { useClass: SessionMapper });

export { identityContainer };
