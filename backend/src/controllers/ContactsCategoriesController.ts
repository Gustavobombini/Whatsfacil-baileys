import { Request, Response } from "express";
import ContactsCategories from "../models/ContactsCategories";



export const index = async (req: Request, res: Response): Promise<Response> => {

  const  data = await ContactsCategories.findAll({
    order: [["id", "ASC"]],
  });

console.log(data);


  return res.json({data});
}




export const store = async (req: Request, res: Response): Promise<Response> => {
    const {name} = req.body;

     await ContactsCategories.create({name});


    return res.json({});

};

