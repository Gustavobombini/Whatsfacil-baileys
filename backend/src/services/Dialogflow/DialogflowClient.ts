import { log } from "console";
import { logger } from "../../utils/logger";
import { verifyMessage } from "../WbotServices/wbotMessageListener";
import SendWhatsAppMessage from "../WbotServices/SendWhatsAppMessage";
import SendWhatsAppMedia from "../WbotServices/SendWhatsAppMedia";
import axios from "axios";
import fs from "fs";
import ytdl from "@distube/ytdl-core";


type Message = {
  id: string;
  type: string;
  content?: {
    type?: string;
    richText?: { type: string; children: { text: string }[] }[];
    url?: string;
  };
};

const downloadFile = async (url, outputPath) => {
  const response = await axios({
      url,
      method: "GET",
      responseType: "stream",
  });

  return new Promise((resolve, reject) => {
      const writer = fs.createWriteStream(outputPath);
      response.data.pipe(writer);

      writer.on("finish", resolve);
      writer.on("error", reject);
  });
};



const iniciarChat = async (ticket , typeId?) => {
  const extractText = (nodes: any[]): string =>
    nodes.reduce((acc, node) => {
      if (node.text) return acc + node.text; 
      if (node.children) return acc + extractText(node.children); 
      return acc;
    }, "");

  try {
    if (!ticket.typebot) {

      logger.info("Iniciando chat com o Typebot", { TypebotId: typeId });

      const response = await fetch(`https://typebot.io/api/v1/typebots/${typeId}/startChat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          isStreamEnabled: true,
          isOnlyRegistering: false,
          prefilledVariables: {
            number: ticket.contact.number
          }
        })
      });


      if (!response.ok) throw new Error(`Erro na API: ${response.status}`);

      const data = await response.json();

      if (data.resultId) {
        await ticket.update({ typebot: data.sessionId });
      }

      if (data.messages && data.messages.length > 0) {
        for (const msg of data.messages) {
          if (msg.type === "text" && msg.content?.richText) {

            const text = msg.content.richText
              .map((node: any) => (node.type === "p" ? extractText(node.children) + "\n" : extractText(node.children)))
              .join("");

            if (text) {
              SendWhatsAppMessage({ body: text, ticket: ticket });
            }

          }else if (msg.type === "image" && msg.content?.url) {

            const filename = `${new Date().getTime()}.jpg`;
            const filepath = `public/${filename}`;	

            await downloadFile(msg.content.url, filepath);
            
            const media = {
              fieldname: 'file',
              originalname: filename,
              encoding: '7bit',
              mimetype: 'image/jpeg',
              size: fs.statSync(filepath).size,
              destination: 'public/',
              filename: filename,
              path: filepath,
              buffer: Buffer.alloc(0),
              stream: fs.createReadStream(filepath)
            };

            SendWhatsAppMedia({ media: media, ticket: ticket });

            setTimeout(() => {
              fs.unlinkSync(filepath);
            }, 5000);

            

          }else if (msg.type === "audio" && msg.content?.url) {

            const filename = `${new Date().getTime()}.ogg`;
            const filepath = `public/${filename}`;	

            await downloadFile(msg.content.url, filepath);
            
            const media = {
              fieldname: 'file',
              originalname: filename,
              encoding: '7bit',
              mimetype: 'audio/ogg',
              size: fs.statSync(filepath).size,
              destination: 'public/',
              filename: filename,
              path: filepath,
              buffer: Buffer.alloc(0),
              stream: fs.createReadStream(filepath)
            };

            SendWhatsAppMedia({ media: media, ticket: ticket });

            setTimeout(() => {
              fs.unlinkSync(filepath);
            }, 5000);

          }
        }
      } 
    } else if(ticket.typebot !== 'end') {

      const response = await fetch(`https://typebot.io/api/v1/sessions/${ticket.typebot}/continueChat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: ticket.lastMessage
        })
      });

      if (!response.ok) throw new Error(`Erro na API: ${response.status}`);

      const data = await response.json();

      if (!data.resultId) {
        await ticket.update({ typebot: 'end' });
      }
      
      if (data.messages && data.messages.length > 0) {
        for (const msg of data.messages) {

          if (msg.type === "text" && msg.content?.richText) {

            const text = msg.content.richText
              .map((node: any) => (node.type === "p" ? extractText(node.children) + "\n" : extractText(node.children)))
              .join("");

            if (text) {
              SendWhatsAppMessage({ body: text, ticket: ticket });

            }

          }else if (msg.type === "image" && msg.content?.url) {

            const filename = `${new Date().getTime()}.jpg`;
            const filepath = `public/${filename}`;	

            await downloadFile(msg.content.url, filepath);
            
            const media = {
              fieldname: 'file',
              originalname: filename,
              encoding: '7bit',
              mimetype: 'image/jpeg',
              size: fs.statSync(filepath).size,
              destination: 'public/',
              filename: filename,
              path: filepath,
              buffer: Buffer.alloc(0),
              stream: fs.createReadStream(filepath)
            };

            SendWhatsAppMedia({ media: media, ticket: ticket });

            setTimeout(() => {
              fs.unlinkSync(filepath);
            }, 5000);

            

          }else if (msg.type === "audio" && msg.content?.url) {

            const filename = `${new Date().getTime()}.ogg`;
            const filepath = `public/${filename}`;	

            await downloadFile(msg.content.url, filepath);
            
            const media = {
              fieldname: 'file',
              originalname: filename,
              encoding: '7bit',
              mimetype: 'audio/ogg',
              size: fs.statSync(filepath).size,
              destination: 'public/',
              filename: filename,
              path: filepath,
              buffer: Buffer.alloc(0),
              stream: fs.createReadStream(filepath)
            };

            SendWhatsAppMedia({ media: media, ticket: ticket });

            setTimeout(() => {
              fs.unlinkSync(filepath);
            }, 5000);

          }
        }
      }
    }
  } catch (error) {
    console.error("Erro no iniciarChat:", error);
  }
};

export default iniciarChat;
