import { logger } from "../../utils/logger";
import SendWhatsAppMessage from "../WbotServices/SendWhatsAppMessage";
import SendWhatsAppMedia from "../WbotServices/SendWhatsAppMedia";
import axios from "axios";
import fs from "fs";
import ShowQueueService from "../QueueService/ShowQueueService";


const iniciarAPI = async (ticket, queueId?) => {

    let urlApi = null;
    let msg = ""

    if(queueId){
        const queue = await ShowQueueService(queueId);
        urlApi = queue.api;
        msg = "Ola, Tudo bem? Preciso tirar algumas duvidas"
    }else{
        urlApi = ticket.api  
        msg = ticket.lastMessage
    }

    try {

               

        logger.info("Iniciando chat com o API", { URL: urlApi });

        const params = new URLSearchParams({
            number: ticket.contact.number,
            body: msg
        });


        const response = await fetch(`${urlApi}?${params}`, {
            method: "get",
            headers: {
            "Content-Type": "application/json"
            }
        });

        const data = await response.json();

        if(data.resposta) {
            SendWhatsAppMessage({ body: data.resposta, ticket: ticket });
        }

        if (urlApi) {
            await ticket.update({ api: urlApi });
        }

        

        console.log(data);
      

        
    } catch (error) {
        console.log(`Erro API: ${error}`);
        
    }

}

export default iniciarAPI