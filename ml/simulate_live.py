"""
Simulate live sensor data for demo purposes.
Sends random LDR readings with occasional anomalies to the API.
"""
import requests
import time
import random
import os

API_URL = os.environ.get("API_URL", "http://localhost:8000")

def simulate():
    print(f"🔄 Simulating live sensor data to {API_URL}")
    while True:
        # Normal reading 80% of the time, anomaly 20%
        if random.random() < 0.8:
            value = random.gauss(500, 80)  # Normal range ~340-660
        else:
            value = random.choice([
                random.uniform(0, 80),      # Very low (anomaly)
                random.uniform(920, 1023),   # Very high (anomaly)
                random.gauss(500, 200)       # Wide variance
            ])

        value = max(0, min(1023, value))

        payload = {
            "device_id": "ESP32_001",
            "ldr_value": round(value, 2)
        }

        try:
            res = requests.post(f"{API_URL}/detect-anomaly", json=payload, timeout=5)
            data = res.json()
            status = "🔴 ANOMALY" if data.get("is_anomaly") else "🟢 NORMAL"
            print(f"{status} | LDR: {value:.1f} | Score: {data.get('anomaly_score', 0):.1f}")
        except Exception as e:
            print(f"⚠️ Error: {e}")

        time.sleep(2)

if __name__ == "__main__":
    simulate()
