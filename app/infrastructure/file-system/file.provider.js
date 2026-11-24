const fs = require("fs");

class FileProvider {
  /**
   * Tenta ler um arquivo de texto.
   * Retorna o conteúdo se existir, ou null se não for encontrado.
   */
  static readTextFile(filePath) {
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, "utf8");
    }
    return null; // O arquivo não existe
  }
}

module.exports = FileProvider;
