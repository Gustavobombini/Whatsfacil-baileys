import { Op } from "sequelize";
import AppError from "../errors/AppError";
import Ticket from "../models/Ticket";

const CheckIfUserHasContact = async (contactId: number,userId: number): Promise<Ticket> => {
  const ticket = await Ticket.findOne({
    where: { contactId, userId, status: "open" }
  });

  return ticket
};

export default CheckIfUserHasContact;
