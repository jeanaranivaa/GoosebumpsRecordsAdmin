import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Base de datos conectada correctamente");
  })
  .catch((error) => {
    console.log("Error al conectar MongoDB:", error.message);
  });