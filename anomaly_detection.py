import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.ensemble import IsolationForest

# -----------------------------
# STEP 1: CREATE DUMMY LDR DATA
# -----------------------------
np.random.seed(42)

normal_data = np.random.normal(loc=500, scale=30, size=50)
anomaly_data = np.array([50, 900, 1200, 30])

ldr_values = np.concatenate([normal_data, anomaly_data])

data = pd.DataFrame(ldr_values, columns=["LDR_Value"])

# -----------------------------
# STEP 2: TRAIN AI MODEL
# -----------------------------
model = IsolationForest(contamination=0.1, random_state=42)
model.fit(data)

# -----------------------------
# STEP 3: DETECT ANOMALIES
# -----------------------------
data["Anomaly"] = model.predict(data)

# -----------------------------
# STEP 4: ALERT SYSTEM
# -----------------------------
print("---- Anomaly Detection Alerts ----")
for value, status in zip(data["LDR_Value"], data["Anomaly"]):
    if status == -1:
        print(f"🚨 ALERT! Anomaly detected at LDR value: {int(value)}")

# -----------------------------
# STEP 5: VISUALIZATION
# -----------------------------
plt.figure(figsize=(10, 4))
plt.plot(data["LDR_Value"], label="LDR Data")
plt.scatter(
    data.index[data["Anomaly"] == -1],
    data["LDR_Value"][data["Anomaly"] == -1],
    color="red",
    label="Anomaly"
)
plt.title("AI-Based Anomaly Detection (Dummy LDR Data)")
plt.xlabel("Sample Index")
plt.ylabel("LDR Value")
plt.legend()
plt.show()