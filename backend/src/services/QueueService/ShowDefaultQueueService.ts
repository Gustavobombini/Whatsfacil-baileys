import AppError from "../../errors/AppError";
import Chatbot from "../../models/Chatbot";
import Queue from "../../models/Queue";

const ShowDefaultQueueService = async (): Promise<Queue> => {
  const queue = await Queue.findOne({
    where:{
      defaults : 1
    },
    order: [["id", "ASC"]],
  });

  if (!queue) {
    throw new AppError("ERR_QUEUE_NOT_FOUND");
  }

  return queue;
};

export default ShowDefaultQueueService;
