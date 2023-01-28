const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

connection.connect(function (err) {
  if (err) throw err;
});

module.exports = connection;

// const mysql = require("mysql2");

// const connection = mysql.createConnection({
//   host: "localhost",
//   // Your username
//   user: "root",
//   // Your password
//   password: "Darkflamemaster9909",
//   database: "employees_db",
// });

// connection.connect(function (err) {
//   if (err) throw err;
// });

// module.exports = connection;
