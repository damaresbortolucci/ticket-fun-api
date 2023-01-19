import mongoose from "mongoose";

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    nome: String,
    email: String,
    senha: String,
    role: String
  })
);

export default User;
