import { DomainEvent } from '../../../../core/DomainEvent';
import { EntityId } from '../../../../core/EntityId';

class UserCreatedEvent extends DomainEvent {
    public readonly uid: EntityId;

    public constructor (uid: EntityId) {
        super();
        this.uid = uid;
    }
}

export { UserCreatedEvent };
