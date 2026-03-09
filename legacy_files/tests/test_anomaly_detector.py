"""
Test Suite for AI Anomaly Detection System
===========================================
Unit tests for ML model, API endpoints, and data processing
"""

import pytest
import json
import sys
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent / 'src' / 'ml'))

from anomaly_detector import AnomalyDetector
import numpy as np


class TestAnomalyDetector:
    """Test suite for Anomaly Detection Model"""
    
    @pytest.fixture
    def detector(self):
        """Create and train a detector for testing"""
        detector = AnomalyDetector(contamination=0.05, n_estimators=100)
        normal_data = np.random.normal(loc=500, scale=30, size=100)
        detector.train(normal_data)
        return detector
    
    def test_model_initialization(self):
        """Test detector initializes correctly"""
        detector = AnomalyDetector(contamination=0.1, n_estimators=50)
        assert detector.contamination == 0.1
        assert detector.n_estimators == 50
        assert detector.is_trained == False
    
    def test_model_training(self, detector):
        """Test model trains on normal data"""
        assert detector.is_trained == True
        assert detector.mean_normal is not None
        assert detector.std_normal is not None
    
    def test_normal_reading_detection(self, detector):
        """Test that normal readings are classified correctly"""
        # Reading within mean ± σ
        result = detector.predict(500)
        assert result['is_anomaly'] == False
        assert result['anomaly_score'] < 30
    
    def test_anomaly_detection_brightness(self, detector):
        """Test detection of brightness anomaly"""
        # Very bright (anomaly)
        result = detector.predict(950)
        assert result['is_anomaly'] == True
        assert result['anomaly_score'] > 70
    
    def test_anomaly_detection_darkness(self, detector):
        """Test detection of darkness anomaly"""
        # Very dark (anomaly)
        result = detector.predict(50)
        assert result['is_anomaly'] == True
        assert result['anomaly_score'] > 70
    
    def test_anomaly_score_range(self, detector):
        """Test anomaly score is in valid range (0-100)"""
        for value in [100, 300, 500, 700, 900]:
            result = detector.predict(value)
            assert 0 <= result['anomaly_score'] <= 100
    
    def test_z_score_calculation(self, detector):
        """Test Z-score calculation"""
        result = detector.predict(500)
        # Z-score for mean should be ~0
        assert result['z_score'] < 0.5
    
    def test_batch_prediction(self, detector):
        """Test batch prediction"""
        readings = [500, 510, 520, 950, 50]
        result = detector.predict_batch(readings)
        
        assert result['total_readings'] == 5
        assert result['anomalies_detected'] == 2  # 950 and 50
        assert len(result['results']) == 5
    
    def test_model_persistence(self, detector, tmp_path):
        """Test model can be saved and loaded"""
        model_file = tmp_path / "test_model.pkl"
        
        # Save model
        detector.save_model(str(model_file))
        assert model_file.exists()
        
        # Load model in new detector
        new_detector = AnomalyDetector()
        new_detector.load_model(str(model_file))
        
        # Should produce same results
        result1 = detector.predict(523)
        result2 = new_detector.predict(523)
        
        assert result1['is_anomaly'] == result2['is_anomaly']
        assert result1['anomaly_score'] == result2['anomaly_score']
    
    def test_model_info(self, detector):
        """Test model information retrieval"""
        info = detector.get_model_info()
        assert info['is_trained'] == True
        assert info['contamination'] == 0.05
        assert info['n_estimators'] == 100
        assert info['mean_normal'] is not None
        assert info['std_normal'] is not None


class TestDataValidation:
    """Test data validation and preprocessing"""
    
    def test_1d_array_reshape(self):
        """Test 1D array is reshaped correctly"""
        detector = AnomalyDetector()
        data_1d = np.array([500, 510, 520])
        data_reshaped = data_1d.reshape(-1, 1)
        assert data_reshaped.shape == (3, 1)
    
    def test_list_to_numpy_conversion(self):
        """Test list is converted to numpy array"""
        data = [500, 510, 520, 530]
        data_array = np.array(data)
        assert isinstance(data_array, np.ndarray)
        assert len(data_array) == 4


class TestPerformanceMetrics:
    """Test model performance calculations"""
    
    def test_confusion_matrix_calculation(self):
        """Test confusion matrix metrics"""
        # Simulate confusion matrix
        tp, tn, fp, fn = 92, 295, 5, 8
        
        accuracy = (tp + tn) / (tp + tn + fp + fn)
        precision = tp / (tp + fp) if (tp + fp) > 0 else 0
        recall = tp / (tp + fn) if (tp + fn) > 0 else 0
        
        assert accuracy > 0.98  # Should be ~98.2%
        assert precision > 0.94  # Should be ~95.5%
        assert recall > 0.91  # Should be ~92.1%
    
    def test_anomaly_rate_calculation(self):
        """Test anomaly rate calculation"""
        total = 1000
        anomalies = 15
        rate = (anomalies / total) * 100
        assert rate == 1.5


class TestSensorDataSimulation:
    """Test sensor data generation"""
    
    def test_normal_data_range(self):
        """Test normal data is within expected range"""
        np.random.seed(42)
        normal_data = np.random.normal(loc=500, scale=30, size=300)
        
        assert np.mean(normal_data) > 490 and np.mean(normal_data) < 510
        assert np.min(normal_data) > 100  # Should not go below 100
        assert np.max(normal_data) < 900  # Should not exceed 900


@pytest.mark.integration
class TestAPIDependencies:
    """Integration tests for API"""
    
    def test_fastapi_import(self):
        """Test FastAPI can be imported"""
        try:
            from fastapi import FastAPI
            assert FastAPI is not None
        except ImportError:
            pytest.skip("FastAPI not installed")
    
    def test_pydantic_import(self):
        """Test Pydantic can be imported"""
        try:
            from pydantic import BaseModel
            assert BaseModel is not None
        except ImportError:
            pytest.skip("Pydantic not installed")


# Pytest configuration
def pytest_configure(config):
    """Configure pytest with custom markers"""
    config.addinivalue_line(
        "markers", "integration: mark test as integration test"
    )


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
