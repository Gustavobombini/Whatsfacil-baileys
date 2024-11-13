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
class chatinternal extends Model<chatinternal> {
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
  receiving_user: number;

  @Column
  type_message: string;

  @Column
  viewed: number;
  
  @Column
  filename: string;
  
  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @BelongsTo(() => User)
  sender: User; // 

}

export default chatinternal;
