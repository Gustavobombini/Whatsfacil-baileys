import { Request, Response } from "express";
import ChatInternal from "../models/ChatInternal";
import { Op, Sequelize } from "sequelize";
import { log } from "console";
import AppError from "../errors/AppError";

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

export const unViewd = async (req: Request, res: Response): Promise<Response> => {

  const {sent_user , receiving_user, type} = req.query as any


  if(type == 1){
    const  data = await ChatInternal.findAll({
      where:{
        [Op.or]: [
          { receiving_user: receiving_user, sent_user: sent_user, viewed: 0 },
        ],
      },
      order: [['id', 'ASC']],
    });

    return res.json({data});
  }else{

    if(receiving_user){
    const  data = await ChatInternal.findAll({
      where:{
        [Op.or]: [
          { receiving_user: receiving_user, viewed: 0 },
        ],
      },
      order: [['id', 'ASC']],
    });

    return res.json({data});

  }
  }
   

  
};






