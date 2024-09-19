const express = require("express");
const cors = require("cors");
const authRoutes = require("./api/auth");
const userRoutes = require("./api/users");
const serverless = require("serverless-http");

const app = express();
const port = process.env.PORT || 5000;
app.use(
  cors({
    origin: "*", // Это разрешит все источники, но в production лучше указывать конкретные домены
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Убедитесь, что указаны все нужные методы
    allowedHeaders: ["Content-Type", "Authorization"], // Убедитесь, что указаны необходимые заголовки
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

module.exports = app;
