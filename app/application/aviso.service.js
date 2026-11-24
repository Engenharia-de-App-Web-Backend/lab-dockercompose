const FileProvider = require("../infrastructure/file-system/file.provider");

class AvisoService {
  constructor() {
    // O caminho aponta para onde o volume será montado DENTRO do container
    this.filePath = "dados/aviso.txt";
  }

  getAvisoMessage() {
    try {
      const content = FileProvider.readTextFile(this.filePath);

      if (content) {
        return content;
      } else {
        return "O arquivo aviso.txt não foi montado no container.";
      }
    } catch (error) {
      console.error("[File Read Error]:", error.message);
      return "Erro ao tentar ler o arquivo.";
    }
  }
}

module.exports = AvisoService;
