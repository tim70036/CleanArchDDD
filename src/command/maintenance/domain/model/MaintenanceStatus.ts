import { saferJoi } from '../../../../common/SaferJoi';

enum MaintenanceStatus
{
    Off = 0,
    AllowWhitelist = 1,
    BlockAll = 2,
}

const maintenanceStatusSchema = saferJoi.number().min(MaintenanceStatus.Off).max(MaintenanceStatus.BlockAll).integer();

export { MaintenanceStatus, maintenanceStatusSchema };
