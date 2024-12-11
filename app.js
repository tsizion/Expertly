const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const mongoSanitize = require("express-mongo-sanitize");
const connectDB = require("./Config/DB");
const globalErrorHandler = require("./ErrorHandlers/errorController");
const AppError = require("./ErrorHandlers/appError");
const bodyParser = require("body-parser");
const http = require("http");

const cors = require("cors");
const Server = require("socket.io").Server;
dotenv.config();

const app = express();
app.use(cors());

app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: false }));
app.use(mongoSanitize());
app.use(bodyParser.json());

connectDB();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
io.on("connection", (socket) => {
  console.log("connected");

  const loadMessages = async () => {
    try {
      const messages = await Chat.find().sort({ timeStamp: 1 }).exec();
      socket.emit("chat", messages);
    } catch (err) {
      console.log(err);
    }
  };
  loadMessages();

  socket.on("newMessage", async (msg) => {
    try {
      const newMessage = new Chat(msg);
      await newMessage.save();
      io.emit("message", msg);
    } catch (err) {
      console.log(err);
    }
  });

  socket.on("disconnect", () => {
    console.log("disconnect");
  });
});
// app.use("/api/v1/station", require("./station/routers/StationRouter"));
app.use("/api/v1/expert", require("./Expert/routers/expertRouter"));
app.use("/api/v1/client", require("./Client/routers/ClientRouter"));
app.use("/api/v1/login", require("./Login/Router/Login"));
app.use("/api/v1/category", require("./Category/routers/CategoryRouter"));
app.use(
  "/api/v1/ConsultationPackage",
  require("./Consultation/routers/consultationPackage")
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
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
