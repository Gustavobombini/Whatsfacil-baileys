import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  Model,
  PrimaryKey,
  AutoIncrement,
  BeforeUpdate,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import User from "./User";

@Table({
  freezeTableName: true, // Impede a pluralização automática
})


@Table
class groupmessages extends Model<groupmessages> {
  @PrimaryKey
  @AutoIncrement
  @ForeignKey(() => User)
  
  @Column
  id: number;

  @Column
  message: string;

  @Column
  data: string;

  @Column
  sent_user: number;

    @Column
  sent_name: string;

  @Column
  receiving_group: number;

  @Column
  type_message: string;

  @Column
  viewed: string;
  
  @Column
  filename: string;
  
  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @BelongsTo(() => User)
  sender: User; // 

}

export default groupmessages;
