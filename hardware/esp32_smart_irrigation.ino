#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

// ==========================================
// CONFIGURATION
// ==========================================
// 1. Wi-Fi Configuration
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// 2. Gateway API Configuration
// This is your laptop's Wi-Fi IP address mapped to port 8000
const char* serverName = "http://10.76.55.143:8000/detect-anomaly"; 
const String deviceId = "ESP32_IRRIG_001";

// 3. Hardware Pin Definitions
#define DHTPIN 4          // Digital pin connected to the DHT sensor
#define DHTTYPE DHT11     // DHT 11 Sensor Type
#define SOIL_PIN 34       // Analog pin for Soil Moisture Sensor (A0)
#define BUTTON_PIN 15     // Push button for manual trigger/OLED toggle

// 4. OLED Display Configuration
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

// ==========================================
// GLOBAL VARIABLES
// ==========================================
DHT dht(DHTPIN, DHTTYPE);
unsigned long lastTime = 0;
// Set timer to 5 seconds (5000) for normal readings
unsigned long timerDelay = 5000; 

float currentTemp = 0.0;
float currentHum = 0.0;
int currentSoil = 0;
bool displayPage = 0; // 0 for Sensor Data, 1 for Network Status

void setup() {
  Serial.begin(115200);
  
  // Initialize Push Button
  pinMode(BUTTON_PIN, INPUT_PULLUP);

  // Initialize OLED (If it fails, check SCL 22, SDA 21 connections)
  if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) { 
    Serial.println(F("SSD1306 OLED allocation failed"));
    for(;;); // Don't proceed, loop forever
  }
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(WHITE);
  display.setCursor(0, 10);
  display.println("AI Anomaly System");
  display.println("Booting up...");
  display.display();
  delay(1000);

  // Initialize DHT Sensor
  dht.begin();

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  Serial.println("Connecting to Wi-Fi");
  display.println("Connecting WiFi...");
  display.display();
  
  while(WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println();
  Serial.print("Connected! IP: ");
  Serial.println(WiFi.localIP());

  display.clearDisplay();
  display.setCursor(0, 0);
  display.println("WiFi Connected!");
  display.print("IP: ");
  display.println(WiFi.localIP());
  display.display();
  delay(2000);
}

void loop() {
  // Check Push Button logic
  if (digitalRead(BUTTON_PIN) == LOW) {
    // Debounce
    delay(200); 
    displayPage = !displayPage; // Toggle OLED view
    updateOLED(); 
  }

  // Send data continuously based on timer
  if ((millis() - lastTime) > timerDelay) {
    readSensors();
    updateOLED();
    
    // Check WiFi connection status
    if(WiFi.status() == WL_CONNECTED) {
      WiFiClient client;
      HTTPClient http;
    
      // Start connection to the server
      http.begin(client, serverName);
      
      // Specify content-type header
      http.addHeader("Content-Type", "application/json");
      
      // Prepare JSON payload for the Smart Irrigation Schema
      String httpRequestData = "{\"device_id\":\"" + deviceId + 
                               "\",\"temperature\":" + String(currentTemp) + 
                               ",\"humidity\":" + String(currentHum) + 
                               ",\"soil_moisture\":" + String(currentSoil) + "}";
                               
      Serial.print("Sending Payload: ");
      Serial.println(httpRequestData);
      
      // Send HTTP POST request
      int httpResponseCode = http.POST(httpRequestData);
      
      if (httpResponseCode > 0) {
        Serial.print("HTTP Response code: ");
        Serial.println(httpResponseCode);
        String payload = http.getString();
        Serial.println(payload);
      }
      else {
        Serial.print("Error code: ");
        Serial.println(httpResponseCode);
      }
      
      // Free resources
      http.end();
    }
    else {
      Serial.println("WiFi Disconnected");
    }
    lastTime = millis();
  }
}

// Function to read all sensors
void readSensors() {
  // Read Temperature and Humidity
  float h = dht.readHumidity();
  float t = dht.readTemperature();
  
  // Check if any reads failed and exit early
  if (isnan(h) || isnan(t)) {
    Serial.println(F("Failed to read from DHT sensor!"));
  } else {
    currentTemp = t;
    currentHum = h;
  }
  
  // Read Soil Moisture
  currentSoil = analogRead(SOIL_PIN);
}

// Function to update the OLED Screen based on state
void updateOLED() {
  display.clearDisplay();
  display.setCursor(0,0);
  
  if (displayPage == 0) {
    display.setTextSize(1);
    display.println("-- NEXUS SENSORS --");
    display.println();
    display.print("Temp:  ");
    display.print(currentTemp);
    display.println(" C");
    
    display.print("Hum:   ");
    display.print(currentHum);
    display.println(" %");
    
    display.print("Soil:  ");
    display.println(currentSoil);
  } else {
    display.setTextSize(1);
    display.println("-- SYSTEM STATUS --");
    display.println();
    if(WiFi.status() == WL_CONNECTED) {
      display.println("WiFi: CONNECTED");
      display.print("IP: ");
      display.println(WiFi.localIP()[3]); // Just print the last octet for space
    } else {
      display.println("WiFi: OFFLINE");
    }
    display.println("Mode: Deep Scan");
  }
  display.display();
}
