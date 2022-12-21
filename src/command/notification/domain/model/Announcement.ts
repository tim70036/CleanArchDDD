import dayjs from 'dayjs';
import { saferJoi } from '../../../../common/SaferJoi';
import { AggregateRoot } from '../../../../core/AggregateRoot';
import { DomainErrorOr } from '../../../../core/DomainError';
import { Result } from '../../../../core/Result';
import { Text } from './Text';
import { Title } from './Title';
import { InvalidDataError } from '../../../../common/CommonError';

interface AnnouncementProps {
    title: Title;
    text: Text;
    startTime: dayjs.Dayjs;
    endTime: dayjs.Dayjs;
}

class Announcement extends AggregateRoot<AnnouncementProps> {
    private static readonly schema = saferJoi.object({
        title: saferJoi.object().instance(Title),
        text: saferJoi.object().instance(Text),
        startTime: saferJoi.object().instance(dayjs.Dayjs),
        endTime: saferJoi.object().instance(dayjs.Dayjs)
    });

    public static Create (props: AnnouncementProps): DomainErrorOr<Announcement> {
        const { error } = Announcement.schema.validate(props);
        if (error) return new InvalidDataError(`Failed creating class[${Announcement.name}] with message[${error.message}]`);

        const announcement = new Announcement({
            ...props
        });

        return Result.Ok(announcement);
    }
}

export { AnnouncementProps, Announcement };
