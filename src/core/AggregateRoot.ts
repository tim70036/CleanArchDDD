import { DomainEvent } from './DomainEvent';
import { Entity } from './Entity';

abstract class AggregateRoot<T> extends Entity<T> {
    // During modification of aggregate, domain events will happen.
    // They're all buffered here, waiting to be published by event
    // publisher. (Probably after the aggregate is saved to repo).
    // TOOD: If the aggregate has nested entity in it. How to allow
    // that nested entity to push event into this buffer? Maybe we can
    // let every nested entity have their own buffered events. Then, a
    // public function of aggregate will collect all domain events and
    // return to event publisher.
    public readonly domainEvents: DomainEvent[] = [];
}

export {
    AggregateRoot,
};
