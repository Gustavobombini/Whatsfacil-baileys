import { boolean } from "yup";
import AppError from "../../errors/AppError";
import Message from "../../models/Message";
import Ticket from "../../models/Ticket";
import Whatsapp from "../../models/Whatsapp";
import ShowTicketService from "../TicketServices/ShowTicketService";

interface Request {
  ticketId: string;
  pageNumber?: string;
}

interface Response {
  messages: Message[];
  ticket: Ticket;
  count: number;
  hasMore: boolean;
}

const ListMessagesService = async ({
  pageNumber = "1",
  ticketId,
}: Request): Promise<Response> => {
  const ticket = await ShowTicketService(ticketId);

  if (!ticket) {
    throw new AppError("ERR_NO_TICKET_FOUND", 404);
  }

  const limit = 100;
  const offset = limit * (+pageNumber - 1);
  
  const viewOthers = Number(process.env.VIEW_MSG_OTHERS_NUMBER);
  const viewOthersQueue = Number(process.env.VIEW_MSG_OTHERS_QUEUE);
  const viewOthersClosed = Number(process.env.VIEW_MSG_OTHERS_NUMBER_CLOSED);

  let viewClosed = false;
 
  if(ticket.status == 'closed'){
    if(viewOthersClosed == 2){
      viewClosed = true;
    }
  }


    const { count, rows: messages } = await Message.findAndCountAll({
        limit,
        include: [
            "contact",
            {
                model: Message,
                as: "quotedMsg",
                include: ["contact"]
            },
            {
                model: Ticket,
                where: { contactId: ticket.contactId, 
                  ...((viewOthers == 2 || viewClosed)  && { whatsappId: ticket.whatsappId }),
                  ...((viewOthersQueue == 1 || viewClosed)  && { queueId: ticket.queueId })
                  },
                required: true
            },
        ],
        offset,
        order: [["createdAt", "DESC"]]
    });

  const hasMore = count > offset + messages.length;

  return {
    messages: messages.reverse(),
    ticket,
    count,
    hasMore
  };
};

export default ListMessagesService;
