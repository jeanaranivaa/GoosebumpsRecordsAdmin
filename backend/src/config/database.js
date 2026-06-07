import dns from "dns";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

dns.setServers(["8.8.8.8", "1.1.1.1"]);

mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000
  })
  .then(() => {
    console.log("Base de datos conectada correctamente");
  })
  .catch((error) => {
    console.log("Error al conectar MongoDB:", error.message);
  });

mongoose.connection.on("disconnected", () => {
  console.log("Base de datos desconectada");
});

mongoose.connection.on("error", (error) => {
  console.log("Error en MongoDB:", error.message);
});