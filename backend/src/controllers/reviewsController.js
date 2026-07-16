import { isValidObjectId } from "mongoose";
import reviewsModel from "../models/Reviews.js";
import ordersModel from "../models/Orders.js";
import usersModel from "../models/Users.js";
import vinylsModel from "../models/Vinyls.js";

const reviewsController = {};

reviewsController.getReviewsByVinyl = async (req, res) => {
  try {
    const { vinylId } = req.params;

    if (!isValidObjectId(vinylId)) {
      return res.status(400).json({
        message: "ID de vinilo inválido",
      });
    }

    const reviews = await reviewsModel
      .find({ vinylId })
      .populate("userId", "fullName imageURL")
      .sort({ createdAt: -1 });

    const average =
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        : 0;

    return res.status(200).json({
      reviews,
      average: Number(average.toFixed(1)),
      total: reviews.length,
    });
  } catch (error) {
    console.log("Error al obtener reseñas:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

reviewsController.upsertReview = async (req, res) => {
  try {
    let { vinylId, userId, rating, comment } = req.body;

    comment = comment?.trim() || "";
    rating = Number(rating);

    if (!vinylId || !userId || !req.body.rating) {
      return res.status(400).json({
        message: "Vinilo, usuario y calificación son obligatorios",
      });
    }

    if (!isValidObjectId(vinylId) || !isValidObjectId(userId)) {
      return res.status(400).json({
        message: "ID inválido",
      });
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "La calificación debe ser un entero entre 1 y 5",
      });
    }

    if (comment.length > 500) {
      return res.status(400).json({
        message: "El comentario no puede superar los 500 caracteres",
      });
    }

    const userFound = await usersModel.findById(userId);

    if (!userFound) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    const vinylFound = await vinylsModel.findById(vinylId);

    if (!vinylFound) {
      return res.status(404).json({
        message: "Vinilo no encontrado",
      });
    }

    // Solo puede reseñar quien compró el vinilo (orden no cancelada)
    const purchase = await ordersModel.findOne({
      userId,
      status: { $ne: "cancelled" },
      "products.vinylId": vinylId,
    });

    if (!purchase) {
      return res.status(403).json({
        message: "Solo puedes valorar vinilos que hayas comprado",
      });
    }

    const review = await reviewsModel
      .findOneAndUpdate(
        { vinylId, userId },
        { rating, comment },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      )
      .populate("userId", "fullName imageURL");

    return res.status(200).json({
      message: "Reseña guardada correctamente",
      review,
    });
  } catch (error) {
    console.log("Error al guardar reseña:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export default reviewsController;
