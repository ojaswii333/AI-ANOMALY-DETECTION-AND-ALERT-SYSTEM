"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, X, Bell, Clock, Info, Flame, Droplets, Droplet } from 'lucide-react';
import { format } from 'date-fns';

const alertTypeConfig = {
    DROUGHT: { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: <Flame size={10} />, label: 'DROUGHT' },
    FLOOD: { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: <Droplets size={10} />, label: 'FLOOD' },
    HEATWAVE: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: <Flame size={10} />, label: 'HEATWAVE' },
    ANOMALY: { color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: <Info size={10} />, label: 'ANOMALY' },
};

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
                <div className={`px-3 py-1 rounded-full border text-[10px] font-bold ${alerts.length > 0
                        ? 'bg-red-500/10 border-red-500/30 text-red-400 animate-pulse'
                        : 'bg-white/5 border-glass-border text-text-muted'
                    }`}>
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
                        alerts.map((alert, idx) => {
                            const typeConfig = alertTypeConfig[alert.alert_type] || alertTypeConfig.ANOMALY;
                            return (
                                <motion.div
                                    key={alert.id}
                                    layout
                                    initial={{ opacity: 0, x: 20, scale: 0.95 }}
                                    animate={{
                                        opacity: 1, x: 0, scale: 1,
                                        boxShadow: idx === 0 ? '0 0 20px -5px rgba(255,46,46,0.2)' : 'none'
                                    }}
                                    exit={{ opacity: 0, x: -20, scale: 0.95 }}
                                    className={`relative p-4 rounded-xl bg-white/5 border border-anomaly/20 hover:bg-anomaly/5 transition-all group overflow-hidden ${idx === 0 ? 'ring-1 ring-red-500/20' : ''
                                        }`}
                                >
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-anomaly opacity-50" />
                                    {idx === 0 && (
                                        <div className="absolute inset-0 bg-red-500/5 animate-pulse rounded-xl pointer-events-none" />
                                    )}
                                    <div className="relative flex items-start justify-between">
                                        <div className="flex gap-4">
                                            <div className="mt-1 text-anomaly">
                                                <ShieldAlert size={16} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <p className="text-xs font-bold text-text-main">Environmental Risk</p>
                                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${typeConfig.bg} ${typeConfig.border} border ${typeConfig.color} text-[8px] font-black uppercase tracking-wider`}>
                                                        {typeConfig.icon}
                                                        {typeConfig.label}
                                                    </span>
                                                </div>
                                                <div className="text-[10px] text-text-muted leading-relaxed font-medium mt-2 grid grid-cols-3 gap-2">
                                                    <div className="bg-white/5 p-1 rounded">T: <span className={alert.temperature > 40 ? 'text-red-400 font-bold' : ''}>{alert.temperature?.toFixed(1)}°C</span></div>
                                                    <div className="bg-white/5 p-1 rounded">H: <span className={alert.humidity < 30 ? 'text-amber-400 font-bold' : ''}>{alert.humidity?.toFixed(1)}%</span></div>
                                                    <div className="bg-white/5 p-1 rounded">SM: <span className={alert.soil_moisture < 200 ? 'text-amber-400 font-bold' : alert.soil_moisture > 800 ? 'text-blue-400 font-bold' : ''}>{alert.soil_moisture?.toFixed(0)}</span></div>
                                                </div>
                                                <p className="text-[9px] text-text-muted/60 mt-2 font-mono">
                                                    Analysis Score: {alert.anomaly_score?.toFixed(1)}% | {format(new Date(alert.timestamp), 'HH:mm:ss')} 
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
                            );
                        })
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
