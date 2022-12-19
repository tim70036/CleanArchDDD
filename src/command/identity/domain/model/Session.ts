import { AggregateRoot } from '../../../../core/AggregateRoot';
import { DomainErrorOr } from '../../../../core/DomainError';
import { EntityId } from '../../../../core/EntityId';
import { Result } from '../../../../core/Error';
import moment from 'moment';

interface SessionProps {
    uid: EntityId;
    jwt: string;
    createTime: string; // TODO: change to moment type.
    lastHeartbeatIP: string;
    lastHeartbeat: string; // TODO: change to moment type.
}

interface SessionData {
    uid: string;
    jwt: string;
    createTime: string; // TODO: change to moment type.
    lastHeartbeatIP: string;
    lastHeartbeat: string; // TODO: change to moment type.
}

// 她媽都在亂寫，到底在寫三小
// TODO: Aggregate id? never saved.
class Session extends AggregateRoot<SessionProps> {
    public get Uid (): EntityId {
        return this.props.uid;
    }

    public get LastHeartbeat (): string {
        return this.props.lastHeartbeat;
    }

    public get LastHeartbeatIP (): string {
        return this.props.lastHeartbeatIP;
    }

    public get Jwt (): string {
        return this.props.jwt;
    }

    public get CreateTime (): string {
        return this.props.createTime;
    }

    public static Create (props: SessionProps): DomainErrorOr<Session> {
        const sessionData = new Session({
            ...props
        });

        return Result.Ok(sessionData);
    }

    public static CreateFrom (props: SessionProps, id: EntityId): DomainErrorOr<Session> {
        const sessionData = new Session(props, id);

        return Result.Ok(sessionData);
    }

    public Heartbeat (ip: string): DomainErrorOr<void> {
        const curHeartbeatTime = moment();
        const lastHeartbeatTime = moment(this.props.lastHeartbeat);

        this.props.lastHeartbeat = curHeartbeatTime.utc().format();
        this.props.lastHeartbeatIP = ip;

        // We need to have a way detect a brand new session. Do not fire heartbeat event for new session.
        // Case: user goes offline for a while then online again.
        // Last heartbeat time will be very old. We cannot view it as user has stayed online for a long time.
        // In the future, we can add SessionStartTime and SessionEndTime to Session props. (populated by websocket)
        if (curHeartbeatTime.diff(lastHeartbeatTime, 'seconds') > 120) return Result.Ok();

        return Result.Ok();
    }
}
export { Session, SessionProps, SessionData };
