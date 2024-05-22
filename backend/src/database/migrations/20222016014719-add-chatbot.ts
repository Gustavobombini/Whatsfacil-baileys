import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.addColumn("Chatbots", "id_chatbot", {
      type: DataTypes.TEXT,
      defaultValue: null
    });
    
  },

  down: (queryInterface: QueryInterface) => {
    return queryInterface.removeColumn("Chatbots", "id_chatbot");
  }
};
