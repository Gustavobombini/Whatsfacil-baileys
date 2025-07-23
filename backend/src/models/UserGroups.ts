import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  Model,
  ForeignKey
} from "sequelize-typescript";

import User from "./User";
import groupchatinternal from "./Groups";

@Table
class UserGroups extends Model<UserGroups> {
  @ForeignKey(() => User)
  @Column
  userId: number;

  @ForeignKey(() => groupchatinternal)
  @Column
  groupId: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

export default UserGroups;
