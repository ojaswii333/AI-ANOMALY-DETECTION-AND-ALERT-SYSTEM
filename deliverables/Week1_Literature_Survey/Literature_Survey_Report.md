# Literature Survey Report
## AI-Based Anomaly Detection System for IoT Sensor Monitoring
**Student**: Ojaswi Anand Sharma | **Mentor**: Dr. Aftab Ahmed Ansari | **Date**: 15 Feb 2026

---

## 1. Introduction

Anomaly detection in IoT sensor networks is a critical research area focused on identifying unusual patterns in real-time data streams. With the rapid proliferation of IoT devices in industrial, security, and environmental monitoring, the need for intelligent, automated anomaly detection has become essential. This literature survey examines existing approaches, identifies research gaps, and defines the objectives for our proposed system.

---

## 2. Anomaly Detection Techniques — A Comparative Study

### 2.1 Statistical Methods
Traditional threshold-based systems use fixed upper/lower bounds to flag anomalies (e.g., if sensor value > 800, trigger alert). While simple to implement, these methods suffer from:
- High false positive rates in noisy environments
- Inability to detect subtle drift or gradual deterioration
- No adaptability to changing "normal" baselines

**Key Paper**: Chandola et al. (2009), "Anomaly Detection: A Survey" — ACM Computing Surveys

### 2.2 Supervised Machine Learning
Algorithms like SVM, Random Forest, and Neural Networks require labeled datasets (normal vs anomaly). While highly accurate when labeled data is available, the key limitation is:
- **Labeled anomaly data is extremely scarce** in industrial IoT settings
- Models must be retrained when new anomaly types emerge

**Key Paper**: Ahmad et al. (2017), "Unsupervised real-time anomaly detection for streaming data" — Neurocomputing

### 2.3 Unsupervised Machine Learning (Our Focus)
These algorithms learn "normal" behavior without labeled data:

| Algorithm | Approach | Pros | Cons |
|-----------|----------|------|------|
| **Isolation Forest** | Isolates anomalies via random partitioning | Fast, scalable, no labels needed | Struggles with very high dimensions |
| **One-Class SVM** | Learns a boundary around normal data | Strong theoretical foundation | Slow on large datasets, kernel selection needed |
| **Autoencoders** | Neural network reconstructs normal data; high reconstruction error = anomaly | Captures complex patterns | Requires significant training data, computationally heavy |
| **DBSCAN** | Density-based clustering | Finds arbitrary shaped clusters | Sensitive to parameter selection |
| **Local Outlier Factor** | Compares local density of a point with neighbors | Good for local anomalies | O(n²) complexity, not real-time friendly |

### 2.4 Why Isolation Forest?
The Isolation Forest algorithm (Liu et al., 2008) is uniquely suited for our use case because:
1. **Unsupervised**: No labeled anomaly data required — critical for IoT deployments
2. **Linear time complexity**: O(n) making it suitable for real-time processing
3. **Anomaly-first approach**: Instead of profiling normal data, it directly isolates anomalies (anomalous points require fewer partitions to isolate)
4. **Low memory footprint**: Can run on edge devices
5. **Sub-millisecond inference**: ~1.2ms per sample

**Key Paper**: Liu, Ting & Zhou (2008), "Isolation Forest" — IEEE International Conference on Data Mining

### 2.5 Real-Time Monitoring Systems
Modern IoT monitoring systems typically follow a pipeline architecture:
- **Edge Layer**: Sensor data acquisition (ESP32, Arduino, Raspberry Pi)
- **Communication Layer**: MQTT, HTTP/REST, WebSocket
- **Processing Layer**: Stream processing with anomaly detection
- **Visualization Layer**: Dashboards with alerting capabilities

**Key Systems Reviewed**:
- AWS IoT Anomaly Detector (cloud-based, high cost)
- Apache Kafka + Spark Streaming (enterprise-scale, complex setup)
- TensorFlow Lite for microcontrollers (limited model support)

---

## 3. Research Gap

| Existing Systems | Limitation |
|-----------------|------------|
| AWS/Azure IoT solutions | Expensive, vendor lock-in, overkill for research |
| Threshold-based monitoring | High false positives, no intelligence |
| Supervised ML approaches | Require labeled anomaly data (unavailable in our domain) |
| Academic prototypes | Lack real-time capability and proper UI/UX |

**Identified Gap**: There is a lack of **lightweight, end-to-end, open-source** anomaly detection systems that combine:
- Unsupervised ML (no labeled data needed)
- Real-time processing capability
- Professional-grade dashboard visualization
- Hardware-ready IoT integration (ESP32)
- Cloud deployment capability

---

## 4. Problem Statement

*"To design and implement a real-time AI-based anomaly detection system for IoT sensor monitoring using the Isolation Forest algorithm, capable of detecting subtle abnormal patterns in LDR sensor data without requiring labeled training data, with a production-grade web dashboard for visualization and alerting."*

---

## 5. Objectives

1. **Develop** an unsupervised anomaly detection model using the Isolation Forest algorithm
2. **Build** a high-performance REST API backend for real-time sensor data ingestion
3. **Create** an interactive, professional-grade web dashboard with live charts and alert management
4. **Implement** a complete IoT pipeline from sensor (ESP32 + LDR) to cloud visualization
5. **Deploy** the system on cloud infrastructure for remote accessibility
6. **Evaluate** detection accuracy, false positive rates, and system latency

---

## 6. References

1. Liu, F. T., Ting, K. M., & Zhou, Z. H. (2008). Isolation Forest. *IEEE International Conference on Data Mining*, 413-422.
2. Chandola, V., Banerjee, A., & Kumar, V. (2009). Anomaly detection: A survey. *ACM Computing Surveys*, 41(3), 1-58.
3. Ahmad, S., et al. (2017). Unsupervised real-time anomaly detection for streaming data. *Neurocomputing*, 262, 134-147.
4. Aggarwal, C. C. (2017). *Outlier Analysis*. Springer, 2nd Edition.
5. Goldstein, M., & Uchida, S. (2016). A comparative evaluation of unsupervised anomaly detection algorithms. *PLOS ONE*, 11(4).
6. Pedregosa, F., et al. (2011). Scikit-learn: Machine Learning in Python. *JMLR*, 12, 2825-2830.
7. ESP32 Technical Reference Manual, Espressif Systems (2023).
8. FastAPI Documentation, Sebastián Ramírez (2024). https://fastapi.tiangolo.com
