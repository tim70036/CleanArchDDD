import { Result } from '../../../../../core/Result';
import { UseCase } from '../../../../../core/UseCase';
import { DomainErrorOr } from '../../../../../core/DomainError';
import { IUserRepo } from '../../../domain/repo/IUserRepo';
import { User } from '../../../domain/model/User';
import { PasswordAuth } from '../../../domain/model/PasswordAuth';
import { Name } from '../../../domain/model/Name';
import { AuthDeviceCTO } from './AuthDeviceDTO';
import { DeviceAuth } from '../../../domain/model/DeviceAuth';
import { DuplicatedError, InternalServerError, InvalidDataError, NotAuthorizedError, UnavailableError } from '../../../../../common/CommonError';
import { Transaction } from '../../../../../common/Transaction';
import { IRegisterService } from '../../../domain/service/IRegisterService';
import { DomainEventBus } from '../../../../../core/DomainEvent';
import dayjs from 'dayjs';

type Response = DomainErrorOr<User>;

class AuthDeviceUseCase extends UseCase<AuthDeviceCTO, User> {
    private readonly userRepo: IUserRepo;

    private readonly registerService: IRegisterService;

    public constructor (userRepo: IUserRepo, registerService: IRegisterService) {
        super();
        this.userRepo = userRepo;
        this.registerService = registerService;
    }

    // 1. exists -> check if user is banned, deleted or shit. -> update shit -> create session -> save
    // 2. not exists -> gen valid shortuid -> create new user -> create session -> save
    public async Run (request: AuthDeviceCTO): Promise<Response> {
        let user;
        try {
            const userOrError = await this.userRepo.GetByDeviceId(request.deviceId);
            if (userOrError.IsSuccess()) {
                user = userOrError.Value;
            } else {
                const userOrError = this.registerService.CreateDefaultUser();
                if (userOrError.IsFailure())
                    return userOrError;

                const deviceAuthOrError = DeviceAuth.Create({ deviceId: request.deviceId, isValid: true});
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

        const trx = await Transaction.Acquire(this.constructor.name);
        try {
            await this.userRepo.Save(user, trx.Raw);
            await trx.Commit();

            this.logger.info(`uid[${user.id.Value}] auth success`);
            DomainEventBus.PublishForAggregate(user);
            return Result.Ok(user);
        } catch (err: unknown) {
            await trx.Rollback();
            return new InternalServerError(`${(err as Error).stack}`);
        }
    }

    private async GetUser (userId: string, loginIP: string, eventPublisher: QueEventPublisher): Promise<DomainErrorOr<User>> {
        let tryCount: number = 0;
        let isFind: boolean = false;
        let result: DomainErrorOr<User> = new DuplicatedError(`shortUid duplicate error reach limit 3`);

        while (!isFind && tryCount < 10) {
            const userOrError = this.CreateUser(userId, loginIP, eventPublisher);
            if (userOrError.IsFailure())
                return new InvalidDataError(`${userOrError.Error}`);
            const user = userOrError.Value;

            try {
                if ((await this.userRepo.GetUidByShortUid(String(user.ShortUid))).IsSuccess()) {
                    this.logger.warn(`register shortUid[${user.ShortUid}] duplicated`);
                    eventPublisher.Delete();
                    tryCount = tryCount + 1;
                } else {
                    result = Result.Ok(user);
                    isFind = true;
                }
            } catch (err: unknown) {
                return new InternalServerError(`${(err as Error).stack}`);
            }
        }

        return result;
    }
}

export { AuthDeviceUseCase };
