import { redisClient } from '../../../../infra/database/Redis';
import { Announcement } from '../../domain/model/Announcement';
import { IAnnouncementRepo } from '../../domain/repo/AnnouncementRepo';

const prefix = 'announcement:';

class AnnouncementRepo implements IAnnouncementRepo {
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

    public async Delete (): Promise<void> {
        await redisClient.DelAsync(`${prefix}`);

        return;
    }
}

export { AnnouncementRepo };
