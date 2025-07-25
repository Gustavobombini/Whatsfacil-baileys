import * as Yup from "yup";

import AppError from "../../errors/AppError";
import { SerializeUser } from "../../helpers/SerializeUser";
import ShowUserService from "./ShowUserService";

interface UserData {
  email?: string;
  password?: string;
  name?: string;
  profile?: string;
  queueIds?: number[];
  groupIds?: number[];
  whatsappId?: number;
  queuesNull?: boolean;
  access?: string;
  seeAllMsg?: number;
}

interface Request {
  userData: UserData;
  userId: string | number;
}

interface Response {
  id: number;
  name: string;
  email: string;
  profile: string;
  queuesNull: boolean;
  
}

const UpdateUserService = async ({
  userData,
  userId
}: Request): Promise<Response | undefined> => {
  const user = await ShowUserService(userId);

  const schema = Yup.object().shape({
    name: Yup.string().min(2),
    email: Yup.string().email(),
    profile: Yup.string(),
    password: Yup.string(),
    queuesNull: Yup.boolean(),
    seeAllMsg: Yup.number()
  });

  const { email, password, profile, name, queueIds = [], whatsappId, queuesNull, access, seeAllMsg, groupIds = [] } = userData;

  try {
    await schema.validate({ email, password, profile, name });
  } catch (err) {
    throw new AppError(err.message);
  }

  await user.update({
    email,
    password,
    profile,
    name,
    whatsappId: whatsappId ? whatsappId : null,
    queuesNull,
    access,
    seeAllMsg
  });

  await user.$set("queues", queueIds);

  await user.$set("groups", groupIds);

  await user.reload();

  return SerializeUser(user);
};

export default UpdateUserService;
