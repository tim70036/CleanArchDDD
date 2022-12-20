import dayjs from 'dayjs'
import { saferJoi } from '../../../../common/SaferJoi';
import { AggregateRoot } from '../../../../core/AggregateRoot';
import { DomainErrorOr } from '../../../../core/DomainError';
import { Result } from '../../../../core/Error';
import { Text } from './Text';
import { Title } from './Title';

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

    public get Title (): Title {
        return this.props.title;
    }

    public get Text (): Text {
        return this.props.text;
    }

    public get StartTime (): dayjs.Dayjs {
        return this.props.startTime;
    }

    public get EndTime (): dayjs.Dayjs {
        return this.props.endTime;
    }

    public static Create (props: AnnouncementProps): DomainErrorOr<Announcement> {
        const validateOrError = this.IsValidAnnouncement(props);
        if (validateOrError.IsFailure())
            return Result.Fail(validateOrError.Error);

        const announcement = new Announcement({
            ...props
        });

        return Result.Ok(announcement);
    }

    private static IsValidAnnouncement (props: AnnouncementProps): DomainErrorOr<void> {
        const { error } = Announcement.schema.validate(props);
        if (error) return Result.Fail(`Failed creating class[${Announcement.name}] with message[${error.message}]`);

        return Result.Ok();
    }
}

export { AnnouncementProps, Announcement };
