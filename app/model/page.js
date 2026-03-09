"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, TrendingUp, BarChart3, Binary, ShieldAlert, Terminal } from 'lucide-react';

export default function ModelInsights() {
    return (
        <div className="container mx-auto px-6 py-32 max-w-6xl">
            {/* Cinematic Header */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center mb-32"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/20 mb-8">
                    <Binary size={14} className="text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Algorithm Intelligence Report</span>
                </div>
                <h1 className="text-6xl font-black font-outfit mb-8 italic">Isolation <span className="text-primary">Forest</span></h1>
                <p className="text-xl text-text-muted max-w-3xl mx-auto font-medium leading-relaxed">
                    Analyzing the mathematical engine behind anomalous pattern detection and security prioritization.
                </p>
            </motion.div>

            <div className="grid gap-12">
                {/* Why Isolation Forest? */}
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { title: "Anomaly Scoring", icon: <ShieldAlert />, val: "0.82", unit: "Path Depth", desc: "Shorter isolation paths indicate higher anomaly scores." },
                        { title: "Inference Time", icon: <Zap />, val: "1.2", unit: "ms/sample", desc: "Ultra-fast execution suitable for edge-level deployment." },
                        { title: "Zero Calibration", icon: <Brain />, desc: "Unsupervised learning allows detection without pre-labeled attack data." }
                    ].map((metric, i) => (
                        <motion.div
                            key={metric.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="premium-card p-10 flex flex-col items-center text-center"
                        >
                            <div className="mb-6 p-4 rounded-xl bg-primary/5 border border-primary/20 text-primary">
                                {metric.icon}
                            </div>
                            <h4 className="text-xl font-bold font-outfit mb-2">{metric.title}</h4>
                            {metric.val && (
                                <div className="mb-4">
                                    <span className="text-4xl font-black text-primary italic font-outfit">{metric.val}</span>
                                    <span className="text-[10px] ml-1 uppercase font-black text-text-muted tracking-widest">{metric.unit}</span>
                                </div>
                            )}
                            <p className="text-xs text-text-muted font-medium">{metric.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Feature Weights Section */}
                <section className="py-20">
                    <div className="premium-card p-12 overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <BarChart3 size={300} className="text-primary" />
                        </div>

                        <div className="grid md:grid-cols-2 gap-20 items-center">
                            <div>
                                <h3 className="text-3xl font-black font-outfit mb-8">Adaptive Learning</h3>
                                <p className="text-text-muted font-medium leading-relaxed mb-8">
                                    The model continuously updates its internal forest structure as new "normal" patterns emerge,
                                    ensuring high precision and minimal false positives in fluctuating environments.
                                </p>

                                <div className="space-y-4">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-1 text-primary">
                                        <span>Model Precision</span>
                                        <span>98.4%</span>
                                    </div>
                                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: '98.4%' }}
                                            transition={{ duration: 1.5 }}
                                            className="h-full bg-primary"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-4">
                                <div className="p-6 rounded-xl bg-white/5 border border-glass-border flex items-center justify-between">
                                    <span className="text-xs font-bold uppercase tracking-widest text-text-muted">Algorithm Depth</span>
                                    <span className="text-primary font-bold font-outfit">Max 10 Levels</span>
                                </div>
                                <div className="p-6 rounded-xl bg-white/5 border border-glass-border flex items-center justify-between">
                                    <span className="text-xs font-bold uppercase tracking-widest text-text-muted">Sample Size</span>
                                    <span className="text-primary font-bold font-outfit">256 Points</span>
                                </div>
                                <div className="p-6 rounded-xl bg-white/5 border border-glass-border flex items-center justify-between">
                                    <span className="text-xs font-bold uppercase tracking-widest text-text-muted">Contamination</span>
                                    <span className="text-primary font-bold font-outfit">0.05 Fixed</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
