const User = require("../models/User");

const ErrorHandler = require("../utils/ErrorHandler");

const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");

//Register a new user  => /api/v1/register
exports.register = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
  });

  sendToken(user, 200, "User Register successfully", res);
});

//Login User
exports.login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  //Check if Email and Password is Entered by user
  if (!email || !password) {
    return next(new ErrorHandler("Please enter email and password", 400));
  }

  //Finding User in DB
  const user = await User.findOne({ email: email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  //Checks if password is correct
  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    return next(new ErrorHandler("Invalid Password", 401));
  }

  sendToken(user, 200, "User logged in successfully", res);
});

//Logout User
exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    status: "success",
    message: "User logged out successfully",
  });
});
