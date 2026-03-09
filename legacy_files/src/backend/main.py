"""
FastAPI Backend - AI Anomaly Detection System
==============================================
Production-grade REST API with:
- Real-time anomaly detection
- Alert management
- Historical data storage
- System monitoring
"""

from fastapi import FastAPI, HTTPException, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
import sqlite3
from datetime import datetime, timedelta
import json
import os
import pickle
import sys
from pathlib import Path

# Add ML module to path
sys.path.append(str(Path(__file__).parent.parent / "ml"))
from anomaly_detector import AnomalyDetector

# ============================================================
# FastAPI Application Setup
# ============================================================

app = FastAPI(
    title="AI Anomaly Detection API",
    description="Production-grade anomaly detection system for IoT sensors",
    version="1.0.0"
)

# Enable CORS for frontend communication
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
    """Incoming sensor data from ESP32."""
    device_id: str
    ldr_value: float
    timestamp: Optional[str] = None
    
    class Config:
        example = {
            "device_id": "ESP32_001",
            "ldr_value": 520.5,
            "timestamp": "2026-02-27T10:30:00"
        }


class AnomalyResponse(BaseModel):
    """Anomaly detection result."""
    sensor_reading: float
    is_anomaly: bool
    anomaly_score: float
    status: str
    expected_range: Dict[str, float]


class AlertRecord(BaseModel):
    """Alert notification."""
    device_id: str
    ldr_value: float
    anomaly_score: float
    timestamp: str
    alert_id: str


class SystemStatus(BaseModel):
    """System health status."""
    model_loaded: bool
    database_connected: bool
    total_readings: int
    total_anomalies: int
    uptime: str


# ============================================================
# Database Management
# ============================================================

DATABASE_PATH = "sensor_data.db"


def init_database():
    """Initialize SQLite database with required tables."""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    # Sensor readings table
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
    
    # Alerts table
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
    
    # System metrics
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS system_metrics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            metric_name TEXT NOT NULL,
            metric_value REAL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    conn.commit()
    conn.close()
    print("✓ Database initialized")


def store_reading(device_id: str, ldr_value: float, 
                 is_anomaly: bool, anomaly_score: float):
    """Store sensor reading in database."""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO sensor_readings (device_id, ldr_value, is_anomaly, anomaly_score)
        VALUES (?, ?, ?, ?)
    """, (device_id, ldr_value, is_anomaly, anomaly_score))
    conn.commit()
    conn.close()


def store_alert(device_id: str, ldr_value: float, anomaly_score: float, alert_type: str):
    """Store alert in database."""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO alerts (device_id, ldr_value, anomaly_score, alert_type)
        VALUES (?, ?, ?, ?)
    """, (device_id, ldr_value, anomaly_score, alert_type))
    conn.commit()
    conn.close()


# ============================================================
# Global State
# ============================================================

detector: Optional[AnomalyDetector] = None
model_loaded = False
start_time = datetime.now()


def load_model():
    """Load pre-trained anomaly detection model."""
    global detector, model_loaded
    
    model_path = Path(__file__).parent.parent.parent / "models" / "ldr_anomaly_detector.pkl"
    
    if not model_path.exists():
        print(f"⚠️  Model not found at {model_path}")
        return False
    
    try:
        detector = AnomalyDetector()
        detector.load_model(str(model_path))
        model_loaded = True
        print(f"✓ Model loaded successfully from {model_path}")
        return True
    except Exception as e:
        print(f"❌ Error loading model: {e}")
        return False


# ============================================================
# API Endpoints
# ============================================================

@app.on_event("startup")
async def startup_event():
    """Initialize system on startup."""
    init_database()
    load_model()
    print("✓ API startup complete")


@app.get("/", tags=["Health"])
async def root():
    """Root endpoint - system info."""
    return {
        "service": "AI Anomaly Detection API",
        "version": "1.0.0",
        "status": "running",
        "model_loaded": model_loaded,
        "endpoints": [
            "/health",
            "/ingest-data",
            "/detect-anomaly",
            "/alerts/recent",
            "/history",
            "/stats"
        ]
    }


@app.get("/health", tags=["Health"])
async def health_check():
    """System health check."""
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
    """
    Ingest sensor data from ESP32.
    
    This endpoint receives raw sensor readings and stores them.
    
    Example request:
    ```json
    {
        "device_id": "ESP32_001",
        "ldr_value": 520,
        "timestamp": "2026-02-27T10:30:00"
    }
    ```
    """
    if not model_loaded:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    # Store raw reading
    store_reading(reading.device_id, reading.ldr_value, False, 0)
    
    return {
        "status": "accepted",
        "device_id": reading.device_id,
        "ldr_value": reading.ldr_value,
        "timestamp": reading.timestamp or datetime.now().isoformat()
    }


