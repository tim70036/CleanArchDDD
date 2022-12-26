import { InternalServerError } from '../../../../../common/CommonError';
import { Transaction } from '../../../../../core/Transaction';
import { DomainEventBus } from '../../../../../core/DomainEvent';
import { EntityId } from '../../../../../core/EntityId';
import { Result, ErrOr } from '../../../../../core/Result';
import { UseCase } from '../../../../../core/UseCase';
import { ISessionRepo } from '../../../domain/repo/ISessionRepo';
import { StartSessionClientWsEvent } from './StartSessionWsEvent';

class StartSessionUseCase extends UseCase<StartSessionClientWsEvent, void> {
    private readonly sessionRepo: ISessionRepo;

    public constructor (sessionRepo: ISessionRepo) {
        super();
        this.sessionRepo = sessionRepo;
    }

    protected async Run (event: StartSessionClientWsEvent): Promise<ErrOr<void>> {
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
            session.Start(event.ip);

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

export { StartSessionUseCase };
