import Objection from 'objection';
import { redisClient } from '../../../../infra/database/Redis';
import { DomainErrorOr } from '../../../../core/DomainError';
import { EntityId } from '../../../../core/EntityId';
import { Result } from '../../../../core/Error';
import { Session } from '../../domain/model/Session';
import { ISessionRepo } from '../../domain/repo/ISessionRepo';
import dayjs from 'dayjs';

const sessionPrefix = `session:uid`;

class SessionRepo extends ISessionRepo {
    public async Get (uid: EntityId): Promise <DomainErrorOr<Session>> {
        const rawSessionData = await redisClient.hGet(sessionPrefix, uid.Value);
        if (rawSessionData === undefined)
            return Result.Fail('session not found in redis');

        const rawSession = JSON.parse(rawSessionData);
        const sessionOrError = Session.CreateFrom({
            isActive: rawSession.isActive,
            jwt: rawSession.jwt,
            ip: rawSession.ip,
            createTime: dayjs.utc(rawSession.createTime),
            startTime: dayjs.utc(rawSession.startTime),
            endTime: dayjs.utc(rawSession.endTime),
        }, rawSession.uid);

        if (sessionOrError.IsFailure())
            return Result.Fail(sessionOrError.Error);

        return Result.Ok(sessionOrError.Value);
    }

    
    public async Save (session: Session, trx: Objection.Transaction): Promise<void> {
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
        return await redisClient.hExists(sessionPrefix, uid.Value);
    }
}

export { SessionRepo };
