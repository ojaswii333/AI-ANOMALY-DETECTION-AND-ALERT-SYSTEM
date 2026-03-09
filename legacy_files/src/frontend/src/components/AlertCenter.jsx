import React from 'react';
import { Bell, ShieldAlert, X, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AlertCenter = ({ alerts = [], onDismiss }) => {
  return (
    <div className="premium-card h-full min-h-[400px]">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[var(--anomaly-glow)] flex items-center justify-center text-[var(--anomaly)]">
            <Bell size={20} className="animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-bold Outfit">Alert Center</h3>
            <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-bold">Real-time Anomaly Stream</p>
          </div>
        </div>
        <span className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-bold border border-white/5">
          {alerts.length} Active
        </span>
      </div>

      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence>
          {alerts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center opacity-40"
            >
              <ShieldAlert size={48} className="mb-4" />
              <p className="text-sm font-medium">System Clear. No anomalies detected.</p>
            </motion.div>
          ) : (
            alerts.map((alert, idx) => (
              <motion.div
                key={alert.id || idx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative overflow-hidden rounded-xl border border-[var(--anomaly-glow)] bg-[var(--anomaly-glow)] p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold uppercase tracking-widest text-[var(--anomaly)]">
                      {alert.alert_type || 'Anomaly'} Spotted
                    </span>
                    <span className="text-lg font-extrabold Outfit mb-1">
                      LDR Value: {alert.ldr_value}
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1">
                      <Info size={10} />
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onDismiss && onDismiss(alert.id)}
                  className="rounded-lg p-2 hover:bg-white/10 transition-colors"
                >
                  <X size={16} />
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AlertCenter;
