import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import Admin from "../src/models/Admin.js";

dotenv.config();

const [fullName, email, password] = process.argv.slice(2);

if (!fullName || !email || !password) {
  console.log('Uso: node scripts/createAdmin.js "Nombre Completo" correo@ejemplo.com contrasena');
  process.exit(1);
}

if (password.length < 6) {
  console.log("La contraseña debe tener al menos 6 caracteres");
  process.exit(1);
}

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
  });

  const normalizedEmail = email.trim().toLowerCase();
  const existing = await Admin.findOne({ email: normalizedEmail });

  if (existing) {
    console.log(`Ya existe un admin con el correo ${normalizedEmail}`);
    await mongoose.disconnect();
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await Admin.create({
    fullName: fullName.trim(),
    email: normalizedEmail,
    password: passwordHash,
    adminUrl: "",
  });

  console.log(`Admin creado: ${normalizedEmail}`);
  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.log("Error al crear el admin:", error.message);
  await mongoose.disconnect();
  process.exit(1);
});
