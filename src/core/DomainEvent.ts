interface DomainEvent {
    name: string;
}

interface DomainEventHandler {
    (event: DomainEvent): void;
}

class EventBus {
    private static handlers: Record<string, DomainEventHandler[]> = {};

    public static Subscribe (event: DomainEvent, handler: DomainEventHandler): void {
        // eslint-disable-next-line no-prototype-builtins
        if (!EventBus.handlers.hasOwnProperty(event.name)) EventBus.handlers[event.name] = [];

        EventBus.handlers[event.name].push(handler);
    }

    public static Publish (event: DomainEvent): void {
        // eslint-disable-next-line no-prototype-builtins
        if (!EventBus.handlers.hasOwnProperty(event.name)) return;

        // TODO: What if one of the handlers failed?
        for (const handler of EventBus.handlers[event.name]) handler(event);
    }

    // TODO: Should we provide unsubscribe function? Most subscriber will not be shut down.

    public static Clear (): void {
        EventBus.handlers = {};
    }
}

export {
    DomainEvent,
    EventBus
};
