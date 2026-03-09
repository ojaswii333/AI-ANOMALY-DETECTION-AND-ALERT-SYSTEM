"""
Anomaly Detector - Isolation Forest ML Model
"""
import numpy as np
import pickle
from pathlib import Path

class AnomalyDetector:
    def __init__(self):
        self.model = None
        self.scaler = None
        self.is_trained = False

    def load_model(self, path):
        with open(path, 'rb') as f:
            data = pickle.load(f)
        if isinstance(data, dict):
            self.model = data.get('model')
            self.scaler = data.get('scaler')
        else:
            self.model = data
        self.is_trained = True

    def predict(self, value):
        if not self.is_trained or self.model is None:
            # Fallback threshold detection
            is_anomaly = value < 100 or value > 900
            return {
                "sensor_reading": value,
                "is_anomaly": is_anomaly,
                "anomaly_score": 85.0 if is_anomaly else 15.0,
                "status": "ANOMALY" if is_anomaly else "NORMAL",
                "expected_range": {"min": 100, "max": 900}
            }

        try:
            features = np.array([[value]])
            if self.scaler:
                features = self.scaler.transform(features)
            prediction = self.model.predict(features)[0]
            score = -self.model.score_samples(features)[0]
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
            return {
                "sensor_reading": value,
                "is_anomaly": False,
                "anomaly_score": 0,
                "status": "ERROR",
                "expected_range": {"min": 0, "max": 1023}
            }

    def get_model_info(self):
        return {
            "is_trained": self.is_trained,
            "algorithm": "Isolation Forest",
            "type": "Unsupervised Anomaly Detection"
        }
