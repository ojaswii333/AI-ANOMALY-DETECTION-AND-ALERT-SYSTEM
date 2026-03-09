import React from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle2, ShieldAlert } from 'lucide-react';

const RecentReadings = ({ readings = [] }) => {
  return (
    <div className="premium-card">
      <div className="flex items-center justify-between mb-8 px-2">
        <div>
          <h3 className="text-xl font-bold Outfit">Telemetry Log</h3>
          <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-bold">Raw Sensor History</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[var(--success)] animate-pulse" />
          <span className="text-[10px] font-bold tracking-widest uppercase opacity-70">Live Ingest</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5 text-[10px] uppercase tracking-widest font-bold text-[var(--text-muted)]">
              <th className="pb-4 px-4 font-bold">Timestamp</th>
              <th className="pb-4 px-4 font-bold">Device ID</th>
              <th className="pb-4 px-4 font-bold text-right">LDR Value</th>
              <th className="pb-4 px-4 font-bold text-center">AI Analysis</th>
            </tr>
          </thead>
          <tbody className="text-sm font-medium">
            {readings.slice(0, 10).map((reading, idx) => (
              <motion.tr
                key={reading.id || idx}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group border-b border-white/5 hover:bg-white/[0.02]"
              >
                <td className="py-4 px-4 flex items-center gap-2 text-[var(--text-muted)] text-xs">
                  <Clock size={12} />
                  {new Date(reading.timestamp).toLocaleTimeString()}
                </td>
                <td className="py-4 px-4 font-mono text-xs opacity-60">
                  {reading.device_id}
                </td>
                <td className="py-4 px-4 text-right font-bold Outfit">
                  {reading.ldr_value.toFixed(1)}
                </td>
                <td className="py-4 px-4 text-center">
                  <div className={`mx-auto flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${reading.is_anomaly
                      ? 'bg-[var(--anomaly-glow)] text-[var(--anomaly)] border border-[var(--anomaly-glow)]'
                      : 'bg-[var(--success)]/10 text-[var(--success)] border border-[var(--success)]/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]'
                    }`}>
                    {reading.is_anomaly ? <ShieldAlert size={10} /> : <CheckCircle2 size={10} />}
                    {reading.is_anomaly ? 'Anomaly' : 'Clear'}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentReadings;
