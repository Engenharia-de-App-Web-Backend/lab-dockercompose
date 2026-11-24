const { Client } = require("pg");

function createDatabaseClient() {
  return new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });
}

module.exports = { createDatabaseClient };