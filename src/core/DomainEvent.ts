import { CreateLogger } from "../common/Logger";
import { AggregateRoot } from "./AggregateRoot";

type DomainEventName = string;

abstract class DomainEvent {
  public static get Name(): DomainEventName {
    return this.name;
  }

  public get Name(): DomainEventName {
    return this.constructor.name;
  }
}

type DomainEventHandler<T extends DomainEvent> = (event: T) => void;

class DomainEventBus {
  private static readonly logger = CreateLogger(DomainEventBus.name);

   
  private static readonly handlerMap = new Map<
    DomainEventName,
    DomainEventHandler<any>[]
  >();

  public static Subscribe<T extends DomainEvent>(
    eventName: DomainEventName,
    handler: DomainEventHandler<T>,
  ): void {
    let handlers = DomainEventBus.handlerMap.get(eventName);
    if (typeof handlers === "undefined") handlers = [];

    handlers.push(handler);
    DomainEventBus.handlerMap.set(eventName, handlers);
  }

  public static PublishForAggregate(aggr: AggregateRoot<unknown>): void {
    for (const event of aggr.domainEvents) DomainEventBus.Publish(event);

    aggr.domainEvents.splice(0, aggr.domainEvents.length); // Empty the array.
  }

  public static Publish(event: DomainEvent): void {
    const handlers = DomainEventBus.handlerMap.get(event.Name);
    if (typeof handlers === "undefined") {
      DomainEventBus.logger.warn(
        `publish event error: no handler exist for eventName[${event.Name}]`,
        {
          eventName: event.Name,
        },
      );
      return;
    }

    for (const handler of handlers) {
      try {
        handler(event);
      } catch (error) {
        DomainEventBus.logger.error(`publish event error`, error, {
          eventName: event.Name,
        });
      }
    }
  }

  public static Clear(): void {
    DomainEventBus.handlerMap.clear();
  }
}

export { DomainEvent, DomainEventBus };
