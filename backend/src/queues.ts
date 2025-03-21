import moment from "moment";
import { Op } from "sequelize";
import { logger } from "./utils/logger";
import Schedule from "./models/Schedule";
import Contact from "./models/Contact";

import FindOrCreateTicketService from "./services/TicketServices/FindOrCreateTicketService";
import SendWhatsAppMessage from "./services/WbotServices/SendWhatsAppMessage";
import ShowWhatsAppService from "./services/WhatsappService/ShowWhatsAppService";
import UpdateScheduleService from "./services/ScheduleServices/UpdateService";


export const startQueueProcess = async (): Promise<void> => {
  logger.info("Starting queue process");

  const schedule = await Schedule.findAll({
    where: { 
      'status': 'PENDENTE',
      sendAt: { [Op.lt]: moment().format('YYYY-MM-DDTHH:mm') }
    },
  })

  logger.info(`Agendamentos pendentes para serem enviadas: ${schedule.length}`);

  if(schedule.length > 0) {
    schedule.forEach(async (item) => { 

      const whatsapp = await ShowWhatsAppService(item.whatsappId)

      if(whatsapp.status == "CONNECTED"){
        const contact = await Contact.findByPk(item.contactId);

        const ticket = await FindOrCreateTicketService({
          contact: contact,
          whatsappId: Number(item.whatsappId),
          channel: 'whatsapp',
          unreadMessages: 1
        })
        SendWhatsAppMessage({body: item.body, ticket: ticket})

        UpdateScheduleService({ scheduleData : { 'status' : 'FINALIZADO'}, id: item.id })
      }else{
        UpdateScheduleService({ scheduleData : { 'status' : 'DESCONECTADO'}, id: item.id })  
      }
     
      
    });
  
    
  }
}
