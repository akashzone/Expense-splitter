const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
    trim: true,
  },
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);
module.exports = User;