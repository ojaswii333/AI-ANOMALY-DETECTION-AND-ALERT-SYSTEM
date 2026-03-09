"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Cpu, Activity, Terminal } from 'lucide-react';

export default function Preloader() {
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState("Initializing NEXUS...");

    useEffect(() => {
        const timer = setTimeout(() => {
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setTimeout(() => setLoading(false), 800);
                        return 100;
                    }
                    return prev + 1.5;
                });
            }, 30);
        }, 500);

        const statusInterval = setInterval(() => {
            const statuses = [
                "Establishing Secure Uplink...",
                "Calibrating LDR Sensors...",
                "Loading Isolation Forest Core...",
                "Syncing Telemetry Stream...",
                "Ready for Deployment."
            ];
            setStatus(statuses[Math.floor(Math.random() * statuses.length)]);
        }, 1200);

        return () => {
            clearTimeout(timer);
            clearInterval(statusInterval);
        };
    }, []);

    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    exit={{ opacity: 0, scale: 1.1 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-obsidian overflow-hidden"
                >
                    {/* Background Grid */}
                    <div className="absolute inset-0 bg-grid opacity-10" />
                    <div className="absolute inset-0 bg-mesh opacity-20" />

                    {/* Central Icon */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative mb-12"
                    >
                        <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-full animate-pulse" />
                        <div className="relative p-8 rounded-[2rem] bg-white/5 border border-primary/20 backdrop-blur-3xl shadow-2xl">
                            <Shield className="text-primary" size={64} strokeWidth={1.5} />
                        </div>
                    </motion.div>

                    {/* Progress Text */}
                    <div className="text-center space-y-4 max-w-sm w-full px-6">
                        <div className="flex justify-between items-end mb-1">
                            <div className="flex items-center gap-2">
                                <Terminal size={12} className="text-primary animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">System Bootstrap</span>
                            </div>
                            <span className="text-xs font-mono text-primary/80">{Math.round(progress)}%</span>
                        </div>

                        {/* Progress Bar Container */}
                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                className="h-full bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] animate-shimmer"
                            />
                        </div>

                        {/* Status Message */}
                        <div className="h-4">
                            <AnimatePresence mode="wait">
                                <motion.p
                                    key={status}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                    className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]"
                                >
                                    {status}
                                </motion.p>
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute bottom-12 flex gap-12 opacity-20">
                        <div className="flex items-center gap-2">
                            <Cpu size={14} className="text-primary" />
                            <span className="text-[8px] font-black uppercase tracking-widest text-text-main">AI Node Active</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Activity size={14} className="text-secondary" />
                            <span className="text-[8px] font-black uppercase tracking-widest text-text-main">Telemetry Live</span>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
