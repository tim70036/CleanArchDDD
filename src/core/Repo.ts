/* eslint-disable @typescript-eslint/no-explicit-any */
import Objection, { Model } from 'objection';
import { CreateLogger } from '../common/Logger';
import { AggregateRoot } from './AggregateRoot';
import { DomainErrorOr } from './DomainError';
import { EntityId } from './EntityId';

abstract class Repo<T extends AggregateRoot<any>> {
    protected logger;

    protected trx?: Objection.Transaction;

    public constructor () {
        this.logger = CreateLogger(this.constructor.name);
    }

    public async StartTrx (): Promise<void> {
        if (!this.IsTrxCompleted())
            this.logger.warn(`attempt to start trx when previous trx not complete`);

        this.trx = await Model.startTransaction();
    }

    public async CommitTrx (): Promise<void> {
        if (typeof this.trx === 'undefined') {
            this.logger.warn(`attempt to commit trx but never start trx`);
            return;
        }

        await this.trx.commit();
    }

    public async RollbackTrx (): Promise<void> {
        if (typeof this.trx === 'undefined') {
            this.logger.warn(`attempt to rollback trx but never start trx`);
            return;
        }

        await this.trx.rollback();
    }

    public IsTrxCompleted (): boolean {
        return typeof this.trx === 'undefined' || this.trx.isCompleted();
    }

    public abstract Exists (id: EntityId): Promise<boolean>;

    public abstract Get (id: EntityId): Promise<DomainErrorOr<T>>;

    public abstract Save (t: T): Promise<void>;
}

export {
    Repo
};
