# AI Anomaly Detection System - Quick Start Guide

## 🚀 Installation (5 minutes)

### Step 1: Install Python Dependencies
```bash
# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux

# Install required packages
pip install -r requirements.txt
```

### Step 2: Train Machine Learning Model
```bash
cd src/ml
python train_model.py

# This will:
# ✓ Generate 300 normal LDR readings
# ✓ Train Isolation Forest model
# ✓ Create test set with injected anomalies
# ✓ Evaluate model performance
# ✓ Save trained model to models/ldr_anomaly_detector.pkl
# ✓ Save evaluation report to data/training_report.json
```

### Step 3: Start Backend API
```bash
cd src/backend
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000

# Output:
# INFO:     Uvicorn running on http://127.0.0.1:8000
# ✓ Database initialized
# ✓ Model loaded successfully
```

### Step 4: Start Frontend (in new terminal)
```bash
cd src/frontend
npm install  # First time only
npm run dev

# Open browser to http://localhost:3000
```

### Step 5: Generate Test Data (in new terminal)
```bash
cd src/ml
python -c "
import sys
sys.path.append('../../')
from data_simulator import LDRSimulator
import requests
import time
import json

sim = LDRSimulator()
readings = sim.generate_normal(duration_seconds=30)

print('📊 Simulating sensor data...')
for reading in readings:
    response = requests.post(
        'http://localhost:8000/ingest-data',
        json=reading
    )
    time.sleep(1)
    
print('✓ Simulation complete')
"
```

---

## 📊 Testing Anomaly Detection

### Method 1: Send HTTP Request (using curl or Postman)

```bash
# Normal reading
curl -X POST http://localhost:8000/detect-anomaly \
  -H "Content-Type: application/json" \
  -d '{"device_id":"ESP32_001","ldr_value":523,"timestamp":"2026-02-27T14:00:00"}'

# Anomaly - Brightness spike
curl -X POST http://localhost:8000/detect-anomaly \
  -H "Content-Type: application/json" \
  -d '{"device_id":"ESP32_001","ldr_value":950,"timestamp":"2026-02-27T14:00:00"}'

# Anomaly - Darkness
curl -X POST http://localhost:8000/detect-anomaly \
  -H "Content-Type: application/json" \
  -d '{"device_id":"ESP32_001","ldr_value":50,"timestamp":"2026-02-27T14:00:00"}'
```

### Method 2: Python Script

```python
import requests

API_URL = "http://localhost:8000"

# Test normal reading
response = requests.post(
    f"{API_URL}/detect-anomaly",
    json={
        "device_id": "ESP32_001",
        "ldr_value": 523,
        "timestamp": "2026-02-27T14:00:00"
    }
)
print("Normal:", response.json())

# Test anomaly
response = requests.post(
    f"{API_URL}/detect-anomaly",
    json={
        "device_id": "ESP32_001",
        "ldr_value": 950,
        "timestamp": "2026-02-27T14:00:00"
    }
)
print("Anomaly:", response.json())
```

### Method 3: Check API Documentation

Visit **http://127.0.0.1:8000/docs** for interactive Swagger UI
- Test all endpoints
- See request/response schemas
- Browse API documentation

---

## 🔌 Hardware Setup (ESP32)

### Components Needed
- ESP32 Development Board
- LDR Sensor (GL5516 or similar)
- 10kΩ Resistor
- 220Ω Resistor
- Status LED
- Jumper wires
- USB cable for ESP32

### Wiring
```
ESP32 GPIO 34 (ADC0) ──┬── LDR Sensor
                       └──[10kΩ]── GND

ESP32 GPIO 2 ──[220Ω]── LED Anode
                LED Cathode ── GND

ESP32 GND ────────────── GND (common)
```

### Flash Firmware

**Using Arduino IDE:**
1. Install ESP32 board support
2. Open `src/firmware/esp32_firmware.ino`
3. Update WiFi credentials:
   ```cpp
   const char* WIFI_SSID = "Your_WiFi";
   const char* WIFI_PASSWORD = "Your_Password";
   const char* API_SERVER = "http://YOUR_PC_IP:8000";
   ```
4. Select board: "ESP32 Dev Module"
5. Click Upload

**Using PlatformIO:**
```bash
cd src/firmware
pio run -t upload
pio device monitor
```

---

## 📊 API Endpoints Quick Reference

### Health Check
```bash
curl http://localhost:8000/health
```

### Ingest Data
```bash
curl -X POST http://localhost:8000/ingest-data \
  -H "Content-Type: application/json" \
  -d '{"device_id":"ESP32_001","ldr_value":523}'
```

