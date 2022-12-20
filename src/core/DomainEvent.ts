import { CreateLogger } from '../common/Logger';
import { AggregateRoot } from './AggregateRoot';

type DomainEventName = string;

abstract class DomainEvent {
    public static get Name (): DomainEventName {
        return this.name;
    }

    public get Name (): DomainEventName {
        return this.constructor.name;
    }
}

interface DomainEventHandler <T extends DomainEvent> {
    (event: T): void;
}

class DomainEventBus {
    private static logger = CreateLogger(DomainEventBus.name);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private static handlers: Record<DomainEventName, DomainEventHandler<any>[]> = {};

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static Subscribe (eventName: DomainEventName, handler: DomainEventHandler<any>): void {
        // eslint-disable-next-line no-prototype-builtins
        if (!DomainEventBus.handlers.hasOwnProperty(eventName)) DomainEventBus.handlers[eventName] = [];

        DomainEventBus.handlers[eventName].push(handler);
    }

    public static Publish (event: DomainEvent): void {
        // eslint-disable-next-line no-prototype-builtins
        if (!DomainEventBus.handlers.hasOwnProperty(event.Name)) return;

        for (const handler of DomainEventBus.handlers[event.Name]) {
            try {
                handler(event);
            } catch (error) {
                // TODO
                DomainEventBus.logger.error(`publish error eventName[${event.Name}] error[${error}]`);
            }
        }
    }

    // TODO: Should we provide unsubscribe function? Most subscriber will not be shut down.

    public static Clear (): void {
        DomainEventBus.handlers = {};
    }
}

class DomainEventPublisher {
    public static Publish (event: DomainEvent): void {
        DomainEventBus.Publish(event);
    }

    public static PublishForAggregate (aggr: AggregateRoot<any>): void {
        for (const event of aggr.domainEvents) {
            DomainEventPublisher.Publish(event);
        }
        aggr.domainEvents.splice(0, aggr.domainEvents.length); // Empty the array.
    }
}

abstract class DomainEventSubscriber {
    protected logger;

    protected constructor () {
        this.logger = CreateLogger(this.constructor.name);
    }

    public abstract Init (): void;
}

export {
    DomainEvent,
    DomainEventBus,
    DomainEventPublisher,
    DomainEventSubscriber,
};
