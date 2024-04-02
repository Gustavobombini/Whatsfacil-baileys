import { Request, Response } from "express";
import { Op, Sequelize, } from "sequelize";
import Ticket from "../models/Ticket";
import Queue from "../models/Queue";
import User from "../models/User";
import Whatsapp from "../models/Whatsapp";
import { log } from "console";

export const index = async (req: Request, res: Response): Promise<Response> => {
  const {data1 , data2} = req.query as any
  
     const  data = await Ticket.findAll({
    where:{
      createdAt: {
        [Op.between]: [data1, data2]
      },
    },
    include: [
      {
        model: Queue,
        required: true,
        // Aqui você pode adicionar mais opções, como where, order, etc. para a associação
      },
      {
        model: User, // Modelo da segunda tabela relacionada
        required: true, // INNER JOIN
        // Aqui você pode adicionar mais opções, como where, order, etc. para a associação
      },
      {
        model: Whatsapp, // Modelo da segunda tabela relacionada
        required: true, // INNER JOIN
        // Aqui você pode adicionar mais opções, como where, order, etc. para a associação
      }
    ],
  });
  console.log(data);
  
  return res.json({data});
}


