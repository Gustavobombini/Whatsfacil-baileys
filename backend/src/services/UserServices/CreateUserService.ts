import * as Yup from "yup";

import AppError from "../../errors/AppError";
import { SerializeUser } from "../../helpers/SerializeUser";
import User from "../../models/User";

interface Request {
  email: string;
  password: string;
  name: string;
  queueIds?: number[];
  groupIds?: number[];
  profile?: string;
  whatsappId?: number;
  queuesNull?: boolean;
  access?: string;
  seeAllMsg?: number;
}

interface Response {
  email: string;
  name: string;
  id: number;
  profile: string;
}

const CreateUserService = async ({
  email,
  password,
  name,
  queueIds = [],
  profile = "admin",
  whatsappId,
  queuesNull,
  access,
  seeAllMsg,
  groupIds
}: Request): Promise<Response> => {
  const schema = Yup.object().shape({
    name: Yup.string().required().min(2),
    email: Yup.string()
      .email()
      .required()
      .test(
        "Check-email",
        "An user with this email already exists.",
        async value => {
          if (!value) return false;
          const emailExists = await User.findOne({
            where: { email: value }
          });
          return !emailExists;
        }
      ),
    password: Yup.string().required().min(5)
  });

  try {
    await schema.validate({ email, password, name });
  } catch (err) {
    throw new AppError(err.message);
  }

  const user = await User.create(
    {
      email,
      password,
      name,
      profile,
      whatsappId: whatsappId ? whatsappId : null,
      queuesNull,
      access,
      seeAllMsg
    },
    { include: ["queues", "whatsapp", "groups"] }
  );

  await user.$set("queues", queueIds);

  await user.$set("groups", groupIds);

  await user.reload();

  return SerializeUser(user);
};

export default CreateUserService;
