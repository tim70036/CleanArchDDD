/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreateLogger } from '../common/Logger';
import { AggregateRoot } from './AggregateRoot';
import { ErrOr } from './Result';
import { EntityId } from './EntityId';
import { Transaction } from './Transaction';

abstract class Repo<T extends AggregateRoot<any>> {
    protected logger;

    public constructor () {
        this.logger = CreateLogger(this.constructor.name);
    }

    public abstract Exists(id: EntityId, trx?: Transaction): Promise<boolean>;

    public abstract Get(id: EntityId, trx?: Transaction): Promise<ErrOr<T>>;

    public abstract Save(t: T, trx: Transaction): Promise<void>;
}

export {
    Repo
};
