const AvisoService = require("../../application/aviso.service");

const avisoService = new AvisoService();

function lerAvisoHandler(req, res) {
  // Delega a responsabilidade para o Service
  const message = avisoService.getAvisoMessage();

  // Devolve a estrutura HTTP esperada
  return res.status(200).json({
    status: "Online",
    message: message,
  });
}

module.exports = { lerAvisoHandler };