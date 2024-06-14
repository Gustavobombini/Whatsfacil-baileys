import express from "express";
import isAuth from "../middleware/isAuth";

import * as chatInternalRoutes from "../controllers/ChatInternalController"

const chatRoutes = express.Router();;



chatRoutes.post("/ChatInternal", chatInternalRoutes.store);

chatRoutes.get("/ChatInternal",  chatInternalRoutes.index);



export default chatRoutes;
