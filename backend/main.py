"""
FastAPI Backend - AI Anomaly Detection System
==============================================
Production-grade REST API for Render deployment
Self-sustaining: trains ML model in-memory + auto-generates live sensor data
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
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
from pathlib import Path

import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler

# ============================================================
# FastAPI Application
# ============================================================

app = FastAPI(
    title="AI Anomaly Detection API",
    description="Production-grade anomaly detection for IoT sensors",
    version="3.0.0"
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
    device_id: str
    ldr_value: float
    timestamp: Optional[str] = None

class AnomalyResponse(BaseModel):
    sensor_reading: float
    is_anomaly: bool
    anomaly_score: float
    status: str
    expected_range: Dict[str, float]

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

def init_database():
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS sensor_readings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            device_id TEXT NOT NULL,
            ldr_value REAL NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            is_anomaly BOOLEAN DEFAULT 0,
            anomaly_score REAL DEFAULT 0
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS alerts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            device_id TEXT NOT NULL,
            ldr_value REAL NOT NULL,
            anomaly_score REAL NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            alert_type TEXT,
            status TEXT DEFAULT 'active'
        )
    """)
    conn.commit()
    conn.close()
    print("✓ Database initialized")

def store_reading(device_id, ldr_value, is_anomaly, anomaly_score):
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    cursor.execute("INSERT INTO sensor_readings (device_id, ldr_value, is_anomaly, anomaly_score) VALUES (?, ?, ?, ?)",
                   (device_id, ldr_value, is_anomaly, anomaly_score))
    conn.commit()
    conn.close()

def store_alert(device_id, ldr_value, anomaly_score, alert_type):
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    cursor.execute("INSERT INTO alerts (device_id, ldr_value, anomaly_score, alert_type) VALUES (?, ?, ?, ?)",
                   (device_id, ldr_value, anomaly_score, alert_type))
    conn.commit()
    conn.close()

# ============================================================
# ML Model — Trained In-Memory at Startup
# ============================================================

model = None
scaler = None
model_loaded = False
start_time = datetime.now()

def train_model_in_memory():
    """Train Isolation Forest on synthetic LDR data — no .pkl file needed."""
    global model, scaler, model_loaded
    try:
        # Generate realistic synthetic training data
        np.random.seed(42)
        normal_data = np.random.normal(loc=500, scale=100, size=800)       # Normal LDR ~300-700
        anomaly_low = np.random.uniform(low=0, high=80, size=50)           # Anomaly: very low
        anomaly_high = np.random.uniform(low=920, high=1023, size=50)      # Anomaly: very high
        wide_variance = np.random.normal(loc=500, scale=250, size=100)     # Wide variance

        all_data = np.concatenate([normal_data, anomaly_low, anomaly_high, wide_variance])
        all_data = np.clip(all_data, 0, 1023).reshape(-1, 1)

        # Fit scaler
        scaler = StandardScaler()
        scaled_data = scaler.fit_transform(all_data)

        # Train Isolation Forest
        model = IsolationForest(
            n_estimators=100,
            contamination=0.1,
            random_state=42,
            max_samples='auto'
        )
        model.fit(scaled_data)
        model_loaded = True
        print("✓ Isolation Forest model trained in-memory (1000 synthetic samples)")
        return True
    except Exception as e:
        print(f"❌ Model training failed: {e}")
        model_loaded = False
        return False

def predict_anomaly(value):
    """Run anomaly detection on a single LDR value."""
    if model and scaler and model_loaded:
        try:
            features = np.array([[value]])
            scaled = scaler.transform(features)
            prediction = model.predict(scaled)[0]
            score = -model.score_samples(scaled)[0]
            is_anomaly = prediction == -1
            anomaly_score = min(max(score * 100, 0), 100)
            return {
                "sensor_reading": value,
                "is_anomaly": bool(is_anomaly),
                "anomaly_score": round(anomaly_score, 2),
                "status": "ANOMALY" if is_anomaly else "NORMAL",
                "expected_range": {"min": 200, "max": 800}
            }
        except Exception as e:
            print(f"Prediction error: {e}")

    # Fallback threshold detection
    is_anomaly = value < 100 or value > 900
    return {
        "sensor_reading": value,
        "is_anomaly": is_anomaly,
        "anomaly_score": 85.0 if is_anomaly else 15.0,
        "status": "ANOMALY" if is_anomaly else "NORMAL",
        "expected_range": {"min": 100, "max": 900}
    }

# ============================================================
# Background Data Simulator
# ============================================================

simulator_running = False
simulator_thread = None
DEVICE_IDS = ["ESP32_001", "ESP32_002", "NEXUS_EDGE_01"]

def generate_sensor_reading():
    """Generate a realistic LDR sensor value."""
    if random.random() < 0.80:
        # Normal reading (80% of time)
        value = random.gauss(500, 80)
    else:
        # Anomaly reading (20% of time)
        value = random.choice([
            random.uniform(0, 80),       # Very low (anomaly)
            random.uniform(920, 1023),   # Very high (anomaly)
            random.gauss(500, 200)       # Wide variance
        ])
    return max(0, min(1023, round(value, 2)))

