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
  class groupviewed extends Model<groupviewed> {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;
  
    @Column
    groupId: number;

    @Column
    userId: number;

    @CreatedAt
    createdAt: Date;
  
    @UpdatedAt
    updatedAt: Date;
  
  }

  export default groupviewed;