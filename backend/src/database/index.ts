import { Sequelize } from "sequelize-typescript";
import Baileys from "../models/Baileys";
import BaileysSessions from "../models/BaileysSessions";
import Chatbot from "../models/Chatbot";
import Contact from "../models/Contact";
import ContactCustomField from "../models/ContactCustomField";
import DialogChatBots from "../models/DialogChatBots";
import ContactsCategories from "../models/ContactsCategories";
// import dbConfig from "../config/database";
import MassMessages from "../models/MassMessages";
import Message from "../models/Message";
import Queue from "../models/Queue";
import QuickAnswer from "../models/QuickAnswer";
import Schedule from "../models/Schedule";
import Setting from "../models/Setting";
import SettingMessage from "../models/SettingMessage";
import Tag from "../models/Tag";
import Ticket from "../models/Ticket";
import TicketTag from "../models/TicketTag";
import User from "../models/User";
import UserQueue from "../models/UserQueue";
import Whatsapp from "../models/Whatsapp";
import WhatsappQueue from "../models/WhatsappQueue";
import ChatInternal from "../models/ChatInternal";
import groupchatinternal from "../models/Groups";
import GroupMessages from "../models/ChatInternalGroup";
import GroupViewed from "../models/GroupsViewed";
import UserGroups from "../models/UserGroups";
// eslint-disable-next-line
const dbConfig = require("../config/database");

const sequelize = new Sequelize(dbConfig);

const models = [
  User,
  Contact,
  Ticket,
  Message,
  Whatsapp,
  ContactCustomField,
  ContactsCategories,
  Setting,
  Queue,
  WhatsappQueue,
  UserQueue,
  QuickAnswer,
  Baileys,
  Chatbot,
  DialogChatBots,
  Schedule,
  Tag,
  TicketTag,
  SettingMessage,
  MassMessages,
  BaileysSessions,
  ChatInternal,
  groupchatinternal,
  GroupMessages,
  GroupViewed,
  UserGroups
];

sequelize.addModels(models);

export default sequelize;
