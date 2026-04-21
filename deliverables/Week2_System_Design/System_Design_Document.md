# System Design Document
## AI-Based Anomaly Detection System for IoT Sensor Monitoring
**Student**: Ojaswi Anand Sharma | **Mentor**: Dr. Aftab Ahmed Ansari | **Date**: 22 Feb 2026

---

## 1. System Architecture

### 1.1 High-Level Architecture
```
┌─────────────────┐     HTTP/REST      ┌─────────────────┐
│  HARDWARE LAYER │ ──────────────────► │  BACKEND LAYER  │
│  ESP32 + LDR    │     JSON Payload    │  FastAPI Server │
│  (IoT Sensor)   │                     │  Port: 8000     │
└─────────────────┘                     └────────┬────────┘
                                                 │
                                        ┌────────▼────────┐
                                        │   AI/ML LAYER   │
                                        │ Isolation Forest │
                                        │  (scikit-learn) │
                                        └────────┬────────┘
                                                 │
                                        ┌────────▼────────┐
                                        │  DATABASE LAYER │
                                        │     SQLite      │
                                        │ sensor_data.db  │
                                        └────────┬────────┘
                                                 │
                                        ┌────────▼────────┐
                                        │ FRONTEND LAYER  │
                                        │   Next.js App   │
                                        │ Real-time UI    │
                                        └─────────────────┘
```

### 1.2 Component Breakdown

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Sensor | ESP32 + LDR | Capture light intensity (0-1023) |
| Communication | HTTP POST (JSON) | Send readings to backend |
| API Server | FastAPI (Python) | Process requests, route to ML model |
| ML Engine | Isolation Forest (scikit-learn) | Detect anomalous patterns |
| Database | SQLite | Store readings, alerts, metrics |
| Dashboard | Next.js + Tailwind CSS | Visualize data, manage alerts |
| Deployment | Vercel + Render | Cloud hosting |

---

## 2. Dataset Selection

### 2.1 Data Source
**LDR (Light Dependent Resistor) Sensor Data**
- **Type**: Time-series analog sensor readings
- **Range**: 0–1023 (10-bit ADC resolution on ESP32)
- **Normal Range**: ~200–800 (ambient indoor light)
- **Anomalous Patterns**:
  - Sudden spike (>900) — direct light exposure / tampering
  - Sudden dip (<100) — sensor covered / malfunction
  - Gradual drift — environmental change
  - Rapid oscillation — electronic interference

### 2.2 Data Format
```json
{
    "device_id": "ESP32_001",
    "ldr_value": 520.5,
    "timestamp": "2026-02-22T14:30:00"
}
```

### 2.3 Training Data Strategy
- Baseline: 500+ normal readings collected over 24-hour period
- The Isolation Forest learns the "shape" of normal data distribution
- No anomaly labels needed (unsupervised)

---

## 3. Algorithm Selection Report

### 3.1 Selected Algorithm: Isolation Forest

**Mathematical Foundation**:
- Randomly selects a feature and a split value
- Recursively partitions data until each point is isolated
- **Key Insight**: Anomalies require fewer splits to isolate (shorter path length)
- Anomaly Score: `s(x,n) = 2^(-E(h(x))/c(n))`
  - Where `h(x)` is the path length and `c(n)` is the average path length

**Hyperparameters**:
| Parameter | Value | Justification |
|-----------|-------|---------------|
| n_estimators | 100 | Sufficient trees for stable results |
| max_samples | 256 | Standard sub-sample size per tree |
| contamination | 0.05 | Expected ~5% anomaly rate |
| max_features | 1.0 | Using all features (1D data) |
| random_state | 42 | Reproducibility |

### 3.2 Why Not Other Algorithms?

| Algorithm | Reason for Rejection |
|-----------|---------------------|
| One-Class SVM | O(n²) training, too slow for real-time retraining |
| Autoencoder | Overkill for 1D data, requires more training data |
| DBSCAN | Parameter-sensitive, not designed for streaming data |
| K-Means | Assumes spherical clusters, poor for anomaly detection |

---

## 4. Alert Mechanism Design

### 4.1 Alert Types
| Alert Type | Trigger Condition | Severity |
|------------|-------------------|----------|
| SPIKE | LDR > 900 | HIGH |
| DIP | LDR < 100 | HIGH |
| ANOMALY | Isolation Forest score > threshold | MEDIUM |
| DRIFT | Gradual baseline shift detected | LOW |

### 4.2 Alert Delivery
- **Primary**: Real-time Dashboard alerts (color-coded cards, live counter)
- **Storage**: SQLite `alerts` table with status tracking (active/dismissed)
- **API Endpoint**: `GET /alerts/recent` returns latest active alerts

### 4.3 Dashboard Alert Flow
```
Anomaly Detected → Store in DB → Dashboard polls /alerts/recent → 
Red alert card appears → User can dismiss → Status updated to 'dismissed'
```

---

## 5. Workflow Diagram

```
[START] → Sensor reads LDR value
       → ESP32 sends HTTP POST to /detect-anomaly
       → FastAPI receives JSON payload
       → Passes LDR value to Isolation Forest model
       → Model returns: {is_anomaly, anomaly_score, status}
       → If anomaly: Store alert in alerts table
       → Store reading in sensor_readings table
       → Return result to caller
       → Dashboard fetches /stats, /history, /alerts every 3s
       → Renders live charts + alert cards
       → User views real-time monitoring dashboard
[END]
```

---

## 6. API Endpoints Design

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/` | System health info |
| GET | `/health` | Detailed health check |
| POST | `/ingest-data` | Store raw sensor reading |
| POST | `/detect-anomaly` | ML detection + storage |
| GET | `/alerts/recent?limit=10` | Active alerts |
| GET | `/history?limit=100` | Historical readings |
| GET | `/stats` | Aggregated statistics |
| DELETE | `/alerts/{id}` | Dismiss an alert |

---

## 7. Database Schema

### sensor_readings
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER PK | Auto-increment |
| device_id | TEXT | ESP32 identifier |
| ldr_value | REAL | Sensor reading |
| timestamp | DATETIME | Auto-generated |
| is_anomaly | BOOLEAN | ML result |
| anomaly_score | REAL | Confidence (0-100) |

### alerts
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER PK | Auto-increment |
| device_id | TEXT | Source device |
| ldr_value | REAL | Triggering value |
| anomaly_score | REAL | Model confidence |
| timestamp | DATETIME | Alert time |
| alert_type | TEXT | SPIKE/DIP/ANOMALY |
| status | TEXT | active/dismissed |
