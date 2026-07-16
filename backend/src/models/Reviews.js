import { Schema, model } from "mongoose";

const reviewsSchema = new Schema(
  {
    vinylId: {
      type: Schema.Types.ObjectId,
      ref: "Vinyls",
      required: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      trim: true,
      default: "",
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

// Una sola reseña por usuario y vinilo
reviewsSchema.index({ vinylId: 1, userId: 1 }, { unique: true });

export default model("Reviews", reviewsSchema, "Reviews");
