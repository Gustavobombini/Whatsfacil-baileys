import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.createTable("groupMessages", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      message: {
        type: DataTypes.STRING,
        allowNull: false
      },
      data: {
        type: DataTypes.STRING,
        allowNull: false
      },
      sent_user: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      receiving_group: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      type_message: {
        type: DataTypes.STRING,
        allowNull: false
      },
      viewed: {
        type: DataTypes.STRING,
        allowNull: false
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
      },

    });
  },

  down: (queryInterface: QueryInterface) => {
    return queryInterface.dropTable("chatinternal");
  }
};
