require("../bootstrap");

module.exports = {
  define: {
    charset: "utf8mb4",
    collate: "utf8mb4_bin"
  },
  dialect: process.env.DB_DIALECT || "mysql",
  timezone: "-03:00",
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  logging: false,

  pool: {
    max: 100,            // Número máximo de conexões no pool
    min: 5,             // Número mínimo de conexões mantidas
    acquire: 60000,     // Tempo máximo (ms) para tentar obter uma conexão (30 segundos)
    idle: 10000,        // Tempo máximo (ms) que uma conexão pode ficar ociosa antes de ser liberada
    evict: 10000,       // Intervalo para checar conexões ociosas (opcional, depende da versão do Sequelize)
  },
};
