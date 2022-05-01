import { AnnouncementRepo } from '../../../infra/repo/AnnouncementRepo';
import { SetAnnouncementUseCase as SetAnnouncementUseCaseV1029 } from './v1.0.29/SetAnnouncementUseCase';
import { SetAnnouncementController as SetAnnouncementControllerV1029 } from './v1.0.29/SetAnnouncementController';
import { Dispatcher } from '../../../../../core/Dispatcher';

const announcementRepo = new AnnouncementRepo();

const setAnnouncementUseCaseV1029 = new SetAnnouncementUseCaseV1029(announcementRepo);
const setAnnouncementControllerV1029 = new SetAnnouncementControllerV1029(setAnnouncementUseCaseV1029);

const versionMap = {
    '1.0.29': setAnnouncementControllerV1029
};

const setAnnouncementDispatcher = new Dispatcher(versionMap);

export { setAnnouncementDispatcher };
