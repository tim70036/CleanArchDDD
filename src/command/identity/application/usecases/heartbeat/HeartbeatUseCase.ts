import { DoesNotExistError, InternalServerError, InvalidDataError } from '../../../../../common/CommonError';
import { DomainErrorOr } from '../../../../../core/DomainError';
import { QueEventPublisher } from '../../../../../core/DomainEvent';
import { EntityId } from '../../../../../core/EntityId';
import { Result } from '../../../../../core/Result';
import { UseCase } from '../../../../../core/UseCase';
import { ISessionRepo } from '../../../domain/repo/ISessionRepo';
import { HeartbeatClientWsEvent } from './HeartbeatClientWsEvent';


type Response = DomainErrorOr<void>;

class HeartbeatUseCase extends UseCase<HeartbeatClientWsEvent, void> {
    private readonly sessionRepo: ISessionRepo;

    public constructor (sessionRepo: ISessionRepo) {
        super();
        this.sessionRepo = sessionRepo;
    }

    protected async Run (event: HeartbeatClientWsEvent): Promise<Response> {
        const eventPublisher = new QueEventPublisher();

        const uidOrError = EntityId.CreateFrom(event.uid);

        if (uidOrError.IsFailure())
            return new InvalidDataError(event.uid);

        const uid: EntityId = uidOrError.Value;
        try {
            const sessionOrError = await this.sessionRepo.Get(uid);

            if (sessionOrError.IsFailure())
                return new DoesNotExistError(event.uid);

            const session = sessionOrError.Value;
            session.SetEventPublisher(eventPublisher);
            session.Heartbeat(event.ip);

            // TODO: this is currently served for operation purpose. Let gm can verified user's ip during a time window through log.
            // Can we do better?
            this.logger.info(`${event.uid} heartbeat, ip: ${event.ip}`);

            await this.sessionRepo.Save(session);
            eventPublisher.FireQueEvent();
            return Result.Ok();
        } catch (err: unknown) {
            return new InternalServerError(`${(err as Error).stack}`);
        }
    }
}

export { HeartbeatUseCase };
