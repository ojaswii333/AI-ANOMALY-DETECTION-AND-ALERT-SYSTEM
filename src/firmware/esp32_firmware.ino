/*
  ESP32 + LDR Sensor Firmware
  ============================
  
  Hardware Setup:
  - ESP32 Development Board
  - LDR Sensor connected to GPIO 34 (ADC0)
  - Resistor: 10kΩ pulldown to GND
  
  Functionality:
  - Read LDR sensor every 1 second
  - Send data to backend API via HTTP
  - On-board status LED for visual feedback
  - Optional: MQTT support
  
  Libraries Required (in platformio.ini):
  - esp32 core
  - Arduino JSON
  - Arduino HTTP Client
*/

#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <time.h>

// ============================================================
// Configuration
// ============================================================

// WiFi Configuration
const char* WIFI_SSID = "Your_WiFi_SSID";
const char* WIFI_PASSWORD = "Your_WiFi_Password";

// Backend API Configuration
const char* API_SERVER = "http://192.168.1.100:8000";  // Change to your server IP
const char* DEVICE_ID = "ESP32_001";

// Hardware Configuration
const int LDR_PIN = 34;           // ADC0 pin for LDR
const int STATUS_LED_PIN = 2;     // GPIO 2 for status LED
const int SAMPLING_RATE_MS = 1000; // Sample every 1 second

// ============================================================
// Global Variables
// ============================================================

WiFiClient wifiClient;
HTTPClient http;
unsigned long lastSampleTime = 0;
unsigned long lastWiFiCheckTime = 0;
unsigned long wifiCheckInterval = 30000; // Check WiFi every 30 seconds

int readingsCount = 0;
int anomaliesDetected = 0;

// ============================================================
// Setup Function
// ============================================================

void setup() {
  // Serial communication for debugging
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("\n\n");
  Serial.println("╔═════════════════════════════════════╗");
  Serial.println("║  ESP32 + LDR ANOMALY DETECTION     ║");
  Serial.println("║  Firmware v1.0.0                   ║");
  Serial.println("╚═════════════════════════════════════╝");
  
  // Initialize GPIO
  pinMode(STATUS_LED_PIN, OUTPUT);
  digitalWrite(STATUS_LED_PIN, LOW);
  
  // Initialize ADC
  analogReadResolution(12); // 12-bit ADC (0-4095)
  
  Serial.println("\n[SETUP] Initializing...");
  
  // Connect to WiFi
  connectToWiFi();
  
  // Configure time for NTP
  configTime(0, 0, "pool.ntp.org", "time.nist.gov");
  
  Serial.println("[SETUP] ✓ Initialization complete\n");
}

// ============================================================
// Main Loop
// ============================================================

void loop() {
  // Check WiFi connection
  unsigned long currentTime = millis();
  if (currentTime - lastWiFiCheckTime >= wifiCheckInterval) {
    lastWiFiCheckTime = currentTime;
    if (WiFi.status() != WL_CONNECTED) {
      Serial.println("[WiFi] Reconnecting...");
      connectToWiFi();
    }
  }
  
  // Sample sensor at defined rate
  if (currentTime - lastSampleTime >= SAMPLING_RATE_MS) {
    lastSampleTime = currentTime;
    sampleAndSendData();
  }
  
  delay(100); // Small delay to prevent watchdog reset
}

// ============================================================
// WiFi Connection Function
// ============================================================

void connectToWiFi() {
  Serial.printf("\n[WiFi] Connecting to: %s\n", WIFI_SSID);
  
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    digitalWrite(STATUS_LED_PIN, !digitalRead(STATUS_LED_PIN)); // Blink LED
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n[WiFi] ✓ Connected");
    Serial.print("[WiFi] IP Address: ");
    Serial.println(WiFi.localIP());
    digitalWrite(STATUS_LED_PIN, HIGH); // LED ON = connected
  } else {
    Serial.println("\n[WiFi] ✗ Failed to connect");
    digitalWrite(STATUS_LED_PIN, LOW);
  }
}

// ============================================================
// LDR Sensor Reading
// ============================================================

int readLDRSensor() {
  int rawValue = analogRead(LDR_PIN);
  
  // Convert 12-bit ADC (0-4095) to LDR scale (0-1023)
  int scaledValue = map(rawValue, 0, 4095, 0, 1023);
  
  return scaledValue;
}

// ============================================================
// Data Transmission
// ============================================================

void sampleAndSendData() {
  // Read sensor
  int ldrValue = readLDRSensor();
  
  // Get current timestamp
  time_t now = time(nullptr);
  struct tm* timeinfo = localtime(&now);
  char timestamp[30];
  strftime(timestamp, sizeof(timestamp), "%Y-%m-%dT%H:%M:%S", timeinfo);
  
  Serial.printf("[DATA] Reading #%d | LDR: %d | Time: %s\n", 
                readingsCount++, ldrValue, timestamp);
  
  // Send to backend
  if (WiFi.status() == WL_CONNECTED) {
    sendToBackend(ldrValue, timestamp);
  } else {
    Serial.println("[ERROR] WiFi disconnected");
    digitalWrite(STATUS_LED_PIN, LOW);
  }
}

