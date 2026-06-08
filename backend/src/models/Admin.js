import { Schema, model } from "mongoose";

const adminSchema = new Schema({
  fullName: String,
  email: String,
  password: String,
  adminUrl: String,
});

export default model("Admin", adminSchema, "Admin");