FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

# On force l'installation des modules manquants, y compris bcryptjs et ses types TypeScript
RUN npm install ws swagger-jsdoc swagger-ui-express cookie-parser bcryptjs
RUN npm install --save-dev @types/ws @types/swagger-jsdoc @types/swagger-ui-express @types/cookie-parser @types/bcryptjs

RUN npm install

COPY . .

RUN npm run build

EXPOSE 5000
CMD ["node", "dist/server.js"]