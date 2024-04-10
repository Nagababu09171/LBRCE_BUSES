const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
const fs = require("fs");
const app = express();
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
  const data = JSON.parse(fs.readFileSync("public/data/buses.json", "utf8"));
  for (const key in data) {
    const bus = data[key];
    bus.route.forEach((element) =>
      con.query(
        "insert into " + key + " values(?,?,?)",
        [element.time, element.busstop, element.atime],
        function (err, result) {
          if (err) throw err;
        }
      )
    );
    console.log("insert");
    console.log(key);
  }
});
module.exports = con;
