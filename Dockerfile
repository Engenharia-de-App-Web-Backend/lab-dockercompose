# Imagem base oficial do Node.js (versão LTS baseada em Alpine para ser leve)
FROM node:24-alpine

# 2. Define o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# 3. Copia apenas os arquivos de definição de dependências
COPY app/package*.json ./

# 4. Instala as dependências do projeto
RUN npm install --only=production

# 5. Copia o restante do código da aplicação para o container
COPY app/ .

# 6. Expõe a porta que a aplicação irá usar
EXPOSE 3000

# 7. Define o comando para iniciar a aplicação
CMD ["npm", "start"]
