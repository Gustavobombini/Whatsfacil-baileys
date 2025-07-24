import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  Model,
  PrimaryKey,
  AutoIncrement,
  Unique,
} from "sequelize-typescript";

@Table({
  freezeTableName: true,
})
class GroupViewed extends Model<GroupViewed> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Unique("group_user_unique")
  @Column
  groupId: number;

  @Unique("group_user_unique")
  @Column
  userId: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

export default GroupViewed;