@app.post("/detect-anomaly", tags=["Detection"])
async def detect_anomaly(reading: SensorReading):
    """
    Perform anomaly detection on sensor reading.
    
    Returns:
    - is_anomaly: True if reading is anomalous
    - anomaly_score: 0-100 confidence score
    - status: "NORMAL" or "ANOMALY"
    """
    if not model_loaded:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    try:
        # Detect anomaly
        result = detector.predict(reading.ldr_value)
        
        # Store in database
        store_reading(
            reading.device_id,
            reading.ldr_value,
            result["is_anomaly"],
            result["anomaly_score"]
        )
        
        # If anomaly detected, create alert
        if result["is_anomaly"]:
            alert_type = "SPIKE" if reading.ldr_value > 700 else "DIP" if reading.ldr_value < 200 else "ANOMALY"
            store_alert(
                reading.device_id,
                reading.ldr_value,
                result["anomaly_score"],
                alert_type
            )
        
        return result
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/alerts/recent", tags=["Alerts"])
async def get_recent_alerts(limit: int = 10):
    """Get recent anomaly alerts."""
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT * FROM alerts
        WHERE status = 'active'
        ORDER BY timestamp DESC
        LIMIT ?
    """, (limit,))
    
    alerts = [dict(row) for row in cursor.fetchall()]
    conn.close()
    
    return {
        "total_active_alerts": len(alerts),
        "alerts": alerts
    }


@app.get("/history", tags=["Data"])
async def get_history(device_id: Optional[str] = None, limit: int = 100):
    """
    Get historical sensor readings.
    
    Optional query parameters:
    - device_id: Filter by specific device
    - limit: Number of recent readings (default: 100)
    """
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    if device_id:
        cursor.execute("""
            SELECT * FROM sensor_readings
            WHERE device_id = ?
            ORDER BY timestamp DESC
            LIMIT ?
        """, (device_id, limit))
    else:
        cursor.execute("""
            SELECT * FROM sensor_readings
            ORDER BY timestamp DESC
            LIMIT ?
        """, (limit,))
    
    readings = [dict(row) for row in cursor.fetchall()]
    conn.close()
    
    return {
        "total_readings": len(readings),
        "readings": readings[::-1]  # Reverse for chronological order
    }


@app.get("/stats", tags=["Analytics"])
async def get_statistics():
    """Get system statistics and analytics."""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    # Total readings
    cursor.execute("SELECT COUNT(*) FROM sensor_readings")
    total_readings = cursor.fetchone()[0]
    
    # Anomalies detected
    cursor.execute("SELECT COUNT(*) FROM sensor_readings WHERE is_anomaly = 1")
    total_anomalies = cursor.fetchone()[0]
    
    # Devices
    cursor.execute("SELECT COUNT(DISTINCT device_id) FROM sensor_readings")
    device_count = cursor.fetchone()[0]
    
    # Recent anomaly rate (last hour)
    cursor.execute("""
        SELECT COUNT(*) as total,
               SUM(CASE WHEN is_anomaly = 1 THEN 1 ELSE 0 END) as anomalies
        FROM sensor_readings
        WHERE timestamp > datetime('now', '-1 hour')
    """)
    recent = cursor.fetchone()
    recent_total = recent[0] if recent[0] else 0
    recent_anomalies = recent[1] if recent[1] else 0
    recent_rate = (recent_anomalies / recent_total * 100) if recent_total > 0 else 0
    
    # Average sensor value
    cursor.execute("SELECT AVG(ldr_value), MIN(ldr_value), MAX(ldr_value) FROM sensor_readings")
    stats = cursor.fetchone()
    avg_value = stats[0] if stats[0] else 0
    min_value = stats[1] if stats[1] else 0
    max_value = stats[2] if stats[2] else 0
    
    conn.close()
    
    return {
        "total_readings": total_readings,
        "total_anomalies": total_anomalies,
        "anomaly_rate": f"{(total_anomalies/total_readings*100):.2f}%" if total_readings > 0 else "0%",
        "device_count": device_count,
        "recent_hour": {
            "readings": recent_total,
            "anomalies": recent_anomalies,
            "anomaly_rate": f"{recent_rate:.2f}%"
        },
        "sensor_stats": {
            "average_value": float(avg_value),
            "min_value": float(min_value),
            "max_value": float(max_value)
        },
        "model_info": detector.get_model_info() if detector else None
    }


@app.get("/export/csv", tags=["Export"])
async def export_csv(days: int = 7):
    """Export historical data as CSV."""
    import csv
    from io import StringIO
    
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT device_id, ldr_value, timestamp, is_anomaly, anomaly_score
        FROM sensor_readings
        WHERE timestamp > datetime('now', '-' || ? || ' days')
        ORDER BY timestamp ASC
    """, (days,))
    
    rows = cursor.fetchall()
    conn.close()
    
    output = StringIO()
    writer = csv.writer(output)
    writer.writerow(["Device ID", "LDR Value", "Timestamp", "Is Anomaly", "Anomaly Score"])
    writer.writerows(rows)
    
    return {
        "status": "success",
        "records": len(rows),
        "data": output.getvalue()
    }


@app.delete("/alerts/{alert_id}", tags=["Alerts"])
async def dismiss_alert(alert_id: int):
    """Dismiss/clear an alert."""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE alerts SET status = 'dismissed'
        WHERE id = ?
    """, (alert_id,))
    conn.commit()
    conn.close()
    
    return {"status": "alert dismissed", "alert_id": alert_id}


# ============================================================
# WebSocket for Real-time Updates (Optional)
# ============================================================

@app.websocket("/ws/live-alerts")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time alert streaming."""
    await websocket.accept()
    try:
        while True:
            # Send recent alerts every 5 seconds
            await asyncio.sleep(5)
            conn = sqlite3.connect(DATABASE_PATH)
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute("""
                SELECT * FROM alerts
                WHERE status = 'active'
                ORDER BY timestamp DESC LIMIT 5
            """)
            alerts = [dict(row) for row in cursor.fetchall()]
            conn.close()
            
            await websocket.send_json({
                "type": "alerts_update",
                "alerts": alerts,
                "timestamp": datetime.now().isoformat()
            })
    except Exception as e:
        print(f"WebSocket error: {e}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
