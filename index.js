const express = require("express");
const cors = require("cors");
const authRoutes = require("./api/auth");
const userRoutes = require("./api/users");
require("dotenv").config();
const app = express();

const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.listen(() => {
  console.log(`Example app listening on port ${port}`);
});
