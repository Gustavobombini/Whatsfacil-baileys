import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.addColumn("Queues", "closed", {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    });
    
    await queryInterface.addColumn("Queues", "defaults", {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn("queues", "closed");
    await queryInterface.removeColumn("queues", "defaults");
  }
};
