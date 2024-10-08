const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
  url: process.env.MYSQL_URL,
});

db.connect((err) => {
  if (err) throw err;
  console.log("Database connected!");
});

module.exports = db;
