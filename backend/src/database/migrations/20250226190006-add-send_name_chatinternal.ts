import { tr } from "date-fns/locale";
import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.addColumn("GroupMessages", "sent_name", {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: ''
    });

    await queryInterface.addColumn("ChatInternal", "sent_name", {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: ''
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn("GroupMessages", "sent_name");
    await queryInterface.removeColumn("chatinternal", "sent_name");
  }
};
