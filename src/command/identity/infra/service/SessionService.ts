import * as jwt from 'jsonwebtoken';
import { ISessionService } from '../../domain/service/ISessionService';
import { DomainErrorOr } from '../../../../core/DomainError';
import { Session } from '../../domain/model/Session';
import { DuplicatedError, ExpireError, InternalServerError, InvalidDataError } from '../../../../common/CommonError';
import { ISessionRepo } from '../../domain/repo/ISessionRepo';
import { EntityId } from '../../../../core/EntityId';
import { Result } from '../../../../core/Result';

class SessionService extends ISessionService {
    private readonly sessionRepo: ISessionRepo;

    public constructor (sessionRepo: ISessionRepo) {
        super();
        this.sessionRepo = sessionRepo;
    }

    public async Auth (token: string): Promise<DomainErrorOr<Session>> {
        let rawUid;
        try {
            const decoded = jwt.verify(token, process.env.JWT_KEY as string) as { uid: string; };
            rawUid = decoded.uid;
        } catch (err: unknown) {
            if (err instanceof jwt.JsonWebTokenError || err instanceof jwt.NotBeforeError)
                return new InvalidDataError(`invalid token[${token}] error[${err.message}]`);
            else if (err instanceof jwt.TokenExpiredError)
                return new ExpireError(`expired token[${token}] error[${err.message}]`)
            return new InternalServerError(`${err}`);
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
        } catch (err: unknown) {
            return new InternalServerError(`${err}`);
        }
    }
}

export { SessionService };
