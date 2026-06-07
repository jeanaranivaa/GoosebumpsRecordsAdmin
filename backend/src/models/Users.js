import { Schema, model } from "mongoose";

const usersSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      required: true,
      enum: ["Admin", "Customer", "Employee"],
      default: "Customer"
    },

    phone: {
      type: String,
      required: true,
      trim: true
    },

    registrationDate: {
      type: String,
      default: () => new Date().toISOString().split("T")[0]
    },

    userImg: {
      type: String,
      default: ""
    },

    status: {
      type: String,
      enum: ["Activo", "Inactivo"],
      default: "Activo"
    }
  },
  {
    timestamps: true
  }
);

export default model("Users", usersSchema, "Users");