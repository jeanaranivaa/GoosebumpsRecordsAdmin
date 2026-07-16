import { isValidObjectId } from "mongoose";
import ordersModel from "../models/Orders.js";
import usersModel from "../models/Users.js";
import vinylsModel from "../models/Vinyls.js";

const ordersController = {};

const validStatuses = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const validateStatus = (status) => {
  return validStatuses.includes(status);
};

const MONTHS_IN_CHART = 6;

const MONTH_LABELS = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
];

// Los géneros vienen con mayúsculas inconsistentes ("Rock" y "rock"),
// así que se agrupan en minúscula y se rotula al mostrarlos.
const toTitleCase = (text) =>
  text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const buildRangeStart = (range) => {
  const now = new Date();

  if (range === "week") {
    const start = new Date(now);
    start.setDate(start.getDate() - 7);
    return start;
  }

  if (range === "month") {
    const start = new Date(now);
    start.setMonth(start.getMonth() - 1);
    return start;
  }

  return null;
};

// Métricas del dashboard calculadas desde las órdenes reales
ordersController.getStats = async (req, res) => {
  try {
    const range = ["week", "month", "all"].includes(req.query.range)
      ? req.query.range
      : "all";

    const rangeStart = buildRangeStart(range);

    // orderDate falta en las órdenes sembradas; createdAt es el respaldo
    const withDate = {
      $addFields: {
        effectiveDate: { $ifNull: ["$orderDate", "$createdAt"] },
      },
    };

    const notCancelled = { $match: { status: { $ne: "cancelled" } } };

    const rangeMatch = rangeStart
      ? [{ $match: { effectiveDate: { $gte: rangeStart } } }]
      : [];

    const [totals] = await ordersModel.aggregate([
      notCancelled,
      withDate,
      ...rangeMatch,
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$total" },
          totalOrders: { $sum: 1 },
        },
      },
    ]);

    const byGenre = await ordersModel.aggregate([
      notCancelled,
      withDate,
      ...rangeMatch,
      { $unwind: "$products" },
      {
        $lookup: {
          from: "Vinyls",
          localField: "products.vinylId",
          foreignField: "_id",
          as: "vinyl",
        },
      },
      // Deja fuera las líneas de vinilos ya eliminados del catálogo
      { $unwind: "$vinyl" },
      {
        $group: {
          _id: { $toLower: "$vinyl.genre" },
          unitsSold: { $sum: "$products.quantity" },
          revenue: { $sum: "$products.subtotal" },
        },
      },
      { $sort: { unitsSold: -1 } },
    ]);

    const monthsStart = new Date();
    monthsStart.setMonth(monthsStart.getMonth() - (MONTHS_IN_CHART - 1));
    monthsStart.setDate(1);
    monthsStart.setHours(0, 0, 0, 0);

    const monthly = await ordersModel.aggregate([
      notCancelled,
      withDate,
      { $match: { effectiveDate: { $gte: monthsStart } } },
      {
        $group: {
          _id: {
            year: { $year: "$effectiveDate" },
            month: { $month: "$effectiveDate" },
          },
          revenue: { $sum: "$total" },
          orders: { $sum: 1 },
        },
      },
    ]);

    // Rellena los meses sin ventas para que la gráfica no tenga huecos
    const byMonth = [];

    for (let i = 0; i < MONTHS_IN_CHART; i++) {
      const cursor = new Date(monthsStart);
      cursor.setMonth(cursor.getMonth() + i);

      const year = cursor.getFullYear();
      const month = cursor.getMonth() + 1;

      const found = monthly.find(
        (item) => item._id.year === year && item._id.month === month
      );

      byMonth.push({
        label: MONTH_LABELS[month - 1],
        year,
        month,
        revenue: found ? Number(found.revenue.toFixed(2)) : 0,
        orders: found ? found.orders : 0,
      });
    }

    return res.status(200).json({
      range,
      totalRevenue: Number((totals?.totalRevenue || 0).toFixed(2)),
      totalOrders: totals?.totalOrders || 0,
      byGenre: byGenre.map((item) => ({
        genre: toTitleCase(item._id || "sin género"),
        unitsSold: item.unitsSold,
        revenue: Number(item.revenue.toFixed(2)),
      })),
      byMonth,
    });
  } catch (error) {
    console.log("Error al obtener estadísticas:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

ordersController.getOrders = async (req, res) => {
  try {
    const orders = await ordersModel
      .find()
      .populate("userId", "fullName email phone")
      .populate("products.vinylId", "title artist genre price coverUrl")
      .sort({ createdAt: -1 });

    return res.status(200).json(orders);
  } catch (error) {
    console.log("Error al obtener órdenes:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Historial de pedidos de un cliente
ordersController.getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
      return res.status(400).json({
        message: "ID de usuario inválido",
      });
    }

    const orders = await ordersModel
      .find({ userId })
      .populate("products.vinylId", "title artist coverUrl")
      .sort({ createdAt: -1 });

    return res.status(200).json(orders);
  } catch (error) {
    console.log("Error al obtener órdenes del usuario:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

ordersController.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: "ID inválido",
      });
    }

    const order = await ordersModel
      .findById(id)
      .populate("userId", "fullName email phone")
      .populate("products.vinylId", "title artist genre price coverUrl");

    if (!order) {
      return res.status(404).json({
        message: "Orden no encontrada",
      });
    }

    return res.status(200).json(order);
  } catch (error) {
    console.log("Error al obtener orden:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

ordersController.insertOrder = async (req, res) => {
  try {
    let { userId, products, shippingAddress, status } = req.body;

    shippingAddress = shippingAddress?.trim();
    status = status?.trim();

    if (!userId || !products || !shippingAddress) {
      return res.status(400).json({
        message: "Usuario, productos y dirección son obligatorios",
      });
    }

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

    if (userFound.verified === false) {
      return res.status(403).json({
        message: "Debes confirmar tu cuenta antes de comprar",
      });
    }

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        message: "La orden debe tener al menos un producto",
      });
    }

    if (shippingAddress.length < 5 || shippingAddress.length > 150) {
      return res.status(400).json({
        message: "La dirección debe tener entre 5 y 150 caracteres",
      });
    }

    if (status && !validateStatus(status)) {
      return res.status(400).json({
        message: "Estado inválido",
      });
    }

    const productsToSave = [];
    let total = 0;

    for (const item of products) {
      const { vinylId, quantity } = item;

      if (!vinylId || !quantity) {
        return res.status(400).json({
          message: "Cada producto debe tener vinylId y quantity",
        });
      }

      if (!isValidObjectId(vinylId)) {
        return res.status(400).json({
          message: "ID de vinilo inválido",
        });
      }

      const quantityNumber = Number(quantity);

      if (!Number.isInteger(quantityNumber) || quantityNumber <= 0) {
        return res.status(400).json({
          message: "La cantidad debe ser un número entero mayor a 0",
        });
      }

      const vinylFound = await vinylsModel.findById(vinylId);

      if (!vinylFound) {
        return res.status(404).json({
          message: "Vinilo no encontrado",
        });
      }

      const subtotal = Number(vinylFound.price) * quantityNumber;
      total += subtotal;

      productsToSave.push({
        vinylId: vinylFound._id,
        title: vinylFound.title,
        quantity: quantityNumber,
        price: vinylFound.price,
        subtotal,
      });
    }

    const newOrder = new ordersModel({
      userId,
      products: productsToSave,
      total,
      status: status || "pending",
      shippingAddress,
    });

    await newOrder.save();

    return res.status(201).json({
      message: "Orden creada correctamente",
      order: newOrder,
    });
  } catch (error) {
    console.log("Error al crear orden:", error);

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

ordersController.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: "ID inválido",
      });
    }

    const orderFound = await ordersModel.findById(id);

    if (!orderFound) {
      return res.status(404).json({
        message: "Orden no encontrada",
      });
    }

    let { status, shippingAddress } = req.body;

    const dataToUpdate = {};

    if (status !== undefined) {
      status = status.trim();

      if (!validateStatus(status)) {
        return res.status(400).json({
          message: "Estado inválido",
        });
      }

      dataToUpdate.status = status;
    }

    if (shippingAddress !== undefined) {
      shippingAddress = shippingAddress.trim();

      if (shippingAddress.length < 5 || shippingAddress.length > 150) {
        return res.status(400).json({
          message: "La dirección debe tener entre 5 y 150 caracteres",
        });
      }

      dataToUpdate.shippingAddress = shippingAddress;
    }

    const orderUpdated = await ordersModel
      .findByIdAndUpdate(id, dataToUpdate, { new: true })
      .populate("userId", "fullName email phone")
      .populate("products.vinylId", "title artist genre price coverUrl");

    return res.status(200).json({
      message: "Orden actualizada correctamente",
      order: orderUpdated,
    });
  } catch (error) {
    console.log("Error al actualizar orden:", error);

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

ordersController.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: "ID inválido",
      });
    }

    const orderDeleted = await ordersModel.findByIdAndDelete(id);

    if (!orderDeleted) {
      return res.status(404).json({
        message: "Orden no encontrada",
      });
    }

    return res.status(200).json({
      message: "Orden eliminada correctamente",
    });
  } catch (error) {
    console.log("Error al eliminar orden:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export default ordersController;