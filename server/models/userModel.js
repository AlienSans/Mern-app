const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "Please tell your name!"],
  },
  email: {
    type: String,
    unique: true,
    require: [true, "Please tell your email!!"],
  },
  password: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
