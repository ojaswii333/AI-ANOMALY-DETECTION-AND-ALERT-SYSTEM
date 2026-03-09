"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, X, Bell, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function AlertCenter({ alerts = [], onDismiss }) {
    return (
        <div className="premium-card h-[600px] flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-anomaly/10 text-anomaly">
                        <Bell size={18} />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-widest font-outfit">Alert Stream</h4>
                        <p className="text-[10px] text-text-muted font-bold">Priority Events</p>
                    </div>
                </div>
                <div className="px-3 py-1 rounded-full bg-white/5 border border-glass-border text-[10px] font-bold text-text-muted">
                    {alerts.length} Active
                </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                <AnimatePresence initial={false}>
                    {alerts.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center opacity-30 text-center px-6">
                            <Clock size={48} className="mb-4" />
                            <p className="text-xs uppercase tracking-[0.2em] font-bold">No anomalies detected in the current stream.</p>
                        </div>
                    ) : (
                        alerts.map((alert) => (
                            <motion.div
                                key={alert.id}
                                layout
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="relative p-4 rounded-xl bg-white/5 border border-anomaly/20 hover:bg-anomaly/5 transition-all group overflow-hidden"
                            >
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-anomaly opacity-50" />
                                <div className="flex items-start justify-between">
                                    <div className="flex gap-4">
                                        <div className="mt-1 text-anomaly">
                                            <ShieldAlert size={16} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-text-main mb-1">Critical Anomaly</p>
                                            <p className="text-[10px] text-text-muted leading-relaxed font-medium">
                                                LDR Value: <span className="text-anomaly">{alert.ldr_value}</span> detected at
                                                <span className="ml-1">{format(new Date(alert.timestamp), 'HH:mm:ss')}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => onDismiss(alert.id)}
                                        className="text-text-muted hover:text-text-main transition-colors p-1"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