void sendToBackend(int ldrValue, const char* timestamp) {
  // Prepare JSON payload
  StaticJsonDocument<200> doc;
  doc["device_id"] = DEVICE_ID;
  doc["ldr_value"] = ldrValue;
  doc["timestamp"] = timestamp;
  
  String payload;
  serializeJson(doc, payload);
  
  // Send POST request to backend
  String url = String(API_SERVER) + "/ingest-data";
  
  http.begin(wifiClient, url);
  http.addHeader("Content-Type", "application/json");
  
  int httpCode = http.POST(payload);
  
  if (httpCode == HTTP_CODE_OK) {
    String response = http.getString();
    Serial.printf("[SENT] ✓ Data sent successfully (HTTP %d)\n", httpCode);
  } else {
    Serial.printf("[ERROR] HTTP Error: %d\n", httpCode);
  }
  
  http.end();
}

/*
  Detection Request (Optional - send to /detect-anomaly):
  
  void detectAnomaly(int ldrValue, const char* timestamp) {
    StaticJsonDocument<200> doc;
    doc["device_id"] = DEVICE_ID;
    doc["ldr_value"] = ldrValue;
    doc["timestamp"] = timestamp;
    
    String payload;
    serializeJson(doc, payload);
    
    String url = String(API_SERVER) + "/detect-anomaly";
    
    http.begin(wifiClient, url);
    http.addHeader("Content-Type", "application/json");
    
    int httpCode = http.POST(payload);
    
    if (httpCode == HTTP_CODE_OK) {
      String response = http.getString();
      DynamicJsonDocument responseDoc(512);
      deserializeJson(responseDoc, response);
      
      bool isAnomaly = responseDoc["is_anomaly"];
      float anomalyScore = responseDoc["anomaly_score"];
      
      if (isAnomaly) {
        Serial.printf("[ALERT] 🚨 Anomaly detected! Score: %.2f\n", anomalyScore);
        // Flash LED rapidly
        for (int i = 0; i < 5; i++) {
          digitalWrite(STATUS_LED_PIN, HIGH);
          delay(100);
          digitalWrite(STATUS_LED_PIN, LOW);
          delay(100);
        }
        digitalWrite(STATUS_LED_PIN, HIGH); // LED back ON
      }
    }
    
    http.end();
  }
*/

// ============================================================
// MQTT Alternative (Optional)
// ============================================================

/*
  For MQTT instead of HTTP, use:
  
  #include <PubSubClient.h>
  
  const char* MQTT_SERVER = "192.168.1.100";
  const int MQTT_PORT = 1883;
  
  PubSubClient mqttClient(wifiClient);
  
  void setupMQTT() {
    mqttClient.setServer(MQTT_SERVER, MQTT_PORT);
  }
  
  void sendViaMQTT(int ldrValue, const char* timestamp) {
    if (!mqttClient.connected()) {
      reconnectMQTT();
    }
    
    char topic[50];
    snprintf(topic, sizeof(topic), "sensor/%s/ldr", DEVICE_ID);
    
    char payload[100];
    snprintf(payload, sizeof(payload), 
             "{\"value\":%d,\"timestamp\":\"%s\"}", 
             ldrValue, timestamp);
    
    mqttClient.publish(topic, payload);
  }
*/

// ============================================================
// Debugging Functions
// ============================================================

void printSystemInfo() {
  Serial.println("\n╔═════════════════════════════════════╗");
  Serial.println("║       SYSTEM INFORMATION           ║");
  Serial.println("╚═════════════════════════════════════╝");
  Serial.printf("Device ID: %s\n", DEVICE_ID);
  Serial.printf("WiFi SSID: %s\n", WIFI_SSID);
  Serial.printf("API Server: %s\n", API_SERVER);
  Serial.printf("Sampling Rate: %d ms\n", SAMPLING_RATE_MS);
  Serial.printf("Total Readings: %d\n", readingsCount);
  Serial.printf("Anomalies Detected: %d\n", anomaliesDetected);
  Serial.println();
}

// ============================================================
// Notes
// ============================================================

/*
  PLATFORMIO.INI Configuration:
  
  [env:esp32dev]
  platform = espressif32
  board = esp32dev
  framework = arduino
  lib_deps =
      ArduinoJson
      HTTPClient
      PubSubClient (if using MQTT)
  monitor_speed = 115200
  
  WIRING DIAGRAM:
  
  ESP32           LDR Circuit
  ──────────────────────────
  GPIO 34 ────────┬─── LDR Sensor
                  │
                  └─── 10kΩ Resistor ─── GND
  
  GND ──────────────────── GND
  5V ───────────────────── 5V (for LED)
  
  GPIO 2 (LED) ────────── LED Anode
  220Ω Resistor ────────── LED Cathode ─── GND
  
  CALIBRATION:
  
  LDR Sensitivity varies with model. Typical ranges:
  - Dark room: 100-300
  - Normal office: 400-600
  - Bright sunlight: 800-1023
  
  Adjust the API threshold based on your specific LDR.
*/
