const StatusService = require("../../application/status.service");
const {
  createDatabaseClient,
} = require("../../infrastructure/database/pg.config");

const statusService = new StatusService(createDatabaseClient);

async function getStatus(req, res) {
  try {
    const dbHealth = await statusService.checkDatabaseHealth();

    return res.status(200).json({
      api: "online",
      database: "online",
      message: `Conectado com sucesso! Hora no DB: ${dbHealth.currentTime}`,
    });
  } catch (error) {
    return res.status(500).json({
      api: "online",
      database: "offline",
      error: error.message,
    });
  }
}

module.exports = { getStatus };
