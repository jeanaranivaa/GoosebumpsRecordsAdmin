import { Schema, model } from "mongoose";

const usersSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      required: true,
      enum: ["admin", "customer"],
      default: "customer",
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    registrationDate: {
      type: Date,
      default: Date.now,
    },

    imageURL: {
      type: String,
      default: "",
    },

    public_id: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

export default model("Users", usersSchema, "Users");