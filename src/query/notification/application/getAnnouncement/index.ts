import { AnnouncementReadOnlyRepo } from '../../infra/repo/AnnouncementReadOnlyRepo';
import { GetAnnouncementUseCase as GetAnnouncementUseCaseV1029 } from './v1.0.29/GetAnnouncementUseCase';
import { GetAnnouncementController as GetAnnouncementControllerV1029 } from './v1.0.29/GetAnnouncementController';
import { Dispatcher } from '../../../../core/Dispatcher';

const announcementRepo = new AnnouncementReadOnlyRepo();

const getAnnouncementUseCaseV1029 = new GetAnnouncementUseCaseV1029(announcementRepo);
const getAnnouncementControllerV1029 = new GetAnnouncementControllerV1029(getAnnouncementUseCaseV1029);

const versionMap = new Map();
versionMap.set('1.0.29', getAnnouncementControllerV1029);

const getAnnouncementDispatcher = new Dispatcher(versionMap);

export { getAnnouncementDispatcher };
