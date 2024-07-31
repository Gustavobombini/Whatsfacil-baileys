import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  Model,
  PrimaryKey,
  AutoIncrement,
} from "sequelize-typescript";

@Table({
  freezeTableName: true, // Impede a pluralização automática
})


@Table
class chatinternal extends Model<chatinternal> {
  @PrimaryKey
  @AutoIncrement
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

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

}

export default chatinternal;
