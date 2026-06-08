import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import usersRoutes from "./routes/users.js";
import vinylsRoutes from "./routes/vinyls.js";
import ordersRoutes from "./routes/orders.js";
import paymentsRoutes from "./routes/payments.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Backend funcionando correctamente",
  });
});

app.use("/api/users", usersRoutes);
app.use("/api/vinyls", vinylsRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/payments", paymentsRoutes);

export default app;