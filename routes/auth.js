const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    db.query(
      "INSERT INTO employees (name, email, password, status) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, "active"],
      (err) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).send("Email already registered");
          }
          return res.status(500).send(err);
        }
        res.status(201).send("User registered!");
      }
    );
  } catch (error) {
    return res.status(500).send("Error during registration");
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM employees WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) return res.status(500).send(err);

      if (results.length === 0) return res.status(404).send("User not found");

      const user = results[0];

      if (user.status === "blocked") {
        return res.status(403).send("User is blocked");
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).send("Invalid credentials");

      const currentDateTime = new Date();
      db.query(
        "UPDATE employees SET last_login = ? WHERE id = ?",
        [currentDateTime, user.id],
        (updateErr) => {
          if (updateErr) {
            return res.status(500).send("Error updating last login time");
          }
        }
      );

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          lastLogin: user.last_login,
        },
      });
    }
  );
});

module.exports = router;
