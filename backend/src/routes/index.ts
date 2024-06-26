import { Router } from "express";
import apiRoutes from "./apiRoutes";
import authRoutes from "./authRoutes";
import bulkMessageRoutes from "./bulkMessageRoutes";
import chatBot from "./chatBotRoutes";
import contactRoutes from "./contactRoutes";
import messageRoutes from "./messageRoutes";
import queueRoutes from "./queueRoutes";
import quickAnswerRoutes from "./quickAnswerRoutes";
import scheduleRoutes from "./scheduleRoutes";
import settingMessageRoutes from "./settingMessageRoutes";
import settingRoutes from "./settingRoutes";
import tagRoutes from "./tagRoutes";
import ticketRoutes from "./ticketRoutes";
import userRoutes from "./userRoutes";
import webHookRoutes from "./webHookRoutes";
import whatsappRoutes from "./whatsappRoutes";
import whatsappSessionRoutes from "./whatsappSessionRoutes";
import infoRoutes from "./infoRoutes";
import ContactsCategoriesRoutes from "./ContactsCategoriesRoutes";
import chatInternalRoutes from "./chatInternalRoutes";


const routes = Router();

routes.use(userRoutes);
routes.use("/auth", authRoutes);
routes.use(settingRoutes);
routes.use(contactRoutes);
routes.use(ticketRoutes);
routes.use(whatsappRoutes);
routes.use(messageRoutes);
routes.use(whatsappSessionRoutes);
routes.use(queueRoutes);
routes.use(quickAnswerRoutes);
routes.use(chatBot);
routes.use(scheduleRoutes);
routes.use(tagRoutes);
routes.use("/webhook", webHookRoutes);
routes.use("/api/messages", apiRoutes);
routes.use("/bulkMessage", bulkMessageRoutes);
routes.use(settingMessageRoutes);
routes.use(infoRoutes)
routes.use(ContactsCategoriesRoutes)
routes.use(chatInternalRoutes)

export default routes;
