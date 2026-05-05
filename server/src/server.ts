import express from "express";
import { supabase as sequelize } from "./config/supabase";
import Product from "./models/Product";

const app = express();
app.use(express.json());

// ROUTE DE TEST
app.get("/", (req, res) => {
  res.send("🚀 L'API du cabinet de kiné est en ligne et la DB est connectée !");
});

sequelize.sync().then(() => {
  console.log("Connexion à la base de données SQLite établie.");
  app.listen(3000, () => {
    console.log("Serveur lancé sur http://localhost:3000");
  });
});
