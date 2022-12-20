import Objection from 'objection';
import { DomainErrorOr } from '../../../../core/DomainError';
import { EntityId } from '../../../../core/EntityId';
import { redisClient } from '../../../../infra/database/Redis';
import { Announcement } from '../../domain/model/Announcement';
import { IAnnouncementRepo } from '../../domain/repo/AnnouncementRepo';

const prefix = 'announcement:';

class AnnouncementRepo extends IAnnouncementRepo {
    public async Save (announcement: Announcement, trx: Objection.Transaction): Promise<void> {
        const data = {
            uid: announcement.id.Value,
            title: announcement.props.title.props.value,
            text: announcement.props.text.props.value,
            startTime: announcement.props.startTime.format(),
            endTime: announcement.props.endTime.format()
        };

        // Announcement will alive 30 days
        await redisClient.setEx(`${prefix}`, 60 * 60 * 24 * 30, JSON.stringify(data));

        return;
    }

    public Exists (id: EntityId): Promise<boolean> {
        throw new Error('Not Implemented!');
    }

    public Get (id: EntityId): Promise<DomainErrorOr<Announcement>> {
        throw new Error('Not Implemented!');
    }

    public async Delete (): Promise<void> {
        await redisClient.del(`${prefix}`);
    }
}

export { AnnouncementRepo };
