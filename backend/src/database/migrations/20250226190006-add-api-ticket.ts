import { tr } from "date-fns/locale";
import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.addColumn("Tickets", "api", {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: ''
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn("Tickets", "api");

  }
};
