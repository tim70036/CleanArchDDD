import { CreateLogger } from '../common/Logger';
import { EntityId } from './EntityId';

abstract class Entity<T> {
    public readonly id: EntityId;

    public readonly props: T;

    protected logger;

    // Entity will have unique id.

    protected constructor (props: T, id?: EntityId) {
        // If no id provide, create a new id. If there's an id, it's probably reconstitute from persistent storage.
        this.id = id ?? EntityId.Create();
        this.props = props;
        // I had considered using Object.freeze(props) to prevent creator of this object modify the incoming argument later on.
        // However, Object.freeze() only do shallow freeze, so it's not fully safe. Instead, we should force type T to have only readonly members.
        // Also, using interface with merely readonly member will have no performance impact compare to Object.freeze().
        // Please enforce this rule in code review process.
        this.logger = CreateLogger(this.constructor.name);
    }

    public Equals (other: Entity<T>): boolean {
        if (typeof other === 'undefined') return false;
        if (this === other) return true;
        return this.id.Equals(other.id);
    }
}

export {
    Entity,
};
