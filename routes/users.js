const express = require("express");
const db = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", auth, (req, res) => {
  db.query(
    "SELECT id, name, email, created_at, last_login, status FROM employees",
    (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
    }
  );
});

router.delete("/", auth, (req, res) => {
  const userIds = req.body.ids;

  if (!Array.isArray(userIds) || userIds.length === 0) {
    return res.status(400).send({
      status: "error",
      message: "Invalid input: must provide an array of user IDs",
    });
  }

  const placeholders = userIds.map(() => "?").join(", ");
  const query = `DELETE FROM employees WHERE id IN (${placeholders})`;

  db.query(query, userIds, (err, results) => {
    if (err) {
      return res
        .status(500)
        .send({ status: "error", message: "Internal Server Error" });
    }

    res.send({
      status: "success",
      message: `${results.affectedRows} user(s) deleted`,
    });
  });
});

router.post("/block", auth, (req, res) => {
  const userIds = req.body.ids;

  if (!Array.isArray(userIds) || userIds.length === 0) {
    return res
      .status(400)
      .send("Invalid input: must provide an array of user IDs");
  }
  const placeholders = userIds.map(() => "?").join(", ");
  const query = `UPDATE employees SET status = "blocked" WHERE id IN (${placeholders})`;

  db.query(query, userIds, (err) => {
    if (err) return res.status(500).send(err);
    res.send("Users blocked");
  });
});

router.post("/unblock", auth, (req, res) => {
  const userIds = req.body.ids;

  if (!Array.isArray(userIds) || userIds.length === 0) {
    return res
      .status(400)
      .send("Invalid input: must provide an array of user IDs");
  }

  const placeholders = userIds.map(() => "?").join(", ");
  const query = `UPDATE employees SET status = "active" WHERE id IN (${placeholders})`;

  db.query(query, userIds, (err) => {
    if (err) return res.status(500).send(err);
    res.send("Users unblocked");
  });
});

module.exports = router;
