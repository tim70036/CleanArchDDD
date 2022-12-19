import Objection from 'objection';
import { redisClient } from '../../../../infra/database/Redis';
import { DomainErrorOr } from '../../../../core/DomainError';
import { EntityId } from '../../../../core/EntityId';
import { Result } from '../../../../core/Error';
import { Session, SessionData } from '../../domain/model/Session';
import { ISessionRepo } from '../../domain/repo/SessionRepo';

const sessionPrefix = `session:uid`;

class SessionRepo extends ISessionRepo {
    public async Get (uid: EntityId): Promise <DomainErrorOr<Session>> {
        const rawSessionData = await redisClient.hGet(sessionPrefix, uid.Value);

        if (typeof rawSessionData !== 'string')
            return Result.Fail('session not found');

        const sessionData = JSON.parse(rawSessionData) as SessionData;

        const sessionOrError = Session.Create({
            uid: uid,
            jwt: sessionData.jwt,
            createTime: sessionData.createTime,
            lastHeartbeatIP: sessionData.lastHeartbeatIP,
            lastHeartbeat: sessionData.lastHeartbeat,
        });

        if (sessionOrError.IsFailure())
            return Result.Fail(sessionOrError.Error);

        return Result.Ok(sessionOrError.Value);
    }

    public async Save (sessionData: Session, trx?: Objection.Transaction): Promise<void> {
        const jsonStr = JSON.stringify({
            uid: sessionData.Uid.Value,
            jwt: sessionData.Jwt,
            createTime: sessionData.CreateTime,
            lastHeartbeatIP: sessionData.LastHeartbeatIP,
            lastHeartbeat: sessionData.LastHeartbeat,
        });

        await redisClient.hSet(sessionPrefix, sessionData.Uid.Value, jsonStr);
        return;
    }

    public async Exists (uid: EntityId): Promise<boolean> {
        const rawSessionData = await redisClient.hGet(sessionPrefix, uid.Value);
        return typeof rawSessionData === 'string';
    }
}

export { SessionRepo, sessionPrefix };
