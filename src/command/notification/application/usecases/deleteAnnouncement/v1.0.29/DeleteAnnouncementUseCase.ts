import { InternalServerError } from '../../../../../../common/CommonError';
import { DomainErrorOr } from '../../../../../../core/DomainError';
import { Result } from '../../../../../../core/Result';
import { UseCase } from '../../../../../../core/UseCase';
import { IAnnouncementRepo } from '../../../../domain/repo/AnnouncementRepo';

type Response = DomainErrorOr<void>;

class DeleteAnnouncementUseCase extends UseCase<void, void> {
    private readonly announcementRepo: IAnnouncementRepo;

    public constructor (announcementRepo: IAnnouncementRepo) {
        super();
        this.announcementRepo = announcementRepo;
    }

    public async Run (): Promise<Response> {
        try {
            await this.announcementRepo.Delete();
            this.logger.info(`delete announcement`);
            return Result.Ok();
        } catch (err: unknown) {
            return new InternalServerError(`${(err as Error).stack}`);
        }
    }
}

export { DeleteAnnouncementUseCase };
