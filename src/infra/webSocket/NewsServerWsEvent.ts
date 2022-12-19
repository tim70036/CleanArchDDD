import { saferJoi } from '../../common/SaferJoi';
import { ServerWsEvent } from '../../core/WsEvent';

// TODO: move this file to a better place.
class NewsServerWsEvent extends ServerWsEvent {
    public static readonly code = 3;

    private static readonly schema = saferJoi.object({
        text: saferJoi.string().min(0).max(1000),
    });

    public readonly text: string;

    protected constructor (text: string) {
        super();
        this.text = text;
    }

    public static Create (text: string): NewsServerWsEvent {
        const { error } = NewsServerWsEvent.schema.validate({
            text
        });
        if (error) throw new Error(`Failed creating class[${NewsServerWsEvent.name}] with message[${error.message}]`);

        return new NewsServerWsEvent(text);
    }
}

export { NewsServerWsEvent };
