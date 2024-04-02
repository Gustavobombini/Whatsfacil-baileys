import express from "express";
import isAuth from "../middleware/isAuth";
import * as InfoController from "../controllers/InfoController";

const infoRoutes = express.Router();;


infoRoutes.get("/info",  InfoController.index);



export default infoRoutes;
