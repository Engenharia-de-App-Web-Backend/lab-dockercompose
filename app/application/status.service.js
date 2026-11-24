class StatusService {
  constructor(dbClientFactory) {
    this.dbClientFactory = dbClientFactory;
  }

  async checkDatabaseHealth() {
    const client = this.dbClientFactory();

    try {
      await client.connect();
      const res = await client.query("SELECT NOW() AS current_time");
      await client.end();

      return {
        isOnline: true,
        currentTime: res.rows[0].current_time,
      };
    } catch (error) {
      console.error("[Health Check Error]:", error.message);
      throw new Error("Falha ao comunicar com o banco de dados.");
    }
  }
}

module.exports = StatusService;