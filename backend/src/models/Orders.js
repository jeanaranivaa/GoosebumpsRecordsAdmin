import { Schema, model } from "mongoose";

const orderProductSchema = new Schema(
  {
    vinylId: {
      type: Schema.Types.ObjectId,
      ref: "Vinyls",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: false,
  }
);

const ordersSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },

    products: {
      type: [orderProductSchema],
      required: true,
      validate: {
        validator: function (products) {
          return products.length > 0;
        },
        message: "La orden debe tener al menos un producto",
      },
    },

    total: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },

    shippingAddress: {
      type: String,
      required: true,
      trim: true,
    },

    orderDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default model("Orders", ordersSchema, "Orders");