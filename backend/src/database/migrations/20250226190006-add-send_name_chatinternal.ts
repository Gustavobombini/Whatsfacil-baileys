import { tr } from "date-fns/locale";
import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.addColumn("groupMessages", "sent_name", {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: ''
    });

    await queryInterface.addColumn("chatinternal", "sent_name", {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: ''
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn("groupMessages", "sent_name");
    await queryInterface.removeColumn("chatinternal", "sent_name");
  }
};
