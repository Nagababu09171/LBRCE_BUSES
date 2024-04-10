const mysql = require("mysql");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  port: "3306",
  database: "buses",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("connected");
});

module.exports = con;
