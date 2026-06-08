import { Schema, model } from "mongoose";

const paymentsSchema = new Schema(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Orders",
      required: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },

    paymentMethod: {
      type: String,
      required: true,
      trim: true,
      enum: ["cash", "card", "transfer"],
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      required: true,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    paymentDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default model("Payments", paymentsSchema, "Payments");