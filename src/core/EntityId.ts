import uuid from 'uuid';
import { ErrOr } from './Err';
import { Result } from './Result';
import { saferJoi } from '../common/SaferJoi';
import { InvalidDataError } from '../common/CommonError';

class Id<T> {
    private readonly value: T;

    public constructor (value: T) {
        this.value = value;
    }

    public get Value (): T {
        return this.value;
    }

    public Equals (id: Id<T>): boolean {
        if (typeof id === 'undefined') return false;
        if (!(id instanceof this.constructor)) return false;
        return id.Value === this.value;
    }

    public ToString (): string {
        return String(this.value);
    }
}

// Entity will have unique id. If no id is provided, then we'll
// generate a new unique id.
class EntityId extends Id<string> {
    private constructor (id: string = uuid.v1()) {
        // It's important to use uuid v1 here, this
        // can help database operates much more optimal. See:
        // https://www.npmjs.com/package/binary-uuid
        // https://www.percona.com/blog/2014/12/19/store-uuid-optimized-way/
        super(id);
    }

    public static Create (): EntityId {
        return new EntityId();
    }

    public static CreateFrom (id: string): ErrOr<EntityId> {
        const schema = saferJoi.string().uuid({ version: 'uuidv1' }).required();
        const { error } = schema.validate(id);
        if (error) return new InvalidDataError(`entityId create failed: [${error.message}]`);

        return Result.Ok(new EntityId(id));
    }
}

export {
    EntityId,
};
