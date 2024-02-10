//api Key with Current Date variable
const apiKey = "a335ea562508ddcaaec55b37898a39bd";
const currentDate = new Date().toDateString();

//Funciton to fetch the API Data and return the needed Information
const fetchWeatherData = async (city, state, apiKey) => {
  try {
    //fetching the GeoLocater to get Coordinates
    const geoRes = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${city},${state},US&limit=5&appid=${apiKey}`
    );
    const geoData = await geoRes.json();
    const lat = geoData[0].lat.toFixed(2);
    const long = geoData[0].lon.toFixed(2);

    //fetching the WeatherAPI
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&tz=-08:00&units=Imperial&appid=a335ea562508ddcaaec55b37898a39bd`
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

// UTC time converter
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

const form = document.querySelector(".location");
const tempature = document.querySelector(".temperature");
const place = document.querySelector(".place");
const date = document.querySelector(".date");
const ic = document.querySelector(".icon");
const cond = document.querySelector(".condition");
const breeze = document.querySelector(".wind");
const sunup = document.querySelector(".sunrise");
const sundown = document.querySelector(".sunset");

//Search Protocol for city and state the user inputed
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const cityInput = document.querySelector(".city");
  const stateInput = document.querySelector(".state");

  const city = cityInput.value;
  const state = stateInput.value;
  //call the funtion to get the data and display it on the screen
  fetchWeatherData(city, state, apiKey).then(
    ({ temp, wind, condition, sunrise, sunset, loc, icon }) => {
      const img = document.createElement("img");
      img.src = icon;
      tempature.innerHTML = `${temp}°`;
      place.innerHTML = loc;
      ic.innerHTML = `<img src="${icon}" alt="">`;
      cond.innerHTML = `Condition: ${condition}`;
      breeze.innerHTML = `Wind: ${wind} mph`;
      sunup.innerHTML = `Sunrise: ${sunrise}`;
      sundown.innerHTML = `Sunset: ${sunset}`;
    }
  );
  cityInput.value = "";
  stateInput.value = "";
});
