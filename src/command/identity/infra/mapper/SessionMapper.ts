import dayjs from 'dayjs';
import { ErrOr } from '../../../../core/Err';
import { Session } from '../../domain/model/Session';
import { EntityId } from '../../../../core/EntityId';

class SessionMapper {
    public static ToDomain (dto: string): ErrOr<Session> {
        const rawSession = JSON.parse(dto) as {
            uid: string;
            isActive: boolean;
            jwt: string;
            ip: string;
            createTime: string;
            startTime: string;
            endTime: string;
        };

        const uidOrError = EntityId.CreateFrom(rawSession.uid);
        if (uidOrError.IsFailure())
            return uidOrError;

        const sessionOrError = Session.CreateFrom({
            isActive: rawSession.isActive,
            jwt: rawSession.jwt,
            ip: rawSession.ip,
            createTime: dayjs.utc(rawSession.createTime),
            startTime: dayjs.utc(rawSession.startTime),
            endTime: dayjs.utc(rawSession.endTime),
        }, uidOrError.Value);

        return sessionOrError;
    }
}

export { SessionMapper };
