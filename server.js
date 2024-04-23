const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies

app.get("/results", (req, res) => {
  const weatherData = {
    temp: 59,
    wind: 3,
    condition: "Clouds",
    sunrise: "06:12 AM",
    sunset: "07:30 PM",
    loc: "Torrance",
    icon: "https://openweathermap.org/img/wn/04n@2x.png",
  };

  res.json(weatherData); // Return weather data as JSON
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
