import bcryptjs from "bcryptjs";
import { isValidObjectId } from "mongoose";
import usersModel from "../models/Users.js";

const usersController = {};

usersController.getUsers = async (req, res) => {
  try {
    const users = await usersModel.find().select("-password");

    return res.status(200).json(users);
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

usersController.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const user = await usersModel.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

usersController.insertUser = async (req, res) => {
  try {
    let {
      fullName,
      email,
      password,
      role,
      phone,
      imageURL,
      status
    } = req.body;

    fullName = fullName?.trim();
    email = email?.trim().toLowerCase();
    phone = phone?.trim();
    imageURL = imageURL?.trim();

    if (!fullName || !email || !password || !phone) {
      return res.status(400).json({
        message: "Todos los campos obligatorios deben llenarse"
      });
    }

    if (fullName.length < 3) {
      return res.status(400).json({
        message: "El nombre debe tener al menos 3 caracteres"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "La contraseña debe tener al menos 6 caracteres"
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Correo inválido"
      });
    }

    if (role && !["admin", "customer"].includes(role)) {
      return res.status(400).json({
        message: "Rol inválido"
      });
    }

    if (status && !["active", "inactive"].includes(status)) {
      return res.status(400).json({
        message: "Estado inválido"
      });
    }

    const userFound = await usersModel.findOne({ email });

    if (userFound) {
      return res.status(400).json({
        message: "El correo ya está registrado"
      });
    }

    const passwordHash = await bcryptjs.hash(password, 10);

    const newUser = new usersModel({
      fullName,
      email,
      password: passwordHash,
      role,
      phone,
      imageURL,
      status
    });

    await newUser.save();

    return res.status(201).json({
      message: "Usuario creado correctamente"
    });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

usersController.updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    let {
      fullName,
      email,
      password,
      role,
      phone,
      imageURL,
      status
    } = req.body;

    const dataToUpdate = {};

    if (fullName !== undefined) {
      fullName = fullName.trim();

      if (fullName.length < 3) {
        return res.status(400).json({
          message: "El nombre debe tener al menos 3 caracteres"
        });
      }

      dataToUpdate.fullName = fullName;
    }

    if (email !== undefined) {
      email = email.trim().toLowerCase();

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        return res.status(400).json({
          message: "Correo inválido"
        });
      }

      const userFound = await usersModel.findOne({
        email,
        _id: { $ne: id }
      });

      if (userFound) {
        return res.status(400).json({
          message: "El correo ya está registrado"
        });
      }

      dataToUpdate.email = email;
    }

    if (password !== undefined && password !== "") {
      if (password.length < 6) {
        return res.status(400).json({
          message: "La contraseña debe tener al menos 6 caracteres"
        });
      }

      dataToUpdate.password = await bcryptjs.hash(password, 10);
    }

    if (role !== undefined) {
      if (!["admin", "customer"].includes(role)) {
        return res.status(400).json({
          message: "Rol inválido"
        });
      }

      dataToUpdate.role = role;
    }

    if (phone !== undefined) {
      phone = phone.trim();

      if (!phone) {
        return res.status(400).json({
          message: "El teléfono no puede estar vacío"
        });
      }

      dataToUpdate.phone = phone;
    }

    if (imageURL !== undefined) {
      dataToUpdate.imageURL = imageURL.trim();
    }

    if (status !== undefined) {
      if (!["active", "inactive"].includes(status)) {
        return res.status(400).json({
          message: "Estado inválido"
        });
      }

      dataToUpdate.status = status;
    }

    const userUpdated = await usersModel
      .findByIdAndUpdate(id, dataToUpdate, { new: true })
      .select("-password");

    if (!userUpdated) {
      return res.status(404).json({
        message: "Usuario no encontrado"
      });
    }

    return res.status(200).json({
      message: "Usuario actualizado correctamente",
      user: userUpdated
    });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

usersController.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const userDeleted = await usersModel.findByIdAndDelete(id);

    if (!userDeleted) {
      return res.status(404).json({
        message: "Usuario no encontrado"
      });
    }

    return res.status(200).json({
      message: "Usuario eliminado correctamente"
    });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default usersController;