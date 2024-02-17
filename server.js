const { render } = require("ejs");
const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  })
);

app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("home");
});
app.get("/results", (req, res) => {
  res.render("results");
});

app.post("/results", (req, res) => {
  const { city, state } = req.body;
  console.log(city);
  console.log(state);
  res.redirect("/results");
});

app.listen(3000, () => {
  console.log("Listening on Port 3000");
});
