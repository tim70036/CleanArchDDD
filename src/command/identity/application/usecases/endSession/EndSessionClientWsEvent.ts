import { ClientWsEvent } from "../../../../../core/WsEvent";
import { saferJoi } from "../../../../../common/SaferJoi";

class EndSessionClientWsEvent extends ClientWsEvent {
  public static readonly code = 1;

  private static readonly schema = saferJoi.object({
    uid: saferJoi.string().uuid({ version: "uuidv1" }),
  });

  public readonly uid: string;

  protected constructor(uid: string) {
    super();
    this.uid = uid;
  }

  public static CreateFromRaw(rawEvent: string): EndSessionClientWsEvent {
    const event = JSON.parse(rawEvent) as EndSessionClientWsEvent;
    const { error } = EndSessionClientWsEvent.schema.validate(event);
    if (error)
      throw new Error(
        `Failed creating class[${EndSessionClientWsEvent.name}] with message[${error.message}]`,
      );

    return new EndSessionClientWsEvent(event.uid);
  }
}

export { EndSessionClientWsEvent };
