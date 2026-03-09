import sys
import os
from pathlib import Path

# Calculate paths relative to this file (root/api/index.py)
root_dir = Path(__file__).parent.parent
backend_dir = root_dir / "ai-anomaly-system" / "backend"
ml_dir = root_dir / "ai-anomaly-system" / "ml"

# Add directories to sys.path to allow imports to work
sys.path.append(str(backend_dir))
sys.path.append(str(ml_dir))

# Import the FastAPI app from the main backend file
try:
    from main import app
except ImportError as e:
    print(f"Error importing app: {e}")
    # Fallback/Debug info for deployment logs
    print(f"Python Path: {sys.path}")
    print(f"Backend Dir exists: {backend_dir.exists()}")
    raise e
