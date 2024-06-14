import { Request, Response } from "express";
import ChatInternal from "../models/ChatInternal";
import { Op, Sequelize } from "sequelize";
import { log } from "console";

''
export const index = async (req: Request, res: Response): Promise<Response> => {
  const {para , de} = req.query as any
  
     const  data = await ChatInternal.findAll({
    where:{
      [Op.or]: [
        { para: para, de: de }, 
        { para: de, de: para }, 
      ],
    },
    order: [['id', 'ASC']],
  });
  
  return res.json({data});
}

export const store = async (req: Request, res: Response): Promise<Response> => {
    const data = req.body;

    const create = ChatInternal.create(data)

    return res.json({create});
};


