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
  class groupchatinternal extends Model<groupchatinternal> {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;
  
    @Column
    name: string;
  
    @CreatedAt
    createdAt: Date;
  
    @UpdatedAt
    updatedAt: Date;
  
  }

  export default groupchatinternal;