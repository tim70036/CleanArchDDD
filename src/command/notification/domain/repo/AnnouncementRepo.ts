import { Announcement } from '../model/Announcement';

interface IAnnouncementRepo {
    Save (announcement: Announcement): Promise<void>;
    Delete (): Promise<void>;
}

export {
    IAnnouncementRepo
};
