import { Request, Response } from "express";
import { getIO } from "../libs/socket";

import CreateTicketService from "../services/TicketServices/CreateTicketService";
import DeleteTicketService from "../services/TicketServices/DeleteTicketService";
import ListTicketsService from "../services/TicketServices/ListTicketsService";
import ShowTicketService from "../services/TicketServices/ShowTicketService";
import UpdateTicketService from "../services/TicketServices/UpdateTicketService";
import SendWhatsAppMessage from "../services/WbotServices/SendWhatsAppMessage";
import ShowWhatsAppService from "../services/WhatsappService/ShowWhatsAppService";

import Ticket from "../models/Ticket";
import CheckIfUserHasContact from "../helpers/CheckIfUserHasContact";
import AppError from "../errors/AppError";
import ShowDefaultQueueService from "../services/QueueService/ShowDefaultQueueService";

type IndexQuery = {
  searchParam: string;
  pageNumber: string;
  status: string;
  date: string;
  updatedAt?: string;
  showAll: string;
  withUnreadMessages: string;
  queueIds: string;
  tags: string;
};

interface TicketData {
  contactId: number;
  status: string;
  queueId: number;
  userId: number;
}

export const index = async (req: Request, res: Response): Promise<Response> => {
  const {
    pageNumber,
    status,
    date,
    updatedAt,
    searchParam,
    showAll,
    queueIds: queueIdsStringified,
    tags: tagIdsStringified,
    withUnreadMessages
  } = req.query as IndexQuery;

  const userId = req.user.id;

  let queueIds: number[] = [];
  let tagsIds: number[] = [];

  if (queueIdsStringified) {
    queueIds = JSON.parse(queueIdsStringified);
  }

  if (tagIdsStringified) {
    tagsIds = JSON.parse(tagIdsStringified);
  }

  const { tickets, count, hasMore } = await ListTicketsService({
    searchParam,
    tags: tagsIds,
    pageNumber,
    status,
    date,
    updatedAt,
    showAll,
    userId,
    queueIds,
    withUnreadMessages
  });

  return res.status(200).json({ tickets, count, hasMore });
};

export const store = async (req: Request, res: Response): Promise<Response> => {
  const { contactId, status, userId, queueId }: TicketData = req.body;

  const ticket = await CreateTicketService({
    contactId,
    status,
    userId,
    queueId
  });

  const io = getIO();
  // send status to the specific queue channel
  io.to(ticket.status)
    .to(`queue-${ticket.queueId}-${ticket.status}`)
    .emit("ticket", {
      action: "update",
      ticket
    });

  return res.status(200).json(ticket);
};

export const show = async (req: Request, res: Response): Promise<Response> => {
  const { ticketId } = req.params;

  const ticket = await ShowTicketService(ticketId);

  const contact = ticket;

  return res.status(200).json(contact);
};

export const update = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { ticketId } = req.params;
  const ticketData: TicketData = req.body;

  if(ticketData.status === "closed_s_msg"){
    const { ticket } =  await UpdateTicketService({
      ticketData: {status: "closed"},
      ticketId
    });

    return res.status(200).json(ticket)

  }else{
  const { ticket } = await UpdateTicketService({
    ticketData,
    ticketId
  });

  if (ticket.status === "closed") {
    const whatsapp = await ShowWhatsAppService(ticket.whatsappId);

    const { farewellMessage } = whatsapp;

    if (farewellMessage) {
      await SendWhatsAppMessage({
        body: farewellMessage,
        ticket
      });
    }
  }

  return res.status(200).json(ticket);
};
}
export const remove = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { ticketId } = req.params;

  const ticket = await DeleteTicketService(ticketId);

  const io = getIO();
  // send delete message to queues of ticket's current status
  io.to(ticket.status)
    .to(ticketId)
    .to("notification")
    .to(`queue-${ticket.queueId}-${ticket.status}`)
    .to(`queue-${ticket.queueId}-notification`)
    .emit("ticket", {
      action: "delete",
      ticketId: +ticketId
    });

  return res.status(200).json({ message: "ticket deleted" });
};

export const addUser = async (  req: Request,   res: Response): Promise<Response> => {
  const { ticketid, user } = req.body;

  const ticket = await ShowTicketService(ticketid);

  const id = ticket.id;
  let queue = ticket.queueId;


    if(!ticket.isGroup){

     const Newqueue = await ShowDefaultQueueService();

     if(Newqueue){
      const { ticket } =  await UpdateTicketService({
        ticketData: {queueId: Newqueue.id },
        ticketId: id
      });

      queue = Newqueue.id
     }

    }

    const ckeck = await CheckIfUserHasContact(ticket.contactId, user);

    if(!ckeck){

      const newticket = await CreateTicketService({
        contactId: ticket.contactId,
        status: 'open',
        userId: user,
        queueId: queue,
        verify: 1
      }); 

      await newticket.update({whatsappId: ticket.whatsappId});
    
      const io = getIO();
          
      io.to(newticket.status)
      .to(`queue-${newticket.queueId}-${newticket.status}`)
      .emit("ticket", {
        action: "update",
        ticket: newticket
      });
      
      
      return res.json("Usuario adicionado!");
    }else{
      return res.json("Usuario ja na Conversa!");
    }
    

  
  
};
