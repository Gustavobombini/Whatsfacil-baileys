import { Request, Response } from "express";
import ChatInternal from "../models/ChatInternal";
import { Op, Sequelize, QueryTypes } from "sequelize";
import { log } from "console";
import AppError from "../errors/AppError";
import sequelize from "../database";
import User from "../models/User";
import groupchatinternal from "../models/Groups";
import groupmessages from "../models/ChatInternalGroup";
import GroupsViewed from "../models/GroupsViewed";

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


  return res.json({file});
};

export const unViewd = async (req: Request, res: Response): Promise<Response> => {

  const {receiving_user, type} = req.query as any


  if(type == 1){
    const data = await User.findAll({
      attributes: [
        'id',
        'name',
        [Sequelize.fn('COUNT', Sequelize.col('chatMessages.id')), 'viewed']
      ],
      include: [
        {
          model: ChatInternal,
          as: 'chatMessages',
          required: false,
          where: {
            receiving_user: receiving_user,
            viewed: 0
          },
          attributes: []
        }
      ],
      group: ['User.id', 'User.name']
    });

    // Buscar grupos com indicador de mensagens não lidas
    const rawGroups = await sequelize.query(
      'SELECT groupId FROM usergroups WHERE userId = :userId',
      {
        replacements: { userId: receiving_user },
        type: QueryTypes.SELECT
      }
    );

    // 2. Extrair os IDs
    const groupIds = (rawGroups as { groupId: number }[]).map(g => g.groupId);

    // 3. Buscar os grupos com indicador de mensagens não lidas
    const groups = await groupchatinternal.findAll({
      where: {
        id: groupIds // <-- aqui é o filtro correto sem precisar de associação
      },
      attributes: [
        'id',
        'name',
        [
          Sequelize.literal(`(
            SELECT CASE 
              WHEN EXISTS (
                SELECT 1 
                FROM groupmessages gm
                INNER JOIN (
                  SELECT receiving_group, MAX(createdAt) AS last_message
                  FROM groupmessages
                  GROUP BY receiving_group
                ) AS last_gm
                  ON gm.receiving_group = last_gm.receiving_group
                  AND gm.createdAt = last_gm.last_message
                LEFT JOIN GroupViewed gv
                  ON gv.groupId = gm.receiving_group AND gv.userId = ${receiving_user}
                WHERE gm.receiving_group = groupchatinternal.id
                  AND (gv.updatedAt IS NULL OR gm.createdAt > gv.updatedAt)
              ) THEN 1 
              ELSE 0 
            END
          )`),
          'hasUnreadMessages'
        ]
      ]
    });

    return res.json({data, groups});
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

      const results = await sequelize.query(`
          SELECT gm.id
          FROM groupmessages gm
          INNER JOIN (
              SELECT receiving_group, MAX(createdAt) AS last_message
              FROM groupmessages
              GROUP BY receiving_group
          ) AS last_gm
            ON gm.receiving_group = last_gm.receiving_group
            AND gm.createdAt = last_gm.last_message
          INNER JOIN usergroups uq
            ON uq.groupId = gm.receiving_group AND uq.userId = :userId
          LEFT JOIN GroupViewed gv
            ON gv.groupId = gm.receiving_group AND gv.userId = :userId
          WHERE gv.updatedAt IS NULL OR gm.createdAt > gv.updatedAt;
          `, {
          replacements: { userId: receiving_user },
          type: QueryTypes.SELECT
        });

    return res.json({data , results});

    }
  }


   

  
};

export const groupChat = async (req: Request, res: Response): Promise<Response> => {
  const {receiving_group , sent_user} = req.query as any;

  if(!receiving_group){
    throw new AppError('Group not found', 404);
  }

    await GroupsViewed.upsert(
    {
      groupId: receiving_group,
      userId: sent_user
    }
  );

  const data = await groupmessages.findAll({
    where: {
      receiving_group: receiving_group
    },
  });

  return res.json({data});
};

export const groupChatStore = async (req: Request, res: Response): Promise<Response> => {
  const data = req.body;

  if(!data.receiving_group){
    throw new AppError('Group not found', 404);
  }
  const create = await groupmessages.create(data);

  await GroupsViewed.upsert(
    {
      groupId: data.receiving_group,
      userId: data.sent_user
    }
  );


  return res.json({create});
};






