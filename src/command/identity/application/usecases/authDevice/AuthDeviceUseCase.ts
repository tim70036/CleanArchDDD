import { Result } from '../../../../../core/Result';
import { UseCase } from '../../../../../core/UseCase';
import { DomainErrorOr } from '../../../../../core/DomainError';
import { IUserRepo } from '../../../domain/repo/IUserRepo';
import { AuthDeviceCTO } from './AuthDeviceDTO';
import { DeviceAuth } from '../../../domain/model/DeviceAuth';
import { InternalServerError, NotAuthorizedError, UnavailableError } from '../../../../../common/CommonError';
import { Transaction } from '../../../../../common/Transaction';
import { IRegisterService } from '../../../domain/service/IRegisterService';
import { DomainEventBus } from '../../../../../core/DomainEvent';
import { Session } from '../../../domain/model/Session';
import { ISessionRepo } from '../../../domain/repo/ISessionRepo';

class AuthDeviceUseCase extends UseCase<AuthDeviceCTO, Session> {
    private readonly userRepo: IUserRepo;

    private readonly sessionRepo: ISessionRepo;

    private readonly registerService: IRegisterService;

    public constructor (userRepo: IUserRepo, sessionRepo: ISessionRepo, registerService: IRegisterService) {
        super();
        this.userRepo = userRepo;
        this.sessionRepo = sessionRepo;
        this.registerService = registerService;
    }

    protected async Run (request: AuthDeviceCTO): Promise<DomainErrorOr<Session>> {
        let user;
        try {
            const userOrError = await this.userRepo.GetByDeviceId(request.deviceId);
            if (userOrError.IsSuccess()) {
                user = userOrError.Value;
            } else {
                const userOrError = await this.registerService.CreateDefaultUser();
                if (userOrError.IsFailure())
                    return userOrError;

                const deviceAuthOrError = DeviceAuth.Create({ deviceId: request.deviceId, isValid: true });
                if (deviceAuthOrError.IsFailure())
                    return deviceAuthOrError;

                user = userOrError.Value;
                user.props.deviceAuth = deviceAuthOrError.Value;
                this.logger.info(`new user created uid[${user.id.Value}] deviceId[${request.deviceId}]`);
            }
        } catch (err: unknown) {
            return new InternalServerError(`${(err as Error).stack}`);
        }

        if (user.props.isBanned)
            return new UnavailableError(`uid[${user.id.Value}] is banned`);
        if (user.props.isDeleted)
            return new NotAuthorizedError(`uid[${user.id.Value}] is deleted`);

        const sessionOrError = Session.CreateNew(user.id);
        if (sessionOrError.IsFailure())
            return sessionOrError;
        const session = sessionOrError.Value;

        const trx = await Transaction.Acquire(this.constructor.name);
        try {
            await this.userRepo.Save(user, trx.Raw);
            await this.sessionRepo.Save(session, trx.Raw);
            await trx.Commit();

            DomainEventBus.PublishForAggregate(user);
            DomainEventBus.PublishForAggregate(session);

            this.logger.info(`uid[${user.id.Value}] auth success`);
            return Result.Ok(session);
        } catch (err: unknown) {
            await trx.Rollback();
            return new InternalServerError(`${(err as Error).stack}`);
        }
    }
}

export { AuthDeviceUseCase };
