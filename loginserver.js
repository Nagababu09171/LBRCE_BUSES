const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
const fs = require("fs");
const app = express();
const con = require("./db");

app.use(express.static("./public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "my-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

const adminServer = require("./adminserver");
app.use("/admin", adminServer);

const passengerServer = require("./passengerserver");
app.use("/passenger", passengerServer);

const coordinatorServer = require("./coordinatorserver");
const { connect } = require("http2");
app.use("/coordinator", coordinatorServer);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/index.html"));
});

app.post("/", (req, res) => {
  const { email, password, role } = req.body;
  req.session.user = email;
  req.session.password = password;
  req.session.role = role;

  con.query("SELECT * FROM users", function (err, result, fields) {
    if (err) throw err;
    for (data in result) {
      if (result[data].email == email && result[data].password == password) {
        console.log(result[data].email);
        if (result[data].role === "admin") res.redirect("/admin");
        else if (result[data].role === "passenger") res.redirect("/passenger");
        else if (result[data].role === "coordinator")
          res.redirect("/coordinator");
        else if (result[data].role === "maintenance")
          res.redirect("/maintenance");
        else res.redirect("/");
      }
    }
  });
});

app.listen(8085, () => {
  console.log("server is listening on 8085");
});
