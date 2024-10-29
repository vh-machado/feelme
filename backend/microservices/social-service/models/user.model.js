const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    required: true,
  },
  followers:{
    type: Number,
    required: false,
    default: 0,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+\@.+\..+/, "Por favor, insira um email válido"], // Validação de email
  },
  password: {
    type: String,
    required: true,
  },
  userRole: {
    type: String,
    required: true,
    default: "user", // Valor padrão para userRole
  },
});

module.exports = mongoose.model("User", UserSchema);
