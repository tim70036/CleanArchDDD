import { AnnouncementDTO } from './AnnouncementDTO';

interface IAnnouncementReadOnlyRepo {
    Get (): Promise<AnnouncementDTO>;
}

export { IAnnouncementReadOnlyRepo };
