import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import usersModel from "../models/Users.js";
import recoveryCodeModel from "../models/RecoveryCode.js";
import { sendMail, buildCodeEmail } from "../utils/mailer.js";

const CODE_TTL_MS = 10 * 60 * 1000;

const sendVerificationCode = async (user) => {
  const code = Math.floor(1000 + Math.random() * 9000).toString();

  await recoveryCodeModel.deleteMany({ userId: user._id });

  await recoveryCodeModel.create({
    userId: user._id,
    code,
    expiresAt: new Date(Date.now() + CODE_TTL_MS),
  });

  await sendMail({
    to: user.email,
    subject: "Confirma tu cuenta - Goosebumps Records",
    html: buildCodeEmail("Tu código para confirmar la cuenta es:", code),
  });
};

const customersController = {};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const buildToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

const publicUser = (user) => ({
  id: user._id,
  fullName: user.fullName,
  email: user.email,
  role: user.role,
  phone: user.phone,
  imageURL: user.imageURL,
  status: user.status,
});

// Registro de cliente (parte pública)
customersController.register = async (req, res) => {
  try {
    let { fullName, email, password, phone } = req.body;

    fullName = fullName?.trim();
    email = email?.trim().toLowerCase();
    phone = phone?.trim() || "";

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Nombre, correo y contraseña son obligatorios",
      });
    }

    if (fullName.length < 3) {
      return res.status(400).json({
        success: false,
        message: "El nombre debe tener al menos 3 caracteres",
      });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Correo inválido",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "La contraseña debe tener al menos 6 caracteres",
      });
    }

    const userFound = await usersModel.findOne({ email });

    if (userFound) {
      return res.status(400).json({
        success: false,
        message: "El correo ya está registrado",
      });
    }

    const passwordHash = await bcryptjs.hash(password, 10);

    const newUser = new usersModel({
      fullName,
      email,
      password: passwordHash,
      role: "customer",
      phone,
      status: "active",
    });

    await newUser.save();

    // La sesión se entrega hasta que el correo sea confirmado
    await sendVerificationCode(newUser);

    return res.status(201).json({
      success: true,
      message: "Cuenta creada. Revisa tu correo para confirmarla.",
      needsVerification: true,
      email: newUser.email,
    });
  } catch (error) {
    console.log("Error al registrar cliente:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

// Login de cliente (parte pública)
customersController.login = async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email?.trim().toLowerCase();

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Correo y contraseña son obligatorios",
      });
    }

    const user = await usersModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No existe una cuenta con este correo",
      });
    }

    if (user.role !== "customer") {
      return res.status(403).json({
        success: false,
        message: "Esta cuenta no es de cliente",
      });
    }

    if (user.status === "inactive") {
      return res.status(403).json({
        success: false,
        message: "Tu cuenta está inactiva",
      });
    }

    // Solo bloquea cuentas explícitamente sin confirmar; las creadas
    // antes de existir el campo "verified" siguen funcionando
    if (user.verified === false) {
      return res.status(403).json({
        success: false,
        needsVerification: true,
        email: user.email,
        message: "Debes confirmar tu cuenta. Revisa tu correo.",
      });
    }

    const isMatch = await bcryptjs.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Contraseña incorrecta",
      });
    }

    const token = buildToken(user);

    return res.status(200).json({
      success: true,
      message: "Inicio de sesión exitoso",
      token,
      user: publicUser(user),
    });
  } catch (error) {
    console.log("Error al iniciar sesión de cliente:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

// Confirmación de cuenta con el código enviado por correo
customersController.verifyAccount = async (req, res) => {
  try {
    let { email, code } = req.body;

    email = email?.trim().toLowerCase();
    code = code?.trim();

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: "Correo y código son obligatorios",
      });
    }

    const user = await usersModel.findOne({ email, role: "customer" });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No existe una cuenta con este correo",
      });
    }

    if (user.verified) {
      return res.status(400).json({
        success: false,
        message: "La cuenta ya está confirmada",
      });
    }

    const codeFound = await recoveryCodeModel.findOne({
      userId: user._id,
      code,
    });

    if (!codeFound) {
      return res.status(400).json({
        success: false,
        message: "Código incorrecto",
      });
    }

    if (codeFound.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "El código expiró. Solicita uno nuevo.",
      });
    }

    user.verified = true;
    await user.save();
    await recoveryCodeModel.deleteMany({ userId: user._id });

    const token = buildToken(user);

    return res.status(200).json({
      success: true,
      message: "Cuenta confirmada correctamente",
      token,
      user: publicUser(user),
    });
  } catch (error) {
    console.log("Error al confirmar cuenta:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

// Reenvío del código de confirmación
customersController.resendVerificationCode = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "El correo es obligatorio",
      });
    }

    const user = await usersModel.findOne({ email, role: "customer" });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No existe una cuenta con este correo",
      });
    }

    if (user.verified) {
      return res.status(400).json({
        success: false,
        message: "La cuenta ya está confirmada",
      });
    }

    await sendVerificationCode(user);

    return res.status(200).json({
      success: true,
      message: "Código reenviado. Revisa tu correo.",
    });
  } catch (error) {
    console.log("Error al reenviar código:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

export default customersController;
