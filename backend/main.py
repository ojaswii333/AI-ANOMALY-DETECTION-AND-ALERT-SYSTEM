"""
FastAPI Backend - AI Anomaly Detection System
==============================================
Production-grade REST API for Render deployment
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
from pathlib import Path

# Add ML module to path
sys.path.append(str(Path(__file__).parent.parent / "ml"))

try:
    from anomaly_detector import AnomalyDetector
except ImportError:
    AnomalyDetector = None

# ============================================================
# FastAPI Application
# ============================================================

app = FastAPI(
    title="AI Anomaly Detection API",
    description="Production-grade anomaly detection for IoT sensors",
    version="2.0.0"
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
# Global State
# ============================================================

detector = None
model_loaded = False
start_time = datetime.now()

def load_model():
    global detector, model_loaded
    model_path = Path(__file__).parent.parent / "ml" / "models" / "ldr_anomaly_detector.pkl"
    if not model_path.exists():
        print(f"⚠️  Model not found at {model_path}, using fallback detection")
        return False
    try:
        detector = AnomalyDetector()
        detector.load_model(str(model_path))
        model_loaded = True
        print(f"✓ Model loaded from {model_path}")
        return True
    except Exception as e:
        print(f"❌ Error loading model: {e}")
        return False

# ============================================================
# API Endpoints
# ============================================================

@app.on_event("startup")
async def startup_event():
    init_database()
    load_model()
    print("✓ API startup complete")

@app.get("/", tags=["Health"])
async def root():
    return {
        "service": "AI Anomaly Detection API",
        "version": "2.0.0",
        "status": "running",
        "model_loaded": model_loaded
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
    if detector and model_loaded:
        try:
            result = detector.predict(reading.ldr_value)
            store_reading(reading.device_id, reading.ldr_value, result["is_anomaly"], result["anomaly_score"])
            if result["is_anomaly"]:
                alert_type = "SPIKE" if reading.ldr_value > 700 else "DIP" if reading.ldr_value < 200 else "ANOMALY"
                store_alert(reading.device_id, reading.ldr_value, result["anomaly_score"], alert_type)
            return result
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    else:
        # Fallback: simple threshold-based detection
        is_anomaly = reading.ldr_value < 100 or reading.ldr_value > 900
        score = 85.0 if is_anomaly else 15.0
        store_reading(reading.device_id, reading.ldr_value, is_anomaly, score)
        if is_anomaly:
            store_alert(reading.device_id, reading.ldr_value, score, "THRESHOLD")
        return {
            "sensor_reading": reading.ldr_value,
            "is_anomaly": is_anomaly,
            "anomaly_score": score,
            "status": "ANOMALY" if is_anomaly else "NORMAL",
            "expected_range": {"min": 100, "max": 900}
        }

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))
