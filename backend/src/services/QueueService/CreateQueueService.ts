import * as Yup from "yup";
import AppError from "../../errors/AppError";
import Queue from "../../models/Queue";
import Chatbot from "../../models/Chatbot";

interface QueueData {
  name: string;
  color: string;
  greetingMessage?: string;
  chatbots?: Chatbot[];
  closed?: number;
  defaults?: number;
  typebot?: string;
  api?: string
}

const CreateQueueService = async (queueData: QueueData): Promise<Queue> => {
  const { color, name, defaults } = queueData;

  const queueSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, "ERR_QUEUE_INVALID_NAME")
      .required("ERR_QUEUE_INVALID_NAME")
      .test(
        "Check-unique-name",
        "ERR_QUEUE_NAME_ALREADY_EXISTS",
        async value => {
          if (value) {
            const queueWithSameName = await Queue.findOne({
              where: { name: value }
            });

            return !queueWithSameName;
          }
          return false;
        }
      ),
      defaults: Yup.number()
      .test(
        "Check-unique-name",
        "ERR_QUEUE_DEFAULT_ALREADY_EXISTS",
        async value => {
          
          if (value == 1) {
            const queueWithSameName = await Queue.findOne({
              where: { defaults: value }
            });

            return !queueWithSameName;
          }else{
            return true;
          }

          return false;
        }
      ),
    color: Yup.string()
      .required("ERR_QUEUE_INVALID_COLOR")
      .test("Check-color", "ERR_QUEUE_INVALID_COLOR", async value => {
        if (value) {
          const colorTestRegex = /^#[0-9a-f]{3,6}$/i;
          return colorTestRegex.test(value);
        }
        return false;
      })
      .test(
        "Check-color-exists",
        "ERR_QUEUE_COLOR_ALREADY_EXISTS",
        async value => {
          if (value) {
            const queueWithSameColor = await Queue.findOne({
              where: { color: value }
            });
            return !queueWithSameColor;
          }
          return false;
        }
      )
  });

  try {
    await queueSchema.validate({ color, name, defaults });
  } catch (err) {
    throw new AppError(err.message);
  }

  try {
    const queue = await Queue.create(queueData, {
      include: [
        {
          model: Chatbot,
          as: "chatbots",
          attributes: ["id", "name", "greetingMessage", "isAgent"],
          order: [[{ model: Chatbot, as: "chatbots" }, "id", "asc"]]
        }
      ]
    });
    return queue;
  } catch (err) {
    throw new AppError("ERR_QUEUE_CREATE_FAILED");
  }
};

export default CreateQueueService;
