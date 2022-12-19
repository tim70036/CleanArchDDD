import { ClientWsEvent } from '../../../../../core/WsEvent';
import { saferJoi } from '../../../../../common/SaferJoi';

class HeartbeatClientWsEvent extends ClientWsEvent {
    public static readonly code = 0;

    private static readonly schema = saferJoi.object({
        uid: saferJoi.string().uuid(),
        ip: saferJoi.string().ip(),
    });

    public readonly uid: string;

    public readonly ip: string;

    protected constructor (uid: string, ip: string) {
        super();
        this.uid = uid;
        this.ip = ip;
    }

    public static CreateFromRaw (rawEvent: string): HeartbeatClientWsEvent {
        const event = JSON.parse(rawEvent) as HeartbeatClientWsEvent;
        const { error } = HeartbeatClientWsEvent.schema.validate(event);
        if (error) throw new Error(`Failed creating class[${HeartbeatClientWsEvent.name}] with message[${error.message}]`);

        return new HeartbeatClientWsEvent(event.uid, event.ip);
    }
}

export { HeartbeatClientWsEvent };
