import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.addColumn("Chatbots", "isQuestion", {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    });
    
  },

  down: (queryInterface: QueryInterface) => {
    return queryInterface.removeColumn("Chatbots", "idQuestion");
  }
};
