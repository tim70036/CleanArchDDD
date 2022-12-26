import { InternalServerError } from '../../../../../common/CommonError';
import { Transaction } from '../../../../../core/Transaction';
import { ErrOr } from '../../../../../core/Result';
import { DomainEventBus } from '../../../../../core/DomainEvent';
import { EntityId } from '../../../../../core/EntityId';
import { Result } from '../../../../../core/Result';
import { UseCase } from '../../../../../core/UseCase';
import { ISessionRepo } from '../../../domain/repo/ISessionRepo';
import { EndSessionClientWsEvent } from './EndSessionClientWsEvent';

class EndSessionUseCase extends UseCase<EndSessionClientWsEvent, void> {
    private readonly sessionRepo: ISessionRepo;

    public constructor (sessionRepo: ISessionRepo) {
        super();
        this.sessionRepo = sessionRepo;
    }

    protected async Run (event: EndSessionClientWsEvent): Promise<ErrOr<void>> {
        const uidOrError = EntityId.CreateFrom(event.uid);
        if (uidOrError.IsFailure())
            return uidOrError;
        const uid: EntityId = uidOrError.Value;

        const trx = await Transaction.Acquire(this.constructor.name);
        try {
            const sessionOrError = await this.sessionRepo.Get(uid);
            if (sessionOrError.IsFailure())
                return sessionOrError;

            const session = sessionOrError.Value;
            session.End();

            // TODO: this is currently served for operation purpose. Let gm can verified user's ip during a time window through log.
            // Can we do better?
            this.logger.info(`${event.uid} heartbeat`);

            await this.sessionRepo.Save(session, trx);
            await trx.Commit();

            DomainEventBus.PublishForAggregate(session);
            return Result.Ok();
        } catch (error) {
            await trx.Rollback();
            return new InternalServerError(`${(error as Error).stack}`);
        }
    }
}

export { EndSessionUseCase };
