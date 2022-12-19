import { saferJoi } from '../common/SaferJoi';
import { WsEvent } from './WsEvent';

class WsMessage {
    private static readonly schema = saferJoi.object({
        eventCode: saferJoi.number().min(0).max(255).integer(),
        eventData: saferJoi.object(),
        srcUid: saferJoi.alternatives().try(saferJoi.string().uuid(), saferJoi.string().valid('server')),
    });

    public readonly eventCode: number;

    public readonly eventData: WsEvent;

    public readonly srcUid: string;

    protected constructor (eventCode: number, eventData: WsEvent, srcUid: string) {
        this.eventCode = eventCode;
        this.eventData = eventData;
        this.srcUid = srcUid;
    }

    public static CreateFromRaw (rawMessage: string, srcUid: string): WsMessage {
        const message = JSON.parse(rawMessage) as { eventCode: number; eventData: WsEvent; };
        const { error } = WsMessage.schema.validate({ ...message, srcUid });
        if (error) throw new Error(`Failed creating class[${WsMessage.name}] with message[${error.message}]`);

        return new WsMessage(message.eventCode, message.eventData, srcUid);
    }

    public static Create (eventCode: number, eventData: WsEvent, srcUid: string): WsMessage {
        const { error } = WsMessage.schema.validate({ eventCode, eventData, srcUid });
        if (error) throw new Error(`Failed creating class[${WsMessage.name}] with message[${error.message}]`);

        return new WsMessage(eventCode, eventData, srcUid);
    }

    public Serialize (): string {
        return JSON.stringify({
            eventCode: this.eventCode,
            eventData: this.eventData,
            srcUid: this.srcUid,
        });
    }
}

export { WsMessage };
