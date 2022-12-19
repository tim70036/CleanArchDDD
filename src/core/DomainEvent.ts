import { CreateLogger } from '../common/Logger';

type EventName = string;

abstract class DomainEvent {
    public static get Name (): EventName {
        return this.name;
    }

    public get Name (): EventName {
        return this.constructor.name;
    }
}

interface EventPublisher {
    Publish (event: DomainEvent): void;
}

interface EventHandler <T extends DomainEvent> {
    (event: T): void;
}

class EventBus {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private static handlers: Record<EventName, EventHandler<any>[]> = {};

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static Subscribe (eventName: EventName, handler: EventHandler<any>): void {
        // eslint-disable-next-line no-prototype-builtins
        if (!EventBus.handlers.hasOwnProperty(eventName)) EventBus.handlers[eventName] = [];

        EventBus.handlers[eventName].push(handler);
    }

    public static Publish (event: DomainEvent): void {
        // eslint-disable-next-line no-prototype-builtins
        if (!EventBus.handlers.hasOwnProperty(event.Name)) return;

        // TODO: What if one of the handlers failed?
        for (const handler of EventBus.handlers[event.Name]) handler(event);
    }

    // TODO: Should we provide unsubscribe function? Most subscriber will not be shut down.

    public static Clear (): void {
        EventBus.handlers = {};
    }
}

class QueEventPublisher implements EventPublisher {
    public queEvent: DomainEvent[] = [];

    public Publish (event: DomainEvent): void {
        this.queEvent.push(event);
    }

    public Delete (): void {
        this.queEvent = [];
    }

    public FireQueEvent (): void {
        for (const event of this.queEvent)
            EventBus.Publish(event);

        this.queEvent.splice(0, this.queEvent.length);
    }
}

class InstantEventPublisher implements EventPublisher {
    public Publish (event: DomainEvent): void {
        EventBus.Publish(event);
    }
}

abstract class EventSubscriber {
    protected logger;

    protected constructor () {
        this.logger = CreateLogger(this.constructor.name);
    }

    public abstract Init (): void;
}

export {
    DomainEvent,
    EventBus,
    EventPublisher,
    QueEventPublisher,
    InstantEventPublisher,
    EventSubscriber
};
