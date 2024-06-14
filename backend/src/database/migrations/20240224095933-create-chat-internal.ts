import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.createTable("ChatInternal", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      inputValue: {
        type: DataTypes.STRING,
        allowNull: false
      },
      data: {
        type: DataTypes.STRING,
        allowNull: false
      },
      de: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      para: {
        type: DataTypes.INTEGER,
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
    return queryInterface.dropTable("ChatInternal");
  }
};
