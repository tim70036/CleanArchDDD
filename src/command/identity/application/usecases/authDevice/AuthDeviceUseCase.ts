import { Result } from '../../../../../core/Error';
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
import { DomainEventPublisher } from '../../../../../core/DomainEvent';

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
        let isNewUser: boolean = false;
        try {
            const userOrError = await this.userRepo.GetByDeviceId(request.deviceId);
            if (userOrError.IsFailure()) {
                const userOrError = await this.GetUser(request.uniqueId, request.loginIP, eventPublisher);
                if (userOrError.IsFailure())
                    return userOrError;
                user = userOrError.Value;

                isNewUser = true;
            } else {
                user = userOrError.Value;
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

            if (isNewUser) {
                eventPublisher.FireQueEvent();
                this.logger.info(`uid[${user.Id.Value}] deviceAuth register`);
            } else {
                this.logger.info(`uid[${user.Id.Value}] deviceAuth successfully`);
            }

            DomainEventPublisher.PublishForAggregate(user);

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

    private CreateUser (userId: string, loginIp: string, eventPublisher: QueEventPublisher): DomainErrorOr<User> {
        const passwordAuthOrError = PasswordAuth.CreateDefault();
        const nameOrError = Name.Create('default');
        const lineAuthOrError = LineAuth.CreateDefault();
        const appleAuthOrError = AppleAuth.CreateDefault();
        const deviceAuthOrError = DeviceAuth.Create({ deviceId: userId, isValid: true });
        const googleAuthOrError = GoogleAuth.CreateDefault();
        const facebookAuthOrError = FacebookAuth.CreateDefault();
        const emailCertificationOrError = EmailCertification.CreateDefault();
        const phoneCertificationOrError = PhoneCertification.CreateDefault();
        const realNameCertificationOrError = RealNameCertification.CreateDefault();

        const dtoResult = Result.Combine([nameOrError, lineAuthOrError, passwordAuthOrError, appleAuthOrError, deviceAuthOrError, googleAuthOrError, facebookAuthOrError, emailCertificationOrError, phoneCertificationOrError, realNameCertificationOrError]);
        if (dtoResult.IsFailure())
            return new InvalidDataError(`${dtoResult.Error}`);

        const name = nameOrError.Value as Name;
        const lineAuth = lineAuthOrError.Value as LineAuth;
        const passwordAuth = passwordAuthOrError.Value as PasswordAuth;
        const appleAuth = appleAuthOrError.Value as AppleAuth;
        const deviceAuth = deviceAuthOrError.Value as DeviceAuth;
        const googleAuth = googleAuthOrError.Value as GoogleAuth;
        const facebookAuth = facebookAuthOrError.Value as FacebookAuth;
        const emailCertification = emailCertificationOrError.Value as EmailCertification;
        const phoneCertification = phoneCertificationOrError.Value as PhoneCertification;
        const realNameCertification = realNameCertificationOrError.Value as RealNameCertification;

        const userOrError = User.Create({
            name: name, isName: false, lastLoginIP: loginIp, passwordAuth: passwordAuth, lineAuth: lineAuth, appleAuth: appleAuth, deviceAuth: deviceAuth,
            googleAuth, facebookAuth, emailCertification, phoneCertification, realNameCertification
        }, eventPublisher);
        if (userOrError.IsFailure())
            return new InvalidDataError(`${userOrError.Error}`);
        return userOrError;
    }
}

export { AuthDeviceUseCase };
