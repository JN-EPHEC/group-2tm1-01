// Dans src/config/swagger.ts
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Kiné",
      version: "1.0.0",
      description:
        "Documentation API du projet kiné",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },

  apis: ["./src/routes/*.ts"],
};

const swaggerSpec =
  swaggerJsdoc(options);

export {
  swaggerUi,
  swaggerSpec,
};