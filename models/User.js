const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter a name"],
    maxLength: [30, "Name can not be more than 30 characters"],
  },

  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },

  password: {
    type: String,
    required: [true, "Please enter a password"],
    minLength: [6, "Password must be at least 6 characters"],
    select: false,
  },

  role: {
    type: String,
    default: "user",
    required: [true, "Please enter a role"],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//Encrypting the password before saving it to the database
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

//Compare User Password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//Return JWT token
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME,
  });
};

module.exports = mongoose.model("User", userSchema);
