const jwt = require("jsonwebtoken");
const db = require("../db");

module.exports = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) return res.status(401).send("Access denied");

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;

    db.query(
      "SELECT status FROM users WHERE id = ?",
      [req.user.id],
      (err, results) => {
        if (err) return res.status(500).send(err);

        if (results.length === 0) {
          return res.status(404).send("User not found.");
        }

        if (results[0].status === "blocked") {
          return res.status(403).send("user is blocked.");
        }
        next();
      }
    );
  } catch (err) {
    res.status(400).send("Invalid token");
  }
};
