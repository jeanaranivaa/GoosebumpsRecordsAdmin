import { Schema, model } from "mongoose";

const vinylsSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    artist: {
      type: String,
      required: true,
      trim: true,
    },

    genre: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    coverUrl: {
      type: String,
      default: "",
    },

    public_id: {
      type: String,
      default: "",
    },

    dateAdded: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["Disponible", "Agotado"],
      default: "Disponible",
    },
  },
  {
    timestamps: true,
  }
);

export default model("Vinyls", vinylsSchema, "Vinyls");