### Detect Anomaly
```bash
curl -X POST http://localhost:8000/detect-anomaly \
  -H "Content-Type: application/json" \
  -d '{"device_id":"ESP32_001","ldr_value":950}'
```

### Get Recent Alerts
```bash
curl http://localhost:8000/alerts/recent?limit=10
```

### Get Statistics
```bash
curl http://localhost:8000/stats
```

### Get Historical Data
```bash
curl http://localhost:8000/history?limit=50
```

### Export CSV
```bash
curl http://localhost:8000/export/csv?days=7 > sensor_data.csv
```

---

## 🔍 Troubleshooting

### Backend won't start
```bash
# Check if port 8000 is in use
netstat -ano | findstr :8000  # Windows
lsof -i :8000                  # macOS/Linux

# Kill process using port
taskkill /PID <PID> /F  # Windows
```

### Model not loading
```bash
# Verify model file exists
ls models/ldr_anomaly_detector.pkl

# Retrain if missing
cd src/ml
python train_model.py
```

### Frontend won't connect to API
- Check API is running on http://localhost:8000
- Check CORS is enabled (should be in main.py)
- Open browser console (F12) to see exact error

### ESP32 won't connect to WiFi
- Verify WiFi credentials in firmware
- Check WiFi network is 2.4GHz (ESP32 doesn't support 5GHz)
- Check firewall isn't blocking connections
- Verify API server IP is accessible from ESP32

### No data appearing in dashboard
1. Check API is running (visit http://localhost:8000/docs)
2. Send test data: `curl http://localhost:8000/ingest-data ...`
3. Check database: `sqlite3 sensor_data.db "SELECT COUNT(*) FROM sensor_readings;"`

---

## 📈 Performance Metrics

### Expected Performance
- **Model inference:** <5ms per reading
- **API response time:** <50ms (p99)
- **Data ingestion rate:** 100+ readings/second
- **Database queries:** <20ms
- **Frontend update latency:** <500ms

### Load Testing
```bash
# Install Apache Bench
pip install ab

# Test 1000 requests
ab -n 1000 -c 10 http://localhost:8000/health

# Expected: >95% requests complete in <50ms
```

---

## 🎯 Success Indicators

✓ Backend running without errors
✓ Model loaded successfully  
✓ Frontend dashboard loads
✓ Test data appears in real-time chart
✓ Anomalies detected when LDR value >700 or <200
✓ Alerts appear in Alert Center
✓ API documentation visible at http://localhost:8000/docs

---

## 📚 Next Steps

1. **Customize for your environment:**
   - Adjust contamination parameter in `anomaly_detector.py`
   - Calibrate normal LDR range for your specific sensor
   - Modify alert thresholds in `main.py`

2. **Deploy to production:**
   - Use Docker containers
   - Deploy to AWS/Google Cloud/Azure
   - Scale to multiple devices
   - Set up HTTPS and authentication

3. **Advanced features:**
   - Implement federated learning for multiple devices
   - Add WebSocket for real-time alerts
   - Create mobile app
   - Integrate with other IoT platforms

4. **Documentation:**
   - Read `docs/COMPLETE_GUIDE.md` for detailed architecture
   - Check `docs/VIVA_PREPARATION.md` for Q&A
   - Review model training report in `data/training_report.json`

---

## 🆘 Getting Help

**Check these files for detailed information:**
- `docs/COMPLETE_GUIDE.md` - Full system documentation
- `docs/API_REFERENCE.md` - API endpoint details
- `src/ml/anomaly_detector.py` - Model documentation
- `src/backend/main.py` - Backend code comments
- `src/frontend/src/components/` - Frontend component docs

**Common Issues:**
- Model training: See `src/ml/train_model.py` comments
- API errors: Check `http://localhost:8000/docs` for schema
- Frontend issues: Check browser console (F12)
- Hardware issues: See `src/firmware/esp32_firmware.ino` comments

---

## ⚡ Commands Cheat Sheet

```bash
# Setup
python -m venv venv && venv\Scripts\activate
pip install -r requirements.txt

# Train model
cd src/ml && python train_model.py

# Start backend
cd src/backend && python -m uvicorn main:app --reload

# Start frontend (new terminal)
cd src/frontend && npm install && npm run dev

# Test API
curl http://localhost:8000/health
curl http://localhost:8000/stats

# Generate test data
python src/ml/data_simulator.py

# Run tests
pytest tests/

# Check database
sqlite3 sensor_data.db ".tables"

# View model info
sqlite3 sensor_data.db "SELECT * FROM sensor_readings LIMIT 5;"
```

---

**Ready to go! 🚀 Dashboard should be live at http://localhost:3000**
