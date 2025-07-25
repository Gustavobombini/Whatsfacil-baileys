import { WAMessage, AnyMessageContent } from "@whiskeysockets/baileys";

import fs from "fs";
import { exec } from "child_process";
import path from "path";
import ffmpegPath from "@ffmpeg-installer/ffmpeg";
import AppError from "../../errors/AppError";
import GetTicketWbot from "../../helpers/GetTicketWbot";
import Ticket from "../../models/Ticket";

interface Request {
  media: Express.Multer.File;
  ticket: Ticket;
  body?: string;
}

const publicFolder = path.resolve(__dirname, "..", "..", "..", "public");

export const processAudio = async (audio: string): Promise<string> => {
  const outputAudio = `${publicFolder}/${new Date().getTime()}.mp3`;
  return new Promise((resolve, reject) => {
    exec(
      `${ffmpegPath.path} -i ${audio} -vn -ab 128k -ar 44100 -f ipod ${outputAudio} -y`,
      (error, _stdout, _stderr) => {
        if (error) reject(error);
        fs.unlinkSync(audio);
        resolve(outputAudio);
      }
    );
  });
};

export const processAudioFile = async (audio: string): Promise<string> => {
  const outputAudio = `${publicFolder}/${new Date().getTime()}.mp3`;
  return new Promise((resolve, reject) => {
    exec(
      `${ffmpegPath.path} -i ${audio} -vn -ar 44100 -ac 2 -b:a 192k ${outputAudio}`,
      (error, _stdout, _stderr) => {
        if (error) reject(error);
        fs.unlinkSync(audio);
        resolve(outputAudio);
      }
    );
  });
};

const SendWhatsAppMedia = async ({
  media,
  ticket,
  body
}: Request): Promise<WAMessage> => {
  try {
    const wbot = await GetTicketWbot(ticket);

    const pathMedia = media.path;
    const typeMessage = media.mimetype.split("/")[0];
    let options: AnyMessageContent;

    if (typeMessage === "video") {
      options = {
        video: fs.readFileSync(pathMedia),
        caption: body,
        fileName: media.originalname
        // gifPlayback: true
      };
    } else if (media.path.slice(-3) === "ogg") {
      const namefile = media.originalname.split('.');
      options = {
        audio: fs.readFileSync(pathMedia),
        fileName:  namefile[0] + ".mp3",
        mimetype: 'audio/mp4'
      };
    } else if (typeMessage === "audio") {
      const typeAudio = media.originalname.includes("audio-record-site");
      if (typeAudio) {
        const convert = await processAudio(media.path);
        options = {
          audio: fs.readFileSync(convert),
          mimetype: typeAudio ? "audio/mp4" : media.mimetype,
          ptt: true
        };
      } else {
        const convert = await processAudioFile(media.path);
        options = {
          audio: fs.readFileSync(convert),
          mimetype: typeAudio ? "audio/mp4" : media.mimetype
        };
      }
    } else if (typeMessage === "document") {
      options = {
        document: fs.readFileSync(pathMedia),
        caption: body,
        fileName: media.originalname,
        mimetype: media.mimetype
      };
    } else if (typeMessage === "application") {
      options = {
        document: fs.readFileSync(pathMedia),
        caption: body,
        fileName: media.originalname,
        mimetype: media.mimetype
      };
    }else if (media.path.slice(-3) === "pdf") {
      options = {
        document: fs.readFileSync(pathMedia),
        caption: body,
        fileName: media.originalname,
        mimetype: 'application/pdf'
      };
    }   else {
      options = {
        image: fs.readFileSync(pathMedia),
        caption: body
      };
    }

    let number = `${ticket.contact.number}@${
      ticket.isGroup ? "g.us" : "s.whatsapp.net"
    }`;

    if (ticket.contact.remote && ticket.contact.remote !== "") {
      number = ticket.contact.remote;
    }

    const sentMessage = await wbot.sendMessage(
      number,
      {
        ...options
      }
    );

    await ticket.update({ lastMessage: media.filename });

    return sentMessage;
  } catch (err) {
    //console.log(err);
    throw new AppError("ERR_SENDING_WAPP_MSG");
  }
};

export default SendWhatsAppMedia;
