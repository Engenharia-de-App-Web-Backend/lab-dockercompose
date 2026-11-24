require("dotenv").config();

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;


// Importando o controller de acesso
// TODO 
// const { handleAccessRequest } = require("./interfaces/controllers/access.controller");

// Importando o controller de status
const { getStatus } = require('./interfaces/controllers/status.controller');

// Importando o controller de aviso
const { lerAvisoHandler } = require("./interfaces/controllers/aviso.controller"); 


// Rota de Acesso (Log e Contagem)
// TODO
// app.get('/api/access', handleAccessRequest);

// Rota de Health Check (Verificação de Status)
app.get('/api/status', getStatus);

// Nova rota utilizando Clean Architecture
app.get('/aviso', lerAvisoHandler);


// Rota de Health Check (Contagem de Requisições) em tempo real
let requestCount = 0;
app.get("/", (req, res) => {
  requestCount++;
  res.json({
    status: "Online",
    message: "API executando com sucesso!",
    database_env: process.env.DB_HOST || "Não configurado no SO",
    requisicoes: requestCount,
  });
});


app.listen(PORT, () => 
    console.log(`🚀 Servidor na porta ${PORT}`),
    console.log(`🚀 Variável de ambiente DB_HOST: ${process.env.DB_HOST || "Não configurado no SO"}`),
    console.log(`🚀 Variável de ambiente DB_PORT: ${process.env.DB_PORT || "Não configurado no SO"}`),
    console.log(`Rota de Health Check: http://localhost:${PORT}/api/status`),
    console.log(`Rota de Aviso: http://localhost:${PORT}/aviso`),
    console.log(`Rota de Acesso: http://localhost:${PORT}/api/access`),
);
