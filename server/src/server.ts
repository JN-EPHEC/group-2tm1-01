import "dotenv/config";
import express from "express";
import { supabase } from "./config/supabase";
import productRoutes from "./routes/product.routes";
import transactionRoutes from "./routes/transaction.routes";
import appointmentRoutes from "./routes/appointment.routes";
import orderRoutes from "./routes/order.routes";
import cors from "cors";
import { swaggerUi, swaggerSpec, } from "./config/swagger";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";

const app = express();
console.log("ENV URL:", process.env.SUPABASE_URL);
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

console.log("SWAGGER MOUNTED");
app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/products", productRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/orders", orderRoutes);

app.use("/api/auth", authRoutes);

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
