import { redisClient } from '../../../../infra/database/Redis';
import { AnnouncementDTO } from '../../domain/repo/AnnouncementDTO';
import { IAnnouncementReadOnlyRepo } from '../../domain/repo/AnnouncementReadOnlyRepo';

const prefix = 'announcement:';

class AnnouncementReadOnlyRepo implements IAnnouncementReadOnlyRepo {
    public async Get (): Promise<AnnouncementDTO> {
        let announcement = this.GetDefaultAnnouncement();

        const redisAnnouncement = await redisClient.get(`${prefix}`);
        if (redisAnnouncement !== null)
            announcement = JSON.parse(redisAnnouncement) as AnnouncementDTO;

        return announcement;
    }

    private GetDefaultAnnouncement (): AnnouncementDTO {
        const announcement: AnnouncementDTO = {
            announcementId: '',
            title: '',
            text: '',
            startTime: '2000-01-01T00:00:00Z',
            endTime: '2000-01-01T00:00:00Z',
        };

        return announcement;
    }
}

export { AnnouncementReadOnlyRepo };
