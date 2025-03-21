import { tr } from "date-fns/locale";
import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.addColumn("Queues", "file", {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: ''
    });
    
    await queryInterface.addColumn("chatbots", "file", {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: ''
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn("queues", "file");
    await queryInterface.removeColumn("chatbots", "file");
  }
};
