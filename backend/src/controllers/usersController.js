import bcryptjs from "bcryptjs";
import { isValidObjectId } from "mongoose";
import usersModel from "../models/Users.js";
import { cloudinary } from "../utils/cloudinaryConfig.js";

const usersController = {};

const deleteUploadedImage = async (file) => {
  if (file?.filename) {
    await cloudinary.uploader.destroy(file.filename);
  }
};

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
    let { fullName, email, password, role, phone, status } = req.body;

    fullName = fullName?.trim();
    email = email?.trim().toLowerCase();
    phone = phone?.trim();
    role = role?.trim().toLowerCase();
    status = status?.trim().toLowerCase();

    if (!fullName || !email || !password || !phone) {
      await deleteUploadedImage(req.file);

      return res.status(400).json({
        message: "Todos los campos obligatorios deben llenarse",
      });
    }

    if (fullName.length < 3) {
      await deleteUploadedImage(req.file);

      return res.status(400).json({
        message: "El nombre debe tener al menos 3 caracteres",
      });
    }

    if (password.length < 6) {
      await deleteUploadedImage(req.file);

      return res.status(400).json({
        message: "La contraseña debe tener al menos 6 caracteres",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      await deleteUploadedImage(req.file);

      return res.status(400).json({
        message: "Correo inválido",
      });
    }

    if (role && !["admin", "customer"].includes(role)) {
      await deleteUploadedImage(req.file);

      return res.status(400).json({
        message: "Rol inválido",
      });
    }

    if (status && !["active", "inactive"].includes(status)) {
      await deleteUploadedImage(req.file);

      return res.status(400).json({
        message: "Estado inválido",
      });
    }

    const userFound = await usersModel.findOne({ email });

    if (userFound) {
      await deleteUploadedImage(req.file);

      return res.status(400).json({
        message: "El correo ya está registrado",
      });
    }

    const passwordHash = await bcryptjs.hash(password, 10);

    const newUser = new usersModel({
      fullName,
      email,
      password: passwordHash,
      role: role || "customer",
      phone,
      imageURL: req.file?.path || "",
      public_id: req.file?.filename || "",
      status: status || "active",
    });

    await newUser.save();

    const userResponse = newUser.toObject();
    delete userResponse.password;

    return res.status(201).json({
      message: "Usuario creado correctamente",
      user: userResponse,
    });
  } catch (error) {
    await deleteUploadedImage(req.file);

    console.log("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

usersController.updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      await deleteUploadedImage(req.file);

      return res.status(400).json({ message: "ID inválido" });
    }

    const userFoundById = await usersModel.findById(id);

    if (!userFoundById) {
      await deleteUploadedImage(req.file);

      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    let { fullName, email, password, role, phone, status } = req.body;

    const dataToUpdate = {};

    if (fullName !== undefined) {
      fullName = fullName.trim();

      if (fullName.length < 3) {
        await deleteUploadedImage(req.file);

        return res.status(400).json({
          message: "El nombre debe tener al menos 3 caracteres",
        });
      }

      dataToUpdate.fullName = fullName;
    }

    if (email !== undefined) {
      email = email.trim().toLowerCase();

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        await deleteUploadedImage(req.file);

        return res.status(400).json({
          message: "Correo inválido",
        });
      }

      const userFound = await usersModel.findOne({
        email,
        _id: { $ne: id },
      });

      if (userFound) {
        await deleteUploadedImage(req.file);

        return res.status(400).json({
          message: "El correo ya está registrado",
        });
      }

      dataToUpdate.email = email;
    }

    if (password !== undefined && password !== "") {
      if (password.length < 6) {
        await deleteUploadedImage(req.file);

        return res.status(400).json({
          message: "La contraseña debe tener al menos 6 caracteres",
        });
      }

      dataToUpdate.password = await bcryptjs.hash(password, 10);
    }

    if (role !== undefined) {
      role = role.trim().toLowerCase();

      if (!["admin", "customer"].includes(role)) {
        await deleteUploadedImage(req.file);

        return res.status(400).json({
          message: "Rol inválido",
        });
      }

      dataToUpdate.role = role;
    }

    if (phone !== undefined) {
      phone = phone.trim();

      if (!phone) {
        await deleteUploadedImage(req.file);

        return res.status(400).json({
          message: "El teléfono no puede estar vacío",
        });
      }

      dataToUpdate.phone = phone;
    }

    if (status !== undefined) {
      status = status.trim().toLowerCase();

      if (!["active", "inactive"].includes(status)) {
        await deleteUploadedImage(req.file);

        return res.status(400).json({
          message: "Estado inválido",
        });
      }

      dataToUpdate.status = status;
    }

    if (req.file) {
      if (userFoundById.public_id) {
        await cloudinary.uploader.destroy(userFoundById.public_id);
      }

      dataToUpdate.imageURL = req.file.path;
      dataToUpdate.public_id = req.file.filename;
    }

    const userUpdated = await usersModel
      .findByIdAndUpdate(id, dataToUpdate, { new: true })
      .select("-password");

    return res.status(200).json({
      message: "Usuario actualizado correctamente",
      user: userUpdated,
    });
  } catch (error) {
    await deleteUploadedImage(req.file);

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

    const userFound = await usersModel.findById(id);

    if (!userFound) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    if (userFound.public_id) {
      await cloudinary.uploader.destroy(userFound.public_id);
    }

    await usersModel.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Usuario eliminado correctamente",
    });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default usersController;