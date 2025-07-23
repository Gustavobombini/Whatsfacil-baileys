// scripts/createMigration.js
const fs = require("fs");
const path = require("path");

const name = process.argv[2];

if (!name) {
  console.error("❌ Nome da migration é obrigatório.");
  process.exit(1);
}

const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, "").slice(0, 14);
const fileName = `${timestamp}-${name}.ts`;
const filePath = path.join(__dirname, "src", "database", "migrations", fileName);

const content = `import { QueryInterface, DataTypes } from "sequelize";

export default {
  async up(queryInterface: QueryInterface) {
    // TODO: implemente a migration
  },

  async down(queryInterface: QueryInterface) {
    // TODO: reverta a migration
  }
};
`;

fs.writeFileSync(filePath, content);
console.log("✅ Migration criada em:", filePath);
