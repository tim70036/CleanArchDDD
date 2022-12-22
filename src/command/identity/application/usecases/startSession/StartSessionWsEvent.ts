import { ClientWsEvent } from '../../../../../core/WsEvent';
import { saferJoi } from '../../../../../common/SaferJoi';

class StartSessionClientWsEvent extends ClientWsEvent {
    public static readonly code = 0;

    private static readonly schema = saferJoi.object({
        uid: saferJoi.string().uuid({ version: 'uuidv1' }),
        ip: saferJoi.string().ip(),
    });

    public readonly uid: string;

    public readonly ip: string;

    protected constructor (uid: string, ip: string) {
        super();
        this.uid = uid;
        this.ip = ip;
    }

    public static CreateFromRaw (rawEvent: string): StartSessionClientWsEvent {
        const event = JSON.parse(rawEvent) as StartSessionClientWsEvent;
        const { error } = StartSessionClientWsEvent.schema.validate(event);
        if (error) throw new Error(`Failed creating class[${StartSessionClientWsEvent.name}] with message[${error.message}]`);

        return new StartSessionClientWsEvent(event.uid, event.ip);
    }
}

export { StartSessionClientWsEvent };
