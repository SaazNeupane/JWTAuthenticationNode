const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./middleware/error");

// Config
require("dotenv").config({ path: "./config/config.env" });

app.use(express.json());
app.use(cookieParser());

//Import Route
const auth = require("./routes/auth");

app.use("/api/v1/", auth);

// Middleware for Errors
app.use(errorMiddleware);

module.exports = app;
