import { v4 as uuidv4 } from 'uuid';

class Id<T> {
    private readonly value: T;

    public constructor (value: T) {
        this.value = value;
    }

    public Equals (id: Id<T>): boolean {
        if (typeof id === 'undefined') return false;
        if (!(id instanceof this.constructor)) return false;
        return id.ToValue() === this.value;
    }

    public ToString (): string {
        return String(this.value);
    }

    public ToValue (): T {
        return this.value;
    }
}

// Entity will have unique id. If no id is provided, then we'll generate a new unique id.
class EntityId extends Id<string> {
    public constructor (id: string = uuidv4()) {
        super(id);
    }
}

export {
    EntityId,
};
