import { Sequelize } from "sequelize";
import "dotenv/config";

const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: "postgres",
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
      logging: false,
    })
  : new Sequelize({
      username: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "", // Ajout de la sécurité ici
      database: process.env.DB_NAME || "postgres",
      host: process.env.DB_HOST || "localhost", // Et ici
      port: Number(process.env.DB_PORT || 5432),
      dialect: "postgres",
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
      logging: false,
    });

export default sequelize;
