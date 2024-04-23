#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h> 

const char* ssid = "";
const char* password = "";
const char* serverUrl = "http://192.168.86.33:3000/results"; 

void setup() {
  Serial.begin(115200);

  // Connect to WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }

  Serial.println("Connected to WiFi");
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;

    // Send GET request to server
    http.begin(serverUrl);
    int httpCode = http.GET();

    if (httpCode > 0) {
      // If successful, parse JSON response
      StaticJsonDocument<256> doc; // Create a JSON document

      // Deserialize the JSON data
      DeserializationError error = deserializeJson(doc, http.getString());

      // Check for errors in parsing JSON
      if (error) {
        Serial.print("deserializeJson() failed: ");
        Serial.println(error.f_str());
      } else {
        // Extract values from JSON
        float temp = doc["temp"];
        int wind = doc["wind"];
        const char* condition = doc["condition"];
        const char* sunrise = doc["sunrise"];
        const char* sunset = doc["sunset"];
        const char* loc = doc["loc"];

        // Print extracted values
        Serial.println("Temperature: " + String(temp));
        Serial.println("Wind: " + String(wind));
        Serial.println("Condition: " + String(condition));
        Serial.println("Sunrise: " + String(sunrise));
        Serial.println("Sunset: " + String(sunset));
        Serial.println("Location: " + String(loc));
      }
    } else {
      Serial.println("Error on HTTP request");
    }

    http.end();
  }

  delay(60000); // Wait for 1 minute before making the next request
}
