import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  Model,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  ForeignKey,
  BelongsTo,
  HasMany
} from "sequelize-typescript";
import Queue from "./Queue";

@Table
class Chatbot extends Model<Chatbot> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @AllowNull(false)
  @Column
  name: string;

  @Column
  greetingMessage: string;

  @Column
  file: string;

  @ForeignKey(() => Queue)
  @Column
  queueId: number;

  @BelongsTo(() => Queue)
  queue: Queue;

  @ForeignKey(() => Chatbot)
  @Column
  chatbotId: number;

  @Column
  isAgent: boolean;

  @Column
  id_chatbot: number

  @Column
  isQuestion: boolean;

  @Column
  responseQuestion: string;

  @BelongsTo(() => Chatbot)
  mainChatbot: Chatbot;

  @HasMany(() => Chatbot)
  options: Chatbot[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

export default Chatbot;
