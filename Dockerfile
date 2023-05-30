# Usa a imagem base oficial do Node.js
FROM node:16

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia os arquivos do projeto para o diretório de trabalho
COPY .env package.json package-lock.json /app/

# Instala as dependências do projeto
RUN npm install

# Copia o restante dos arquivos do projeto para o diretório de trabalho
COPY . /app

# Expõe a porta que a aplicação Node.js utiliza
EXPOSE 3000

# Define o comando padrão para iniciar a aplicação
CMD ["npm", "start"]