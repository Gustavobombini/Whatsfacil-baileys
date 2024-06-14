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
  inputValue: string;

  @Column
  data: string;

  @Column
  de: number;

  @Column
  para: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

}

export default chatinternal;
