const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const mongoSanitize = require("express-mongo-sanitize");
const admin = require("firebase-admin");
const connectDB = require("./Config/DB");
const credentials = require("./Config/firebase-admin-key.json");
const globalErrorHandler = require("./ErrorHandlers/errorController");
const AppError = require("./ErrorHandlers/appError");
const bodyParser = require("body-parser");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(cors());

app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: false }));
app.use(mongoSanitize());
app.use(bodyParser.json());

connectDB();

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(credentials),
  storageBucket: "b2bdelivery-b2b59.appspot.com",
});

// Routers
app.use("/api/user", require("./user/router/userRouter"));
app.use(
  "/api/manufacturer",
  require("./manufacturer/routers/manufacturerRouter")
);
app.use("/api/retailer", require("./retailor/routers/retailerRouter"));
app.use("/api/product", require("./product/routers/productRouter"));

app.use(
  "/api/businessCategory",
  require("./BusinessCategory/router/businessCategoryRouter")
);
app.use("/api/order", require("./product/routers/orderRoutes"));
app.use("/api/credit", require("./product/routers/creditRouter"));
app.use(
  "/api/productCategory",
  require("./productCategory/routers/categoryRoutes")
);
app.use("/api/paswordreset", require("./paswordReset/paswordresetroute"));
app.use("/api/login", require("./Login/Router/Login"));

app.use(
  "/api/deletedProducts",
  require("./deletedProducts/routes/deletedproducts")
);

// Default route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Error handling for unmatched routes
app.all("*", (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

// Global error handler
app.use(globalErrorHandler);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Error handling for unhandled rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err.name, err.message);
  console.log("Shutting down the server due to unhandled promise rejection");
  server.close(() => {
    process.exit(1);
  });
});

// Error handling for uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err.name, err.message);
  console.log("Shutting down the server due to uncaught exception");
  process.exit(1);
});
