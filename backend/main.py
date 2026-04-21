"""
FastAPI Backend - AI Anomaly Detection System (Smart Irrigation)
==============================================
Production-grade REST API for Render deployment
Self-sustaining: trains ML model in-memory + auto-generates live sensor data
Now updated for Multivariate input (Temperature, Humidity, Soil Moisture)
"""

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Optional, Dict
import sqlite3
from datetime import datetime
import json
import os
import sys
import random
import threading
import time
import asyncio
from pathlib import Path

import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler

# ============================================================
# FastAPI Application
# ============================================================

app = FastAPI(
    title="AI Anomaly Detection API - Irrigation System",
    description="Multivariate real-time anomaly detection for IoT sensors",
    version="4.5.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================
# Data Models
# ============================================================

class SensorReading(BaseModel):
    device_id: str = "ESP32_IRRIG_001"
    temperature: float
    humidity: float
    soil_moisture: float
    timestamp: Optional[str] = None

class AnomalyResponse(BaseModel):
    sensor_reading: Dict[str, float]
    is_anomaly: bool
    anomaly_score: float
    status: str
    expected_ranges: Dict[str, Dict[str, float]]

class SystemStatus(BaseModel):
    model_loaded: bool
    database_connected: bool
    total_readings: int
    total_anomalies: int
    uptime: str

# ============================================================
# Database
# ============================================================

BASE_DIR = Path(__file__).parent
DATABASE_PATH = str(BASE_DIR / "sensor_data.db")

def get_db():
    conn = sqlite3.connect(DATABASE_PATH, timeout=10)
    conn.execute("PRAGMA journal_mode=WAL")
    return conn

def init_database():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS sensor_readings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            device_id TEXT NOT NULL,
            temperature REAL NOT NULL,
            humidity REAL NOT NULL,
            soil_moisture REAL NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            is_anomaly BOOLEAN DEFAULT 0,
            anomaly_score REAL DEFAULT 0
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS alerts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            device_id TEXT NOT NULL,
            temperature REAL NOT NULL,
            humidity REAL NOT NULL,
            soil_moisture REAL NOT NULL,
            anomaly_score REAL NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            alert_type TEXT,
            status TEXT DEFAULT 'active'
        )
    """)
    conn.commit()
    conn.close()
    print("[OK] Database initialized")

def store_reading(device_id, temp, hum, soil, is_anomaly, anomaly_score):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO sensor_readings (device_id, temperature, humidity, soil_moisture, is_anomaly, anomaly_score) VALUES (?, ?, ?, ?, ?, ?)",
        (device_id, temp, hum, soil, is_anomaly, anomaly_score)
    )
    conn.commit()
    conn.close()

def store_alert(device_id, temp, hum, soil, anomaly_score, alert_type):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO alerts (device_id, temperature, humidity, soil_moisture, anomaly_score, alert_type) VALUES (?, ?, ?, ?, ?, ?)",
        (device_id, temp, hum, soil, anomaly_score, alert_type)
    )
    conn.commit()
    conn.close()

# ============================================================
# ML Model — Multivariate Output
# ============================================================

model = None
scaler = None
model_loaded = False
start_time = datetime.now()

def train_model_in_memory(data=None):
    """Train Isolation Forest on 3D data (Temp, Hum, Soil)."""
    global model, scaler, model_loaded
    try:
        if data is not None and len(data) >= 50:
            all_data = np.array(data)
            print(f"[ML] Training on {len(data)} real sensor readings...")
        else:
            np.random.seed(42)
            # Normal data: Temp ~25C, Hum ~60%, Soil ~500 (analog arbitrary range)
            normal_t = np.random.normal(loc=25, scale=5, size=800)
            normal_h = np.random.normal(loc=60, scale=10, size=800)
            normal_s = np.random.normal(loc=500, scale=100, size=800)
            normal_data = np.column_stack((normal_t, normal_h, normal_s))
            
            # Anomalies (High Temp, Low Hum, Low Soil -> Fire/Desert condition)
            anom1_t = np.random.uniform(35, 50, size=50)
            anom1_h = np.random.uniform(10, 30, size=50)
            anom1_s = np.random.uniform(0, 200, size=50)
            anom1_data = np.column_stack((anom1_t, anom1_h, anom1_s))

            # Anomalies (Low Temp, High Hum, Maxed Soil -> Flood/Frost condition)
            anom2_t = np.random.uniform(0, 10, size=50)
            anom2_h = np.random.uniform(85, 100, size=50)
            anom2_s = np.random.uniform(850, 1023, size=50)
            anom2_data = np.column_stack((anom2_t, anom2_h, anom2_s))

            all_data = np.vstack([normal_data, anom1_data, anom2_data])
            # Bound clipping
            all_data[:,0] = np.clip(all_data[:,0], -10, 60)   # Temp
            all_data[:,1] = np.clip(all_data[:,1], 0, 100)    # Hum
            all_data[:,2] = np.clip(all_data[:,2], 0, 1023)   # Soil
            print("[ML] Training on 900 synthetic 3D samples...")

        scaler = StandardScaler()
        scaled_data = scaler.fit_transform(all_data)

        model = IsolationForest(
            n_estimators=100,
            contamination=0.1,
            random_state=42,
            max_samples='auto'
        )
        model.fit(scaled_data)
        model_loaded = True
        print("[OK] Multivariate Isolation Forest model trained successfully")
        return True
    except Exception as e:
        print(f"[ERROR] Model training failed: {e}")
        model_loaded = False
        return False

def predict_anomaly(temp, hum, soil):
    """Run anomaly detection on the 3D data point."""
    if model and scaler and model_loaded:
        try:
            features = np.array([[temp, hum, soil]])
            scaled = scaler.transform(features)
            prediction = model.predict(scaled)[0]
            score = -model.score_samples(scaled)[0]
            is_anomaly = prediction == -1
            anomaly_score = min(max(score * 100, 0), 100)
            return {
                "sensor_reading": {"temperature": temp, "humidity": hum, "soil_moisture": soil},
                "is_anomaly": bool(is_anomaly),
                "anomaly_score": round(anomaly_score, 2),
                "status": "ANOMALY" if is_anomaly else "NORMAL",
                "expected_ranges": {
                    "temperature": {"min": 15, "max": 35},
                    "humidity": {"min": 40, "max": 80},
                    "soil": {"min": 300, "max": 700}
                }
            }
        except Exception as e:
            print(f"Prediction error: {e}")

    # Fallback rules
    is_anomaly = temp > 40 or soil < 100
    return {
        "sensor_reading": {"temperature": temp, "humidity": hum, "soil_moisture": soil},
        "is_anomaly": is_anomaly,
        "anomaly_score": 85.0 if is_anomaly else 15.0,
        "status": "ANOMALY" if is_anomaly else "NORMAL",
        "expected_ranges": {
            "temperature": {"min": 15, "max": 35},
            "humidity": {"min": 40, "max": 80},
            "soil": {"min": 300, "max": 700}
        }
    }

# ============================================================
# Background Data Simulator
# ============================================================

simulator_running = False
simulator_thread = None
DEVICE_IDS = ["ESP32_IRRIG_01"]

latest_alert_id = 0

def generate_sensor_readings():
    """Generate multivariate smart irrigation data."""
    if random.random() < 0.85:
        t = random.gauss(25, 2)
        h = random.gauss(60, 5)
        s = random.gauss(550, 50)
    else:
        # Simulate drought spike
        if random.random() < 0.5:
            t = random.gauss(42, 3)
            h = random.gauss(20, 5)
            s = random.gauss(50, 20)
        else:
            # Simulate flood spike
            t = random.gauss(15, 3)
            h = random.gauss(95, 5)
            s = random.gauss(950, 50)
            
    return (
        round(max(-10, min(60, t)), 1),
        round(max(0, min(100, h)), 1),
        round(max(0, min(1023, s)), 0)
    )

def simulator_loop():
    global simulator_running, latest_alert_id
    print("[SIM] Background simulator started")
    while simulator_running:
        try:
            device_id = random.choice(DEVICE_IDS)
            t, h, s = generate_sensor_readings()

            result = predict_anomaly(t, h, s)
            is_anomaly = result["is_anomaly"]
            anomaly_score = result["anomaly_score"]

            store_reading(device_id, t, h, s, is_anomaly, anomaly_score)

            if is_anomaly:
                if s < 200:
                    alert_type = "DROUGHT"
                elif s > 800:
                    alert_type = "FLOOD"
                elif t > 40:
                    alert_type = "HEATWAVE"
                else:
                    alert_type = "ANOMALY"
                    
                store_alert(device_id, t, h, s, anomaly_score, alert_type)
                
                conn = get_db()
                cursor = conn.cursor()
                cursor.execute("SELECT MAX(id) FROM alerts")
                row = cursor.fetchone()
                if row and row[0]:
                    latest_alert_id = row[0]
                conn.close()

            tag = "!! ANOMALY" if is_anomaly else "   NORMAL "
            print(f"[{tag}] {device_id} | T:{t}C H:{h}% S:{s} | Score: {anomaly_score:.1f}")

        except Exception as e:
            print(f"[WARN] Simulator error: {e}")

        time.sleep(3)

    print("[SIM] Background simulator stopped")

def start_simulator():
    global simulator_running, simulator_thread
    if simulator_running:
        return False
    simulator_running = True
    simulator_thread = threading.Thread(target=simulator_loop, daemon=True)
    simulator_thread.start()
    return True

def stop_simulator():
    global simulator_running
    if not simulator_running:
        return False
    simulator_running = False
    return True

# ============================================================
# API Endpoints
# ============================================================

@app.on_event("startup")
async def startup_event():
    init_database()
    train_model_in_memory()
    start_simulator()
    print("[OK] API startup complete — model trained, simulator active")

@app.get("/", tags=["Health"])
async def root():
    return {
        "service": "AI Anomaly Detection API - Irrigation",
        "version": "4.5.0",
        "status": "running",
        "model_loaded": model_loaded,
        "simulator_active": simulator_running
    }

@app.get("/health", tags=["Health"])
async def health_check():
    uptime = datetime.now() - start_time
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM sensor_readings")
    total_readings = cursor.fetchone()[0]
    cursor.execute("SELECT COUNT(*) FROM alerts WHERE status = 'active'")
    active_alerts = cursor.fetchone()[0]
    conn.close()
    return SystemStatus(
        model_loaded=model_loaded,
        database_connected=True,
        total_readings=total_readings,
        total_anomalies=active_alerts,
        uptime=str(uptime).split('.')[0]
    )

@app.post("/ingest-data", tags=["Data Ingestion"])
async def ingest_sensor_data(reading: SensorReading):
    store_reading(reading.device_id, reading.temperature, reading.humidity, reading.soil_moisture, False, 0)
    return {
        "status": "accepted",
        "device_id": reading.device_id,
        "reading": {"temp": reading.temperature, "hum": reading.humidity, "soil": reading.soil_moisture},
        "timestamp": reading.timestamp or datetime.now().isoformat()
    }

@app.post("/detect-anomaly", tags=["Detection"])
async def detect_anomaly(reading: SensorReading):
    global latest_alert_id
    result = predict_anomaly(reading.temperature, reading.humidity, reading.soil_moisture)
    store_reading(reading.device_id, reading.temperature, reading.humidity, reading.soil_moisture, result["is_anomaly"], result["anomaly_score"])
    
    if result["is_anomaly"]:
        s = reading.soil_moisture
        t = reading.temperature
        if s < 200: alert_type = "DROUGHT"
        elif s > 800: alert_type = "FLOOD"
        elif t > 40: alert_type = "HEATWAVE"
        else: alert_type = "ANOMALY"
        
        store_alert(reading.device_id, reading.temperature, reading.humidity, reading.soil_moisture, result["anomaly_score"], alert_type)
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT MAX(id) FROM alerts")
        row = cursor.fetchone()
        if row and row[0]:
            latest_alert_id = row[0]
        conn.close()
    return result

@app.get("/alerts/recent", tags=["Alerts"])
async def get_recent_alerts(limit: int = 10):
    conn = get_db()
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM alerts WHERE status = 'active' ORDER BY timestamp DESC LIMIT ?", (limit,))
    alerts = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return {"total_active_alerts": len(alerts), "alerts": alerts}

@app.get("/history", tags=["Data"])
async def get_history(device_id: Optional[str] = None, limit: int = 100):
    conn = get_db()
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    if device_id:
        cursor.execute("SELECT * FROM sensor_readings WHERE device_id = ? ORDER BY timestamp DESC LIMIT ?", (device_id, limit))
    else:
        cursor.execute("SELECT * FROM sensor_readings ORDER BY timestamp DESC LIMIT ?", (limit,))
    readings = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return {"total_readings": len(readings), "readings": readings[::-1]}

@app.get("/stats", tags=["Analytics"])
async def get_statistics():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM sensor_readings")
    total_readings = cursor.fetchone()[0]
    cursor.execute("SELECT COUNT(*) FROM sensor_readings WHERE is_anomaly = 1")
    total_anomalies = cursor.fetchone()[0]
    cursor.execute("SELECT COUNT(DISTINCT device_id) FROM sensor_readings")
    device_count = cursor.fetchone()[0]
    cursor.execute("SELECT AVG(temperature), AVG(humidity), AVG(soil_moisture) FROM sensor_readings")
    stats = cursor.fetchone()
    conn.close()
    return {
        "total_readings": total_readings,
        "total_anomalies": total_anomalies,
        "anomaly_rate": f"{(total_anomalies/total_readings*100):.2f}%" if total_readings > 0 else "0%",
        "device_count": device_count,
        "sensor_stats": {
            "avg_temp": float(stats[0] or 0),
            "avg_hum": float(stats[1] or 0),
            "avg_soil": float(stats[2] or 0)
        },
        "model_info": {"is_trained": model_loaded, "algorithm": "Multivariate Isolation Forest"},
        "simulator_active": simulator_running
    }

@app.delete("/alerts/{alert_id}", tags=["Alerts"])
async def dismiss_alert(alert_id: int):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("UPDATE alerts SET status = 'dismissed' WHERE id = ?", (alert_id,))
    conn.commit()
    conn.close()
    return {"status": "alert dismissed", "alert_id": alert_id}

@app.post("/clear-data", tags=["Admin"])
async def clear_all_data():
    global latest_alert_id
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM sensor_readings")
    cursor.execute("DELETE FROM alerts")
    conn.commit()
    conn.close()
    latest_alert_id = 0
    return {"status": "cleared", "message": "All readings and alerts wiped."}

@app.post("/train", tags=["ML"])
async def retrain_model():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT temperature, humidity, soil_moisture FROM sensor_readings ORDER BY timestamp DESC LIMIT 2000")
    rows = cursor.fetchall()
    conn.close()

    if len(rows) < 50:
        return {"status": "insufficient_data", "message": f"Need at least 50 readings. Currently have {len(rows)}."}

    real_data = [[r[0], r[1], r[2]] for r in rows]
    success = train_model_in_memory(data=real_data)
    return {
        "status": "retrained" if success else "failed",
        "samples_used": len(real_data),
        "message": f"Model retrained on {len(real_data)} real sensor readings." if success else "Retraining failed."
    }

@app.get("/alerts/stream", tags=["Alerts"])
async def alert_stream():
    async def event_generator():
        last_seen = latest_alert_id
        while True:
            if latest_alert_id > last_seen:
                conn = get_db()
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                cursor.execute("SELECT * FROM alerts WHERE id > ? AND status = 'active' ORDER BY id ASC", (last_seen,))
                new_alerts = [dict(row) for row in cursor.fetchall()]
                conn.close()
                for alert in new_alerts:
                    yield f"data: {json.dumps(alert)}\n\n"
                last_seen = latest_alert_id
            await asyncio.sleep(1)

    return StreamingResponse(event_generator(), media_type="text/event-stream", headers={
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "X-Accel-Buffering": "no"
    })

@app.get("/simulator/status", tags=["Simulator"])
async def simulator_status():
    return {"simulator_running": simulator_running}

@app.post("/simulator/start", tags=["Simulator"])
async def start_sim():
    started = start_simulator()
    return {"status": "started" if started else "already_running", "simulator_running": simulator_running}

@app.post("/simulator/stop", tags=["Simulator"])
async def stop_sim():
    stopped = stop_simulator()
    return {"status": "stopped" if stopped else "already_stopped", "simulator_running": simulator_running}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))
