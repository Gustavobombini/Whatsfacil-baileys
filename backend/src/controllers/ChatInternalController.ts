import { Request, Response } from "express";
import ChatInternal from "../models/ChatInternal";
import { Op, Sequelize, QueryTypes  } from "sequelize";
import { log } from "console";
import AppError from "../errors/AppError";
import sequelize from "../database";
import User from "../models/User";

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

  const {receiving_user, type} = req.query as any


  if(type == 1){
    const data = await User.findAll({
      attributes: [
        'id',
        'name',
        [Sequelize.fn('COUNT', Sequelize.col('chatMessages.id')), 'viewed'] // Alias correto para a tabela `ChatInternal`
      ],
      include: [
        {
          model: ChatInternal,
          as: 'chatMessages', // Alias definido no `@HasMany`
          required: false, // Left join
          where: {
            receiving_user: receiving_user,
            viewed: 0
          },
          attributes: [] // Não queremos colunas da tabela ChatInternal, só queremos contar
        }
      ],
      group: ['User.id', 'User.name'] // Agrupar por User.id e User.name
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






