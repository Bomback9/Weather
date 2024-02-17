const { render } = require("ejs");
const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");

const apiKey = "3bebfc7bb440170524c4c0f639716c2a";

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

app.post("/results", async (req, res) => {
  const { city, state } = req.body;
  console.log(city);
  console.log(state);
  console.log(apiKey);
  try {
    const weatherData = await fetchWeatherData(city, state, apiKey);
    res.render("results", { weatherData }); // Pass weatherData to the results template
  } catch (error) {
    console.error("Error fetching weather data:", error);
    res.status(500).send("Error fetching weather data");
  }
});

app.listen(3000, () => {
  console.log("Listening on Port 3000");
});

const fetchWeatherData = async (city, state, apiKey) => {
  try {
    //fetching the GeoLocater to get Coordinates
    const geoRes = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${city},${state},US&limit=5&appid=${apiKey}`
    );
    const geoData = await geoRes.json();
    const latitutde = geoData[0].lat.toFixed(2);
    const longitude = geoData[0].lon.toFixed(2);

    //fetching the WeatherAPI
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitutde}&lon=${longitude}&tz=-08:00&units=Imperial&appid=${apiKey}`
    );
    const weatherData = await weatherResponse.json();
    const iconCode = weatherData.weather[0].icon;

    const temp = Math.floor(weatherData.main.temp);
    const loc = weatherData.name;
    const icon = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    const condition = weatherData.weather[0].main;
    const wind = Math.floor(weatherData.wind.speed);
    const sunriseUtc = Math.floor(weatherData.sys.sunrise);
    const sunsetUtc = Math.floor(weatherData.sys.sunset);

    //Timezone converted from UTC in seconds to whatever time zone the user inputs
    const timeZoneDif = weatherData.timezone;
    const sunrise = convertTime(sunriseUtc, timeZoneDif);
    const sunset = convertTime(sunsetUtc, timeZoneDif);

    return { temp, wind, condition, sunrise, sunset, loc, icon };
  } catch (e) {
    console.log("there has been an error ", e);
  }
};

const convertTime = (t, tD) => {
  const utcTimeInSeconds = t + tD;

  const date = new Date(utcTimeInSeconds * 1000);

  // Extract individual time components
  let amHours = date.getUTCHours();
  const amMinutes = date.getUTCMinutes();
  const meridiem = amHours >= 12 ? "PM" : "AM";

  // Convert hours to 12-hour format
  amHours = amHours % 12;
  amHours = amHours ? amHours : 12;

  // Format the time
  const formattedTime = `${amHours.toString().padStart(2, "0")}:${amMinutes
    .toString()
    .padStart(2, "0")} ${meridiem}`;

  return formattedTime;
};
