const apiKey = "a335ea562508ddcaaec55b37898a39bd";
const city = "Torrance";
const state = "CA";
const timeDif = 28800;

const fetchWeatherData = async () => {
  try {
    const geoRes = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=Torrance,California,US&limit=5&appid=a335ea562508ddcaaec55b37898a39bd`
    );
    const geoData = await geoRes.json();
    const lat = geoData[0].lat;
    const long = geoData[0].lat;

    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=33.83&lon=-118.34&tz=-08:00&units=Imperial&appid=a335ea562508ddcaaec55b37898a39bd`
    );
    const weatherData = await weatherResponse.json();

    const temp = Math.floor(weatherData.main.temp);
    const wind = Math.floor(weatherData.wind.speed);
    const sunriseUtc = Math.floor(weatherData.sys.sunrise);
    const sunsetUtc = Math.floor(weatherData.sys.sunset);
    const condition = weatherData.weather[0].main;
    const timeZoneDif = weatherData.timezone;

    const sunrise = convertTime(sunriseUtc, timeZoneDif);
    const sunset = convertTime(sunsetUtc, timeZoneDif);

    return { temp, wind, condition, sunrise, sunset };
  } catch (e) {
    console.log("there has been an error ", e);
  }
};

fetchWeatherData().then(({ temp, wind, condition, sunrise, sunset }) => {
  console.log(`tempature: ${temp}°F`);
  console.log(`wind: ${wind} MPH`);
  console.log(`condition: ${condition}`);
  console.log(`sunrise: ${sunrise}`);
  console.log(`sunset: ${sunset}`);
});

// UTC time in seconds
const convertTime = (t, tD) => {
  const utcTimeInSeconds = t + tD;

  // Create a new Date object using the UTC time in seconds
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

  // Output the formatted time
  return formattedTime;
};
