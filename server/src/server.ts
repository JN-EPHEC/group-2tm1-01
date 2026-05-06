import "dotenv/config";
import express from "express";
import { supabase } from "./config/supabase";

const app = express();
console.log("ENV URL:", process.env.SUPABASE_URL);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

app.get("/", (req, res) => {
  res.send("🚀 API kiné en ligne !");
});

app.get("/test-db", async (req, res) => {
  const { data, error } = await supabase.from("products").select("*");

  if (error) {
    return res.status(500).json(error);
  }

  res.json(data);
  console.log(error, data);
});
