import Objection from 'objection';
import { DomainErrorOr } from '../../../../core/DomainError';
import { EntityId } from '../../../../core/EntityId';
import { Repo } from '../../../../core/Repo';
import { Session } from '../model/Session';

abstract class ISessionRepo extends Repo<Session> {
    public abstract Save (sessionData: Session, trx?: Objection.Transaction): Promise<void>;

    public abstract Get (uid: EntityId): Promise<DomainErrorOr<Session>>;

    public abstract Exists (uid: EntityId): Promise<boolean>;
}

export {
    ISessionRepo
};
