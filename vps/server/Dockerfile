FROM node:20-alpine
WORKDIR /app

# Les fichiers sont cherchés localement car le contexte Docker est déjà le dossier server
COPY package*.json ./
COPY tsconfig*.json ./

# Installation des dépendances
RUN npm install ws swagger-jsdoc swagger-ui-express cookie-parser argon2
RUN npm install --save-dev @types/ws @types/swagger-jsdoc @types/swagger-ui-express @types/cookie-parser
RUN npm install

# Copie du reste du code source
COPY . .

RUN npm run build

EXPOSE 5000
CMD ["node", "dist/server.js"]