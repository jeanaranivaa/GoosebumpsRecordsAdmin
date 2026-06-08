import { Schema, model } from "mongoose";

const recoveryCodeSchema = new Schema(
  {
    adminId: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },

    code: {
      type: String,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model(
  "RecoveryCode",
  recoveryCodeSchema,
  "RecoveryCodes"
);