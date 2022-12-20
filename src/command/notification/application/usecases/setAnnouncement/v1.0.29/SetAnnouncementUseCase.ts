import dayjs from 'dayjs'
import { InternalServerError, InvalidDataError } from '../../../../../../common/CommonError';
import { DomainErrorOr } from '../../../../../../core/DomainError';
import { Result } from '../../../../../../core/Error';
import { UseCase } from '../../../../../../core/UseCase';
import { Announcement } from '../../../../domain/model/Announcement';
import { Text } from '../../../../domain/model/Text';
import { Title } from '../../../../domain/model/Title';
import { IAnnouncementRepo } from '../../../../domain/repo/AnnouncementRepo';
import { SetAnnouncementCTO } from './SetAnnouncementDTO';
import { Transaction } from '../../../../../../common/Transaction';

type Response = DomainErrorOr<void>;

class SetAnnouncementUseCase extends UseCase<SetAnnouncementCTO, void> {
    private readonly announcementRepo: IAnnouncementRepo;

    public constructor (announcementRepo: IAnnouncementRepo) {
        super();
        this.announcementRepo = announcementRepo;
    }

    public async Run (request: SetAnnouncementCTO): Promise<Response> {
        const titleOrError = Title.Create(request.title);
        const textOrError = Text.Create(request.text);

        const dtoResult = Result.Combine([titleOrError, textOrError]);

        if (dtoResult.IsFailure())
            return new InvalidDataError(`${dtoResult.Error}`);

        const title = titleOrError.Value as Title;
        const text = textOrError.Value as Text;

        const startTime = dayjs(request.startTime).utc();
        const endTime = dayjs(request.endTime).utc();

        if (!startTime.isValid() || !endTime.isValid())
            return new InvalidDataError(`Invalid Date`);

        const announcementOrError = Announcement.Create({ title, text, startTime, endTime });
        if (announcementOrError.IsFailure())
            return new InvalidDataError(`${announcementOrError.Error}`);
        const announcement = announcementOrError.Value;

        const trx = await Transaction.Acquire(this.constructor.name);
        try {
            await this.announcementRepo.Save(announcement, trx.Raw);
            trx.Commit();
            this.logger.info(`set announcement with title[${announcement.Title.Value}]`);
            return Result.Ok();
        } catch (err: unknown) {
            trx.Rollback();
            return new InternalServerError(`${(err as Error).stack}`);
        }
    }
}

export { SetAnnouncementUseCase };
