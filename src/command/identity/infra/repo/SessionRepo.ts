import { redisClient } from '../../../../infra/database/Redis';
import { ErrOr } from '../../../../core/Result';
import { EntityId } from '../../../../core/EntityId';
import { Session } from '../../domain/model/Session';
import { ISessionRepo } from '../../domain/repo/ISessionRepo';
import { NotExistError } from '../../../../common/CommonError';
import { SessionMapper } from '../mapper/SessionMapper';
import { Transaction } from '../../../../core/Transaction';
import { identityContainer } from '../../container';

const sessionPrefix = `session:uid`;

class SessionRepo extends ISessionRepo {
    private readonly sessionMapper = identityContainer.resolve(SessionMapper);

    public async Get (uid: EntityId): Promise <ErrOr<Session>> {
        const sessionDTO = await redisClient.hGet(sessionPrefix, uid.Value);
        if (sessionDTO === undefined)
            return new NotExistError(`cannot find session uid[${uid.Value}] in key[${sessionPrefix}]`);

        const sessionOrError = this.sessionMapper.ToDomain(sessionDTO);
        return sessionOrError;
    }

    public async Save (session: Session, trx: Transaction): Promise<void> {
        const rawSession = JSON.stringify({
            uid: session.id.Value,
            isActive: session.props.isActive,
            jwt: session.props.jwt,
            ip: session.props.ip,
            createTime: session.props.createTime.format(),
            startTime: session.props.startTime.format(),
            endTime: session.props.endTime.format(),
        });

        await redisClient.hSet(sessionPrefix, session.id.Value, rawSession);
        return;
    }

    public async Exists (uid: EntityId): Promise<boolean> {
        const didExist = await redisClient.hExists(sessionPrefix, uid.Value);
        return didExist;
    }
}

export { SessionRepo };
