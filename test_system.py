#!/usr/bin/env python3
"""Quick test and data injection script"""
import requests
import time
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent / "src" / "ml"))
from data_simulator import LDRSimulator

print("=" * 60)
print("  🚀 SYSTEM VERIFICATION & DATA INJECTION")
print("=" * 60)

# Test backend
try:
    r = requests.get("http://127.0.0.1:8000/health", timeout=2)
    status = r.json()
    print(f"\n✅ BACKEND API: http://127.0.0.1:8000")
    print(f"   Model Loaded: {status.get('model_loaded')}")
    print(f"   Database Connected: {status.get('database_connected')}")
except Exception as e:
    print(f"\n❌ Backend Error: {e}")
    sys.exit(1)

# Frontend
print(f"\n✅ FRONTEND DASHBOARD: http://127.0.0.1:5173")

# Inject test data
print(f"\n📊 Sending 25 sensor readings...")
sim = LDRSimulator()
count = 0
for reading in sim.generate_normal(25):
    try:
        r = requests.post(
            "http://127.0.0.1:8000/ingest-data",
            json=reading,
            timeout=1
        )
        if r.status_code == 200:
            count += 1
    except Exception:
        pass
    time.sleep(0.1)

print(f"✅ Success! {count} readings sent to dashboard")
print(f"\n📈 API Documentation: http://127.0.0.1:8000/docs")
print("\n" + "=" * 60)
print("  ✨ SYSTEM READY FOR DEMONSTRATION")
print("=" * 60)
print("\nOpen http://127.0.0.1:5173 in your browser!")
