const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies

app.get("/", async (req, res) => {
  const axios = require("axios");

  const options = {
    method: "GET",
    url: "https://catfact.ninja/fact",
  };

  try {
    const response = await axios.request(options);
    console.log(response.data);
    res.json(response.data.fact);
  } catch (error) {
    console.error(error);
  }
});

app.listen(3000, () => {
  console.log("Listening on Port 3000");
});
