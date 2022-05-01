import { Repo } from '../../../../core/Repo';
import { Announcement } from '../model/Announcement';

abstract class IAnnouncementRepo extends Repo<Announcement> {
    public abstract Delete (): Promise<void>;
}

export {
    IAnnouncementRepo
};
