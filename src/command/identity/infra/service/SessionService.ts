import * as jwt from 'jsonwebtoken';
import { ISessionService } from '../../domain/service/ISessionService';
import { Session } from '../../domain/model/Session';
import { DuplicatedError, ExpireError, InternalServerError, InvalidDataError } from '../../../../common/CommonError';
import { ISessionRepo } from '../../domain/repo/ISessionRepo';
import { EntityId } from '../../../../core/EntityId';
import { Result, ErrOr } from '../../../../core/Result';
import { identityContainer } from '../../container';

class SessionService extends ISessionService {
    private readonly sessionRepo = identityContainer.resolve<ISessionRepo>('ISessionRepo');

    public async Auth (token: string): Promise<ErrOr<Session>> {
        let rawUid;
        try {
            const decoded = jwt.verify(token, process.env.JWT_KEY as string) as { uid: string; };
            rawUid = decoded.uid;
        } catch (error) {
            if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.NotBeforeError)
                return new InvalidDataError(`invalid token[${token}] error[${error.name} ${error.message}]`);
            else if (error instanceof jwt.TokenExpiredError)
                return new ExpireError(`expired token[${token}] error[${error.name} ${error.message}]`);
            return new InternalServerError(`${error}`);
        }

        const uidOrError = EntityId.CreateFrom(rawUid);
        if (uidOrError.IsFailure())
            return uidOrError;

        try {
            const sessionOrError = await this.sessionRepo.Get(uidOrError.Value);
            if (sessionOrError.IsFailure())
                return sessionOrError;

            const session = sessionOrError.Value;
            if (token !== session.props.jwt)
                return new DuplicatedError(`session invalidated by newer session uid[${rawUid}]`);

            return Result.Ok(session);
        } catch (error) {
            return new InternalServerError(`${error}`);
        }
    }
}

export { SessionService };
