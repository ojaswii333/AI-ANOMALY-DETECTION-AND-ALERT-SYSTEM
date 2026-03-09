"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, Clock, Info } from 'lucide-react';
import { format } from 'date-fns';

export default function RecentReadings({ readings = [] }) {
    return (
        <div className="premium-card">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest font-outfit">Raw Sensor History</h4>
                    <p className="text-[10px] text-text-muted font-bold">Live Ingest Feed</p>
                </div>
                <div className="p-2 rounded-lg bg-primary/5 border border-primary/20 text-primary">
                    <Info size={16} />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-glass-border">
                            <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-text-muted pl-2">Timestamp</th>
                            <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">LDR Value</th>
                            <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">Analysis</th>
                            <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-text-muted text-right pr-2">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {readings.slice(0, 10).map((reading, i) => (
                            <motion.tr
                                key={reading.id || i}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.05 }}
                                className="group hover:bg-white/5 transition-colors"
                            >
                                <td className="py-4 pl-2">
                                    <div className="flex items-center gap-2">
                                        <Clock size={12} className="text-text-muted" />
                                        <span className="text-xs font-medium text-text-main/80">
                                            {format(new Date(reading.timestamp), 'HH:mm:ss')}
                                        </span>
                                    </div>
                                </td>
                                <td className="py-4">
                                    <span className="text-xs font-mono font-bold text-primary">
                                        {reading.ldr_value.toFixed(1)}
                                    </span>
                                </td>
                                <td className="py-4">
                                    {reading.is_anomaly ? (
                                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-anomaly/10 border border-anomaly/20 text-anomaly text-[9px] font-black uppercase">
                                            <ShieldAlert size={10} />
                                            Anomaly
                                        </div>
                                    ) : (
                                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-success/10 border border-success/20 text-success text-[9px] font-black uppercase">
                                            <ShieldCheck size={10} />
                                            Clear
                                        </div>
                                    )}
                                </td>
                                <td className="py-4 text-right pr-2">
                                    <button className="text-[10px] font-bold uppercase tracking-widest text-text-muted hover:text-primary transition-colors">
                                        Details
                                    </button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {readings.length === 0 && (
                <div className="py-20 text-center opacity-30 text-xs font-bold uppercase tracking-widest">
                    Awaiting data stream...
                </div>
            )}
        </div>
    );
}