def simulator_loop():
    """Background thread that continuously generates sensor data."""
    global simulator_running
    print("🔄 Background simulator started — generating live sensor data")
    while simulator_running:
        try:
            device_id = random.choice(DEVICE_IDS)
            ldr_value = generate_sensor_reading()

            result = predict_anomaly(ldr_value)
            is_anomaly = result["is_anomaly"]
            anomaly_score = result["anomaly_score"]

            store_reading(device_id, ldr_value, is_anomaly, anomaly_score)

            if is_anomaly:
                alert_type = "SPIKE" if ldr_value > 700 else "DIP" if ldr_value < 200 else "ANOMALY"
                store_alert(device_id, ldr_value, anomaly_score, alert_type)

            status_icon = "🔴 ANOMALY" if is_anomaly else "🟢 NORMAL"
            print(f"{status_icon} | {device_id} | LDR: {ldr_value:.1f} | Score: {anomaly_score:.1f}")

        except Exception as e:
            print(f"⚠️ Simulator error: {e}")

        time.sleep(3)  # One reading every 3 seconds

    print("⏹ Background simulator stopped")

def start_simulator():
    """Start the background data simulator."""
    global simulator_running, simulator_thread
    if simulator_running:
        return False  # Already running
    simulator_running = True
    simulator_thread = threading.Thread(target=simulator_loop, daemon=True)
    simulator_thread.start()
    return True

def stop_simulator():
    """Stop the background data simulator."""
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
    print("✓ API startup complete — model trained, simulator active")

@app.get("/", tags=["Health"])
async def root():
    return {
        "service": "AI Anomaly Detection API",
        "version": "3.0.0",
        "status": "running",
        "model_loaded": model_loaded,
        "simulator_active": simulator_running
    }

@app.get("/health", tags=["Health"])
async def health_check():
    uptime = datetime.now() - start_time
    conn = sqlite3.connect(DATABASE_PATH)
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
    store_reading(reading.device_id, reading.ldr_value, False, 0)
    return {
        "status": "accepted",
        "device_id": reading.device_id,
        "ldr_value": reading.ldr_value,
        "timestamp": reading.timestamp or datetime.now().isoformat()
    }

@app.post("/detect-anomaly", tags=["Detection"])
async def detect_anomaly(reading: SensorReading):
    result = predict_anomaly(reading.ldr_value)
    store_reading(reading.device_id, reading.ldr_value, result["is_anomaly"], result["anomaly_score"])
    if result["is_anomaly"]:
        alert_type = "SPIKE" if reading.ldr_value > 700 else "DIP" if reading.ldr_value < 200 else "ANOMALY"
        store_alert(reading.device_id, reading.ldr_value, result["anomaly_score"], alert_type)
    return result

@app.get("/alerts/recent", tags=["Alerts"])
async def get_recent_alerts(limit: int = 10):
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM alerts WHERE status = 'active' ORDER BY timestamp DESC LIMIT ?", (limit,))
    alerts = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return {"total_active_alerts": len(alerts), "alerts": alerts}

@app.get("/history", tags=["Data"])
async def get_history(device_id: Optional[str] = None, limit: int = 100):
    conn = sqlite3.connect(DATABASE_PATH)
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
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM sensor_readings")
    total_readings = cursor.fetchone()[0]
    cursor.execute("SELECT COUNT(*) FROM sensor_readings WHERE is_anomaly = 1")
    total_anomalies = cursor.fetchone()[0]
    cursor.execute("SELECT COUNT(DISTINCT device_id) FROM sensor_readings")
    device_count = cursor.fetchone()[0]
    cursor.execute("""
        SELECT COUNT(*) as total, SUM(CASE WHEN is_anomaly = 1 THEN 1 ELSE 0 END) as anomalies
        FROM sensor_readings WHERE timestamp > datetime('now', '-1 hour')
    """)
    recent = cursor.fetchone()
    recent_total = recent[0] if recent[0] else 0
    recent_anomalies = recent[1] if recent[1] else 0
    recent_rate = (recent_anomalies / recent_total * 100) if recent_total > 0 else 0
    cursor.execute("SELECT AVG(ldr_value), MIN(ldr_value), MAX(ldr_value) FROM sensor_readings")
    stats = cursor.fetchone()
    conn.close()
    return {
        "total_readings": total_readings,
        "total_anomalies": total_anomalies,
        "anomaly_rate": f"{(total_anomalies/total_readings*100):.2f}%" if total_readings > 0 else "0%",
        "device_count": device_count,
        "recent_hour": {"readings": recent_total, "anomalies": recent_anomalies, "anomaly_rate": f"{recent_rate:.2f}%"},
        "sensor_stats": {
            "average_value": float(stats[0] or 0),
            "min_value": float(stats[1] or 0),
            "max_value": float(stats[2] or 0)
        },
        "model_info": {"is_trained": model_loaded, "algorithm": "Isolation Forest"}
    }

@app.delete("/alerts/{alert_id}", tags=["Alerts"])
async def dismiss_alert(alert_id: int):
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    cursor.execute("UPDATE alerts SET status = 'dismissed' WHERE id = ?", (alert_id,))
    conn.commit()
    conn.close()
    return {"status": "alert dismissed", "alert_id": alert_id}

# ============================================================
# Simulator Control Endpoints
# ============================================================

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
