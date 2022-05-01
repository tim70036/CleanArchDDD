import { InternalServerError } from '../../../../../common/CommonError';
import { DomainErrorOr } from '../../../../../core/DomainError';
import { Result } from '../../../../../core/Error';
import { UseCase } from '../../../../../core/UseCase';
import { AnnouncementDTO } from '../../../domain/repo/AnnouncementDTO';
import { IAnnouncementReadOnlyRepo } from '../../../domain/repo/AnnouncementReadOnlyRepo';

type Response = DomainErrorOr<AnnouncementDTO>

class GetAnnouncementUseCase extends UseCase<void, AnnouncementDTO> {
    private readonly announcementRepo: IAnnouncementReadOnlyRepo;

    public constructor (announcementRepo: IAnnouncementReadOnlyRepo) {
        super();
        this.announcementRepo = announcementRepo;
    }

    public async Run (): Promise<Response> {
        try {
            const announcement = await this.announcementRepo.Get();

            return Result.Ok(announcement);
        } catch (err: unknown) {
            return new InternalServerError(`${(err as Error).stack}`);
        }
    }
}

export { GetAnnouncementUseCase };
