import { isValidObjectId } from "mongoose";
import paymentsModel from "../models/Payments.js";
import ordersModel from "../models/Orders.js";
import usersModel from "../models/Users.js";

const paymentsController = {};

const validMethods = ["cash", "card", "transfer"];
const validStatuses = ["pending", "paid", "failed", "refunded"];

const validatePaymentMethod = (method) => {
  return validMethods.includes(method);
};

const validatePaymentStatus = (status) => {
  return validStatuses.includes(status);
};

paymentsController.getPayments = async (req, res) => {
  try {
    const payments = await paymentsModel
      .find()
      .populate("orderId", "total status shippingAddress orderDate")
      .populate("userId", "fullName phone")
      .sort({ createdAt: -1 });

    return res.status(200).json(payments);
  } catch (error) {
    console.log("Error al obtener pagos:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

paymentsController.getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: "ID inválido",
      });
    }

    const payment = await paymentsModel
      .findById(id)
      .populate("orderId", "total status shippingAddress orderDate")
      .populate("userId", "fullName phone");

    if (!payment) {
      return res.status(404).json({
        message: "Pago no encontrado",
      });
    }

    return res.status(200).json(payment);
  } catch (error) {
    console.log("Error al obtener pago:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

paymentsController.insertPayment = async (req, res) => {
  try {
    let { orderId, userId, paymentMethod, amount, status, paymentDate } =
      req.body;

    paymentMethod = paymentMethod?.trim();
    status = status?.trim();

    amount = Number(amount);

    if (!orderId || !userId || !paymentMethod || amount === undefined) {
      return res.status(400).json({
        message: "Orden, usuario, método de pago y monto son obligatorios",
      });
    }

    if (!isValidObjectId(orderId)) {
      return res.status(400).json({
        message: "ID de orden inválido",
      });
    }

    if (!isValidObjectId(userId)) {
      return res.status(400).json({
        message: "ID de usuario inválido",
      });
    }

    const orderFound = await ordersModel.findById(orderId);

    if (!orderFound) {
      return res.status(404).json({
        message: "Orden no encontrada",
      });
    }

    const userFound = await usersModel.findById(userId);

    if (!userFound) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    if (!validatePaymentMethod(paymentMethod)) {
      return res.status(400).json({
        message: "Método de pago inválido",
      });
    }

    if (Number.isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        message: "El monto debe ser un número mayor a 0",
      });
    }

    if (status && !validatePaymentStatus(status)) {
      return res.status(400).json({
        message: "Estado de pago inválido",
      });
    }

    const newPayment = new paymentsModel({
      orderId,
      userId,
      paymentMethod,
      amount,
      status: status || "pending",
      paymentDate: paymentDate || Date.now(),
    });

    await newPayment.save();

    return res.status(201).json({
      message: "Pago creado correctamente",
      payment: newPayment,
    });
  } catch (error) {
    console.log("Error al crear pago:", error);

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

paymentsController.updatePayment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: "ID inválido",
      });
    }

    const paymentFound = await paymentsModel.findById(id);

    if (!paymentFound) {
      return res.status(404).json({
        message: "Pago no encontrado",
      });
    }

    let { orderId, userId, paymentMethod, amount, status, paymentDate } =
      req.body;

    const dataToUpdate = {};

    if (orderId !== undefined) {
      if (!isValidObjectId(orderId)) {
        return res.status(400).json({
          message: "ID de orden inválido",
        });
      }

      const orderFound = await ordersModel.findById(orderId);

      if (!orderFound) {
        return res.status(404).json({
          message: "Orden no encontrada",
        });
      }

      dataToUpdate.orderId = orderId;
    }

    if (userId !== undefined) {
      if (!isValidObjectId(userId)) {
        return res.status(400).json({
          message: "ID de usuario inválido",
        });
      }

      const userFound = await usersModel.findById(userId);

      if (!userFound) {
        return res.status(404).json({
          message: "Usuario no encontrado",
        });
      }

      dataToUpdate.userId = userId;
    }

    if (paymentMethod !== undefined) {
      paymentMethod = paymentMethod.trim();

      if (!validatePaymentMethod(paymentMethod)) {
        return res.status(400).json({
          message: "Método de pago inválido",
        });
      }

      dataToUpdate.paymentMethod = paymentMethod;
    }

    if (amount !== undefined) {
      amount = Number(amount);

      if (Number.isNaN(amount) || amount <= 0) {
        return res.status(400).json({
          message: "El monto debe ser un número mayor a 0",
        });
      }

      dataToUpdate.amount = amount;
    }

    if (status !== undefined) {
      status = status.trim();

      if (!validatePaymentStatus(status)) {
        return res.status(400).json({
          message: "Estado de pago inválido",
        });
      }

      dataToUpdate.status = status;
    }

    if (paymentDate !== undefined) {
      dataToUpdate.paymentDate = paymentDate;
    }

    const paymentUpdated = await paymentsModel
      .findByIdAndUpdate(id, dataToUpdate, { new: true })
      .populate("orderId", "total status shippingAddress orderDate")
      .populate("userId", "fullName phone");

    return res.status(200).json({
      message: "Pago actualizado correctamente",
      payment: paymentUpdated,
    });
  } catch (error) {
    console.log("Error al actualizar pago:", error);

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

paymentsController.deletePayment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: "ID inválido",
      });
    }

    const paymentDeleted = await paymentsModel.findByIdAndDelete(id);

    if (!paymentDeleted) {
      return res.status(404).json({
        message: "Pago no encontrado",
      });
    }

    return res.status(200).json({
      message: "Pago eliminado correctamente",
    });
  } catch (error) {
    console.log("Error al eliminar pago:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export default paymentsController;
