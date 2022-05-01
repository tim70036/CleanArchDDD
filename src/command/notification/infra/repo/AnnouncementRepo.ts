import { DomainErrorOr } from '../../../../core/DomainError';
import { EntityId } from '../../../../core/EntityId';
import { redisClient } from '../../../../infra/database/Redis';
import { Announcement } from '../../domain/model/Announcement';
import { IAnnouncementRepo } from '../../domain/repo/AnnouncementRepo';

const prefix = 'announcement:';

class AnnouncementRepo extends IAnnouncementRepo {
    public async Save (announcement: Announcement): Promise<void> {
        const data = {
            uid: announcement.Id.Value,
            title: announcement.Title.Value,
            text: announcement.Text.Value,
            startTime: announcement.StartTime.format(),
            endTime: announcement.EndTime.format()
        };

        // Announcement will alive 30 days
        await redisClient.SetExpireAsync(`${prefix}`, JSON.stringify(data), 'EX', 60 * 60 * 24 * 30);

        return;
    }

    public Exists (id: EntityId): Promise<boolean> {
        throw new Error('Not Implemented!');
    }

    public Get (id: EntityId): Promise<DomainErrorOr<Announcement>> {
        throw new Error('Not Implemented!');
    }

    public async Delete (): Promise<void> {
        await redisClient.DelAsync(`${prefix}`);
    }
}

export { AnnouncementRepo };
