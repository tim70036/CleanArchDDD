import { AnnouncementRepo } from '../../../infra/repo/AnnouncementRepo';
import { DeleteAnnouncementUseCase as DeleteAnnouncementUseCaseV1029 } from './v1.0.29/DeleteAnnouncementUseCase';
import { DeleteAnnouncementController as DeleteAnnouncementControllerV1029 } from './v1.0.29/DeleteAnnouncementController';
import { Dispatcher } from '../../../../../core/Dispatcher';

const announcementRepo = new AnnouncementRepo();

const deleteAnnouncementUseCaseV1029 = new DeleteAnnouncementUseCaseV1029(announcementRepo);
const deleteAnnouncementControllerV1029 = new DeleteAnnouncementControllerV1029(deleteAnnouncementUseCaseV1029);

const versionMap = {
    '1.0.29': deleteAnnouncementControllerV1029
};

const deleteAnnouncementDispatcher = new Dispatcher(versionMap);

export { deleteAnnouncementDispatcher };
