import { isValidObjectId } from "mongoose";
import vinylsModel from "../models/Vinyls.js";
import { cloudinary } from "../utils/cloudinaryVinylsConfig.js";

const vinylsController = {};

const deleteUploadedImage = async (file) => {
  if (file?.filename) {
    await cloudinary.uploader.destroy(file.filename);
  }
};

const validateStatus = (status) => {
  return ["Disponible", "Agotado"].includes(status);
};

vinylsController.getVinyls = async (req, res) => {
  try {
    const vinyls = await vinylsModel.find().sort({ createdAt: -1 });

    return res.status(200).json(vinyls);
  } catch (error) {
    console.log("Error al obtener vinilos:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

vinylsController.getVinylById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: "ID inválido",
      });
    }

    const vinyl = await vinylsModel.findById(id);

    if (!vinyl) {
      return res.status(404).json({
        message: "Vinilo no encontrado",
      });
    }

    return res.status(200).json(vinyl);
  } catch (error) {
    console.log("Error al obtener vinilo:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

vinylsController.insertVinyl = async (req, res) => {
  try {
    let { title, artist, genre, price, stock, description, status } = req.body;

    title = title?.trim();
    artist = artist?.trim();
    genre = genre?.trim();
    description = description?.trim();
    status = status?.trim();

    price = Number(price);
    stock = Number(stock);

    if (!title || !artist || !genre || !description) {
      await deleteUploadedImage(req.file);

      return res.status(400).json({
        message: "Todos los campos obligatorios deben llenarse",
      });
    }

    if (title.length < 2 || title.length > 80) {
      await deleteUploadedImage(req.file);

      return res.status(400).json({
        message: "El título debe tener entre 2 y 80 caracteres",
      });
    }

    if (artist.length < 2 || artist.length > 80) {
      await deleteUploadedImage(req.file);

      return res.status(400).json({
        message: "El artista debe tener entre 2 y 80 caracteres",
      });
    }

    if (genre.length < 2 || genre.length > 40) {
      await deleteUploadedImage(req.file);

      return res.status(400).json({
        message: "El género debe tener entre 2 y 40 caracteres",
      });
    }

    if (description.length < 5 || description.length > 500) {
      await deleteUploadedImage(req.file);

      return res.status(400).json({
        message: "La descripción debe tener entre 5 y 500 caracteres",
      });
    }

    if (Number.isNaN(price) || price < 0) {
      await deleteUploadedImage(req.file);

      return res.status(400).json({
        message: "El precio debe ser un número válido mayor o igual a 0",
      });
    }

    if (!Number.isInteger(stock) || stock < 0) {
      await deleteUploadedImage(req.file);

      return res.status(400).json({
        message: "El stock debe ser un número entero mayor o igual a 0",
      });
    }

    if (status && !validateStatus(status)) {
      await deleteUploadedImage(req.file);

      return res.status(400).json({
        message: "Estado inválido",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "La imagen del vinilo es obligatoria",
      });
    }

    const newVinyl = new vinylsModel({
      title,
      artist,
      genre,
      price,
      stock,
      description,
      coverUrl: req.file.path,
      public_id: req.file.filename,
      status: status || "Disponible",
    });

    await newVinyl.save();

    return res.status(201).json({
      message: "Vinilo creado correctamente",
      vinyl: newVinyl,
    });
  } catch (error) {
    await deleteUploadedImage(req.file);

    console.log("Error al crear vinilo:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: Object.values(error.errors)[0].message,
      });
    }

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

vinylsController.updateVinyl = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      await deleteUploadedImage(req.file);

      return res.status(400).json({
        message: "ID inválido",
      });
    }

    const vinylFound = await vinylsModel.findById(id);

    if (!vinylFound) {
      await deleteUploadedImage(req.file);

      return res.status(404).json({
        message: "Vinilo no encontrado",
      });
    }

    let { title, artist, genre, price, stock, description, status } = req.body;

    const dataToUpdate = {};

    if (title !== undefined) {
      title = title.trim();

      if (title.length < 2 || title.length > 80) {
        await deleteUploadedImage(req.file);

        return res.status(400).json({
          message: "El título debe tener entre 2 y 80 caracteres",
        });
      }

      dataToUpdate.title = title;
    }

    if (artist !== undefined) {
      artist = artist.trim();

      if (artist.length < 2 || artist.length > 80) {
        await deleteUploadedImage(req.file);

        return res.status(400).json({
          message: "El artista debe tener entre 2 y 80 caracteres",
        });
      }

      dataToUpdate.artist = artist;
    }

    if (genre !== undefined) {
      genre = genre.trim();

      if (genre.length < 2 || genre.length > 40) {
        await deleteUploadedImage(req.file);

        return res.status(400).json({
          message: "El género debe tener entre 2 y 40 caracteres",
        });
      }

      dataToUpdate.genre = genre;
    }

    if (description !== undefined) {
      description = description.trim();

      if (description.length < 5 || description.length > 500) {
        await deleteUploadedImage(req.file);

        return res.status(400).json({
          message: "La descripción debe tener entre 5 y 500 caracteres",
        });
      }

      dataToUpdate.description = description;
    }

    if (price !== undefined) {
      price = Number(price);

      if (Number.isNaN(price) || price < 0) {
        await deleteUploadedImage(req.file);

        return res.status(400).json({
          message: "El precio debe ser un número válido mayor o igual a 0",
        });
      }

      dataToUpdate.price = price;
    }

    if (stock !== undefined) {
      stock = Number(stock);

      if (!Number.isInteger(stock) || stock < 0) {
        await deleteUploadedImage(req.file);

        return res.status(400).json({
          message: "El stock debe ser un número entero mayor o igual a 0",
        });
      }

      dataToUpdate.stock = stock;
    }

    if (status !== undefined) {
      status = status.trim();

      if (!validateStatus(status)) {
        await deleteUploadedImage(req.file);

        return res.status(400).json({
          message: "Estado inválido",
        });
      }

      dataToUpdate.status = status;
    }

    if (req.file) {
      if (vinylFound.public_id) {
        await cloudinary.uploader.destroy(vinylFound.public_id);
      }

      dataToUpdate.coverUrl = req.file.path;
      dataToUpdate.public_id = req.file.filename;
    }

    const vinylUpdated = await vinylsModel.findByIdAndUpdate(
      id,
      dataToUpdate,
      { new: true }
    );

    return res.status(200).json({
      message: "Vinilo actualizado correctamente",
      vinyl: vinylUpdated,
    });
  } catch (error) {
    await deleteUploadedImage(req.file);

    console.log("Error al actualizar vinilo:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: Object.values(error.errors)[0].message,
      });
    }

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

vinylsController.deleteVinyl = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: "ID inválido",
      });
    }

    const vinylFound = await vinylsModel.findById(id);

    if (!vinylFound) {
      return res.status(404).json({
        message: "Vinilo no encontrado",
      });
    }

    if (vinylFound.public_id) {
      await cloudinary.uploader.destroy(vinylFound.public_id);
    }

    await vinylsModel.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Vinilo eliminado correctamente",
    });
  } catch (error) {
    console.log("Error al eliminar vinilo:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export default vinylsController;