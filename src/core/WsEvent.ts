type WsEventCode = number;

abstract class WsEvent {
    public static readonly code: WsEventCode;
}

abstract class ClientWsEvent extends WsEvent {

}

abstract class ServerWsEvent extends WsEvent {

}

export { WsEventCode, WsEvent, ClientWsEvent, ServerWsEvent };
