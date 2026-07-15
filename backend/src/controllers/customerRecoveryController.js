import usersModel from "../models/Users.js";
import RecoveryCode from "../models/RecoveryCode.js";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";

// Enviar código de recuperación al correo del cliente
export const sendRecoveryCode = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await usersModel.findOne({
      email: email?.toLowerCase(),
      role: "customer",
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No existe una cuenta con este correo",
      });
    }

    const code = Math.floor(1000 + Math.random() * 9000).toString();

    // eliminar códigos anteriores del usuario
    await RecoveryCode.deleteMany({ userId: user._id });

    await RecoveryCode.create({
      userId: user._id,
      code,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 min
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Código de recuperación",
      html: `
        <h2>Goosebumps Records</h2>
        <p>Tu código de recuperación es:</p>
        <h1>${code}</h1>
        <p>Este código expira en 10 minutos.</p>
      `,
    });

    res.status(200).json({
      success: true,
      message: "Código enviado correctamente",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Error al enviar el código",
    });
  }
};

// Verificar código
export const verifyRecoveryCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await usersModel.findOne({
      email: email?.toLowerCase(),
      role: "customer",
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Cuenta no encontrada",
      });
    }

    const recovery = await RecoveryCode.findOne({
      userId: user._id,
      code,
    });

    if (!recovery) {
      return res.status(400).json({
        success: false,
        message: "Código incorrecto",
      });
    }

    if (recovery.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Código expirado",
      });
    }

    res.status(200).json({
      success: true,
      message: "Código verificado",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Error al verificar el código",
    });
  }
};

// Cambiar contraseña
export const changePassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await usersModel.findOne({
      email: email?.toLowerCase(),
      role: "customer",
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Cuenta no encontrada",
      });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "La contraseña debe tener al menos 6 caracteres",
      });
    }

    user.password = await bcrypt.hash(password, 10);

    await user.save();

    await RecoveryCode.deleteMany({ userId: user._id });

    res.status(200).json({
      success: true,
      message: "Contraseña actualizada correctamente",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Error al cambiar la contraseña",
    });
  }
};
