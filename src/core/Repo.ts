/* eslint-disable @typescript-eslint/no-explicit-any */
import Objection from 'objection';
import { CreateLogger } from '../common/Logger';
import { AggregateRoot } from './AggregateRoot';
import { ErrOr } from './Result';
import { EntityId } from './EntityId';

abstract class Repo<T extends AggregateRoot<any>> {
    protected logger;

    public constructor () {
        this.logger = CreateLogger(this.constructor.name);
    }

    public abstract Exists(id: EntityId, trx?: Objection.Transaction): Promise<boolean>;

    public abstract Get(id: EntityId, trx?: Objection.Transaction): Promise<ErrOr<T>>;

    public abstract Save(t: T, trx: Objection.Transaction): Promise<void>;
}

export {
    Repo
};
