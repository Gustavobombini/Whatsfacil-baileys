import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.addColumn("Chatbots", "responseQuestion", {
      type: DataTypes.TEXT,
      defaultValue: false
    });
    
  },

  down: (queryInterface: QueryInterface) => {
    return queryInterface.removeColumn("Chatbots", "responseQuestion");
  }
};
