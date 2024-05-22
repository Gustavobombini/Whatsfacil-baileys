import express from "express";

import * as ContactsCategories from "../controllers/ContactsCategoriesController"

const ContactsCategoriesRoutes = express.Router();;



ContactsCategoriesRoutes.post("/contactcategories/", ContactsCategories.store);

ContactsCategoriesRoutes.get("/contactcategories/",  ContactsCategories.index);



export default ContactsCategoriesRoutes;