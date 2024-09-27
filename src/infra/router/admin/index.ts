import express from "express";
import { AdminServerAuth } from "../middleware/AdminServerAuth";
import { SetConfigController } from "../../../command/maintenance/application/usecases/setConfig/SetConfigController";
import { SwitchOffController } from "../../../command/maintenance/application/usecases/switchOff/SwitchOffController";
import { maintenanceContainer as cMaintenanceContainer } from "../../../command/maintenance/container";
import { maintenanceContainer as qMaintenanceContainer } from "../../../query/maintenance/container";
import { GetConfigController } from "../../../query/maintenance/application/getConfig/GetConfigController";

const adminRouter = express.Router();
adminRouter.use(AdminServerAuth);

adminRouter.put("/maintenance/config", (req, res) => {
  cMaintenanceContainer.resolve(SetConfigController).Execute(req, res);
});

adminRouter.get("/maintenance/config", (req, res) => {
  qMaintenanceContainer.resolve(GetConfigController).Execute(req, res);
});

adminRouter.post("/maintenance/switch-off", (req, res) => {
  cMaintenanceContainer.resolve(SwitchOffController).Execute(req, res);
});

export { adminRouter };
