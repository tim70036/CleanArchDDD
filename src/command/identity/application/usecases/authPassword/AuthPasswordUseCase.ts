import { AuthPasswordCTO } from './AuthPasswordDTO';
import { Result } from '../../../../../core/Result';
import { UseCase } from '../../../../../core/UseCase';
import { DomainErrorOr } from '../../../../../core/DomainError';
import { IUserRepo } from '../../../domain/repo/IUserRepo';
import { InternalServerError, NotAuthorizedError, UnavailableError } from '../../../../../common/CommonError';
import { Session } from '../../../domain/model/Session';
import { ISessionRepo } from '../../../domain/repo/ISessionRepo';
import { IRegisterService } from '../../../domain/service/IRegisterService';
import { PasswordAuth } from '../../../domain/model/PasswordAuth';

class AuthPasswordUseCase extends UseCase<AuthPasswordCTO, Session> {
    private readonly userRepo: IUserRepo;

    private readonly sessionRepo: ISessionRepo;

    private readonly registerService: IRegisterService;

    public constructor (userRepo: IUserRepo, sessionRepo: ISessionRepo, registerService: IRegisterService) {
        super();
        this.userRepo = userRepo;
        this.sessionRepo = sessionRepo;
        this.registerService = registerService;
    }

    public async Run (request: AuthPasswordCTO): Promise<DomainErrorOr<Session>> {
        let user;
        try {
            const userOrError = await this.userRepo.GetByPassword(request.account, request.password);
                            // Check account exist? Check password match?
                            const exist = this.userRepo.AccountExists(request.account);
            if (userOrError.IsSuccess()) {
                user = userOrError.Value;
            } else {

                const userOrError = await this.registerService.CreateDefaultUser();
                if (userOrError.IsFailure())
                    return userOrError;

                const passwordAuthOrError = PasswordAuth.Create({
                    account: request.account,
                    password: request.password,
                    isValid: true
                });

                if (passwordAuthOrError.IsFailure())
                    return passwordAuthOrError;

                user = userOrError.Value;
                user.props.passwordAuth = passwordAuthOrError.Value;
                this.logger.info(`new user created uid[${user.id.Value}] account[${request.account}]`);
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

export { AuthPasswordUseCase };
