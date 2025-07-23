import express from "express";
import uploadConfig from "../config/upload";
import * as chatInternalRoutes from "../controllers/ChatInternalController"
import multer from "multer";

const chatRoutes = express.Router();;
const upload = multer(uploadConfig);



chatRoutes.post("/ChatInternal", chatInternalRoutes.store);

chatRoutes.post("/ChatInternal-file",upload.array("file"), chatInternalRoutes.file);

chatRoutes.get("/ChatInternal",  chatInternalRoutes.index);

chatRoutes.get("/ChatInternal-unviewd",  chatInternalRoutes.unViewd);

chatRoutes.get("/ChatInternal-group",  chatInternalRoutes.groupChat);

chatRoutes.post("/ChatInternal-group",  chatInternalRoutes.groupChatStore);

export default chatRoutes;
