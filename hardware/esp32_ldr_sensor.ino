/*
 * ============================================================
 * AI Anomaly Detection System — ESP32 LDR Sensor Node
 * ============================================================
 * 
 * HARDWARE WIRING:
 *   - LDR one leg  → 3.3V
 *   - LDR other leg → Pin 34 (ADC) + 10k resistor to GND
 *   - This forms a voltage divider circuit
 * 
 * WHAT THIS DOES:
 *   1. Connects to your WiFi
 *   2. Reads LDR sensor value from Pin 34 every 2 seconds
 *   3. Sends JSON payload to your backend API
 *   4. Prints everything to Serial Monitor for debugging
 * 
 * SETUP INSTRUCTIONS:
 *   1. Open this file in Arduino IDE
 *   2. Install "ESP32" board from Board Manager
 *   3. Change WIFI_SSID, WIFI_PASSWORD, and API_URL below
 *   4. Select Board: "ESP32 Dev Module"
 *   5. Select correct COM port
 *   6. Upload!
 *   7. Open Serial Monitor at 115200 baud to see output
 * ============================================================
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// ==================== CONFIGURE THESE ====================
const char* WIFI_SSID     = "YOUR_WIFI_NAME";        // <-- Change this
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";     // <-- Change this

// For LOCAL testing (backend on your laptop):
const char* API_URL = "http://YOUR_LAPTOP_IP:8000/detect-anomaly";
// Example: "http://192.168.1.5:8000/detect-anomaly"

// For DEPLOYED backend on Render:
// const char* API_URL = "https://nexus-ai-backend-5f4o.onrender.com/detect-anomaly";

const char* DEVICE_ID = "ESP32_001";
// ==========================================================

const int LDR_PIN = 34;           // Analog input pin
const int SEND_INTERVAL = 2000;   // Send every 2 seconds

void setup() {
    Serial.begin(115200);
    delay(1000);
    
    Serial.println();
    Serial.println("========================================");
    Serial.println("  AI Anomaly Detection - ESP32 Node");
    Serial.println("========================================");
    Serial.println();
    
    // Connect to WiFi
    Serial.print("[WIFI] Connecting to: ");
    Serial.println(WIFI_SSID);
    
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    
    int attempts = 0;
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
        attempts++;
        if (attempts > 40) {  // 20 second timeout
            Serial.println("\n[ERROR] WiFi connection failed! Restarting...");
            ESP.restart();
        }
    }
    
    Serial.println();
    Serial.println("[OK] WiFi Connected!");
    Serial.print("[OK] IP Address: ");
    Serial.println(WiFi.localIP());
    Serial.print("[OK] Sending to: ");
    Serial.println(API_URL);
    Serial.println();
    Serial.println("--- Starting Sensor Loop ---");
    Serial.println();
}

void loop() {
    // Step 1: Read LDR sensor
    int rawValue = analogRead(LDR_PIN);
    
    // ESP32 ADC is 12-bit (0-4095), scale to 0-1023 range for our model
    float ldrValue = (rawValue / 4095.0) * 1023.0;
    
    Serial.print("[SENSOR] Raw ADC: ");
    Serial.print(rawValue);
    Serial.print(" | Scaled LDR: ");
    Serial.println(ldrValue, 1);
    
    // Step 2: Check WiFi is still connected
    if (WiFi.status() != WL_CONNECTED) {
        Serial.println("[WARN] WiFi disconnected! Reconnecting...");
        WiFi.reconnect();
        delay(3000);
        return;
    }
    
    // Step 3: Build JSON payload
    StaticJsonDocument<200> doc;
    doc["device_id"] = DEVICE_ID;
    doc["ldr_value"] = round(ldrValue * 100) / 100.0;  // 2 decimal places
    
    String jsonPayload;
    serializeJson(doc, jsonPayload);
    
    // Step 4: Send HTTP POST to backend
    HTTPClient http;
    http.begin(API_URL);
    http.addHeader("Content-Type", "application/json");
    http.setTimeout(5000);  // 5 second timeout
    
    Serial.print("[POST] Sending: ");
    Serial.println(jsonPayload);
    
    int httpCode = http.POST(jsonPayload);
    
    // Step 5: Handle response
    if (httpCode > 0) {
        String response = http.getString();
        Serial.print("[RESP] HTTP ");
        Serial.print(httpCode);
        Serial.print(" | ");
        
        // Parse response to show anomaly status
        StaticJsonDocument<512> respDoc;
        DeserializationError error = deserializeJson(respDoc, response);
        
        if (!error) {
            bool isAnomaly = respDoc["is_anomaly"];
            float score = respDoc["anomaly_score"];
            const char* status = respDoc["status"];
            
            if (isAnomaly) {
                Serial.print("!! ANOMALY DETECTED !! ");
            } else {
                Serial.print("   Normal            ");
            }
            Serial.print("Score: ");
            Serial.print(score, 1);
            Serial.print(" | Status: ");
            Serial.println(status);
        } else {
            Serial.println(response);
        }
    } else {
        Serial.print("[ERROR] HTTP POST failed, code: ");
        Serial.println(httpCode);
        Serial.println("[ERROR] Check if backend is running and URL is correct.");
    }
    
    http.end();
    
    Serial.println("---");
    delay(SEND_INTERVAL);
}
