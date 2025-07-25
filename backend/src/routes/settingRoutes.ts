import { Router } from "express";
import isAuth from "../middleware/isAuth";

import * as SettingController from "../controllers/SettingController";

const settingRoutes = Router();

settingRoutes.get("/settings", isAuth, SettingController.index);

// routes.get("/settings/:settingKey", isAuth, SettingsController.show);

// change setting key to key in future
settingRoutes.put("/settings/:settingKey", isAuth, SettingController.update);

settingRoutes.post("/settings/groups", isAuth, SettingController.createGroup);

settingRoutes.delete("/settings/groups/:groupId", isAuth, SettingController.deleteGroup);

export default settingRoutes;
