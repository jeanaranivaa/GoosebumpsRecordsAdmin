import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import usersRoutes from "./routes/users.js";
import vinylsRoutes from "./routes/vinyls.js";
import ordersRoutes from "./routes/orders.js";
import paymentsRoutes from "./routes/payments.js";
import adminRoutes from "./routes/admin.js";
import recoveryRoutes from "./routes/recovery.js";
import customersRoutes from "./routes/customers.js";
import customerRecoveryRoutes from "./routes/customerRecovery.js";
import reviewsRoutes from "./routes/reviews.js";

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
];

app.use(
  cors({
    origin: allowedOrigins,
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
app.use("/api/admin", adminRoutes);
app.use("/api/recovery", recoveryRoutes);
app.use("/api/customers", customersRoutes);
app.use("/api/customer-recovery", customerRecoveryRoutes);
app.use("/api/reviews", reviewsRoutes);

export default app;