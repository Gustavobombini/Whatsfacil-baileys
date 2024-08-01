import { Request, Response } from "express";
import ChatInternal from "../models/ChatInternal";
import { Op, Sequelize } from "sequelize";
import { log } from "console";

''
export const index = async (req: Request, res: Response): Promise<Response> => {
  const {sent_user , receiving_user} = req.query as any

  await ChatInternal.update(
    { viewed: 1 },
    {
      where: {
        [Op.or]: [
          { receiving_user: sent_user, sent_user: receiving_user }, 
        ],
      }
    }
  );

  const  data = await ChatInternal.findAll({
    where:{
      [Op.or]: [
        { receiving_user: receiving_user, sent_user: sent_user }, 
        { receiving_user: sent_user, sent_user: receiving_user }, 
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


export const file = async (req: Request, res: Response): Promise<Response> => {
  const file = req.files as Express.Multer.File[];
  console.log(file);

  return res.json({file});
};


