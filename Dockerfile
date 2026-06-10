# Usa uma imagem oficial leve do Node.js (versão 20)
FROM node:20-alpine

# Instala o wait-for-it para aguardar o MySQL
RUN apk add --no-cache bash curl

# Cria a pasta onde o projeto vai rodar dentro do container
WORKDIR /usr/src/app

# Copia os arquivos de dependências primeiro (deixa o build mais rápido)
COPY package*.json ./

# Instala apenas as dependências necessárias para rodar o projeto
RUN npm ci --only=production

# Copia todo o resto dos arquivos do seu projeto para dentro do container
COPY . .

# Informa que o container vai rodar na porta 3000
EXPOSE 3000

# Aguarda o MySQL estar disponível antes de subir o servidor
CMD sh -c "until curl -s http://quadras-db:3306 > /dev/null 2>&1 || nc -z quadras-db 3306 2>/dev/null; do echo 'Aguardando MySQL...'; sleep 2; done; echo 'MySQL pronto!'; node server.js"
