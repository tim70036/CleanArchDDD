import { LoginCTO } from './LoginDTO';
import { Result } from '../../../../../core/Result';
import { UseCase } from '../../../../../core/UseCase';
import { DomainErrorOr } from '../../../../../core/DomainError';
import { IUserRepo } from '../../../domain/repo/UserRepo';
import { User } from '../../../domain/model/User';
import { InternalServerError, InvalidDataError } from '../../../../../common/CommonError';

type Response = DomainErrorOr<User>;

class LoginUseCase extends UseCase<LoginCTO, User> {
    private readonly userRepo: IUserRepo;

    public constructor (userRepo: IUserRepo) {
        super();
        this.userRepo = userRepo;
    }

    public async Run (request: LoginCTO): Promise<Response> {
        this.logger.info(`account[${request.account}] try to login`);

        try {
            const userOrError = await this.userRepo.GetByPasswordAuth(request.account, request.password);

            if (userOrError.IsFailure())
                return new InvalidDataError(`${userOrError.Error}`);

            const user: User = userOrError.Value;

            this.logger.info(`uid[${user.Id.Value}] passwordAuth successfully`);
            return Result.Ok(user);
        } catch (err: unknown) {
            return new InternalServerError(`${(err as Error).stack}`);
        }
    }
}

export { LoginUseCase };
