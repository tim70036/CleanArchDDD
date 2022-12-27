import { Result, ErrOr } from '../../../../../core/Result';
import { UseCase } from '../../../../../core/UseCase';
import { IUserRepo } from '../../../domain/repo/IUserRepo';
import { AuthLineCTO } from './AuthLineDTO';
import { InternalServerError, NotAuthenticatedError, NotAuthorizedError, UnavailableError } from '../../../../../common/CommonError';
import { Transaction } from '../../../../../core/Transaction';
import { IRegisterService } from '../../../domain/service/IRegisterService';
import { DomainEventBus } from '../../../../../core/DomainEvent';
import { Session } from '../../../domain/model/Session';
import { ISessionRepo } from '../../../domain/repo/ISessionRepo';
import { LineAuth } from '../../../domain/model/LineAuth';

class AuthLineUseCase extends UseCase<AuthLineCTO, Session> {
    private readonly userRepo: IUserRepo;

    private readonly sessionRepo: ISessionRepo;

    private readonly registerService: IRegisterService;

    public constructor (userRepo: IUserRepo, sessionRepo: ISessionRepo, registerService: IRegisterService) {
        super();
        this.userRepo = userRepo;
        this.sessionRepo = sessionRepo;
        this.registerService = registerService;
    }

    protected async Run (request: AuthLineCTO): Promise<ErrOr<Session>> {
        const lineIdOrError = await this.GetLineId(request.accessToken);
        if (lineIdOrError.IsFailure())
            return lineIdOrError;

        const lineId = lineIdOrError.Value;
        let user;
        try {
            const userOrError = await this.userRepo.GetByLineId(lineId);
            if (userOrError.IsSuccess()) {
                user = userOrError.Value;
                user.Login();
            } else {
                const userOrError = await this.registerService.CreateDefaultUser();
                if (userOrError.IsFailure())
                    return userOrError;

                const lineAuthOrError = LineAuth.Create({ lineId: lineId, isValid: true });
                if (lineAuthOrError.IsFailure())
                    return lineAuthOrError;

                user = userOrError.Value;
                user.props.lineAuth = lineAuthOrError.Value;
                this.logger.info(`new user created uid[${user.id.Value}] lineId[${lineId}]`);
            }
        } catch (error) {
            return new InternalServerError(`${(error as Error).stack}`);
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
            await this.userRepo.Save(user, trx);
            await this.sessionRepo.Save(session, trx);
            await trx.Commit();

            DomainEventBus.PublishForAggregate(user);
            DomainEventBus.PublishForAggregate(session);

            this.logger.info(`uid[${user.id.Value}] auth success`);
            return Result.Ok(session);
        } catch (error) {
            await trx.Rollback();
            return new InternalServerError(`${(error as Error).stack}`);
        }
    }

    private async GetLineId (accessToken: string): Promise<ErrOr<string>> {
        try {
            // Request Line to verify accessToken
            const verifyUrl = new URL(`${process.env.LINE_HOST}/oauth2/v2.1/verify`);
            verifyUrl.searchParams.append('access_token', accessToken);
            const verifyResponse = await fetch(verifyUrl);

            if (verifyResponse.status !== 200)
                return new NotAuthenticatedError(`line verify api failed accessToken[${accessToken}] statusCode[${verifyResponse.status}]`);

            // Get user profile using access token
            const profileUrl = new URL(`${process.env.LINE_HOST}/v2/profile`);
            const profileResponse = await fetch(profileUrl, {
                method: 'GET',
                // eslint-disable-next-line @typescript-eslint/naming-convention
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            const profileResponseBody = await profileResponse.json() as {
                userId: string;
                displayName: string;
            };

            if (profileResponse.status !== 200)
                return new NotAuthenticatedError(`line profile api failed accessToken[${accessToken}] statusCode[${profileResponse.status}]`);

            return Result.Ok(profileResponseBody.userId);
        } catch (error) {
            return new InternalServerError(`${(error as Error).stack}`);
        }
    }
}

export { AuthLineUseCase };
