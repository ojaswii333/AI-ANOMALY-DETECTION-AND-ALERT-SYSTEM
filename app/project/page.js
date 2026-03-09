"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Target, Cpu, HardDrive, Code, Workflow, Terminal } from 'lucide-react';

export default function ProjectOverview() {
    return (
        <div className="container mx-auto px-6 py-32 max-w-6xl">
            {/* Cinematic Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-32"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/5 border border-secondary/20 mb-8">
                    <Terminal size={14} className="text-secondary" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary">System Documentation v1.0</span>
                </div>
                <h1 className="text-6xl font-black font-outfit mb-8 leading-tight">Project <span className="text-secondary italic">Genesis</span></h1>
                <p className="text-xl text-text-muted max-w-3xl mx-auto font-medium leading-relaxed">
                    Bridging the gap between raw physical signals and actionable AI intelligence through
                    high-fidelity anomaly detection.
                </p>
            </motion.div>

            {/* Grid Content */}
            <div className="grid gap-20">
                {/* Problem & Solution */}
                <section className="grid md:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="premium-card p-12 border-secondary/20"
                    >
                        <div className="p-4 rounded-2xl bg-secondary/10 border border-secondary/20 w-fit mb-8">
                            <Target className="text-secondary" size={32} />
                        </div>
                        <h3 className="text-3xl font-bold font-outfit mb-6">The Challenge</h3>
                        <p className="text-text-muted font-medium leading-relaxed">
                            Industrial and security sensor streams often suffer from "drift" or subtle tampering that
                            traditional threshold-based systems miss. We needed a model that understands the
                            <span className="text-text-main italic font-bold"> probability of normality</span> in high-frequency data.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="premium-card p-12 border-primary/20"
                    >
                        <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 w-fit mb-8">
                            <Shield className="text-primary" size={32} />
                        </div>
                        <h3 className="text-3xl font-bold font-outfit mb-6">The Solution</h3>
                        <p className="text-text-muted font-medium leading-relaxed">
                            Deploying an <span className="text-primary font-bold italic">Isolation Forest</span> ensemble that partitions anomalies
                            instead of profiling normal data. This allows for rapid retraining and zero-day
                            deviation flagging without labeled training sets.
                        </p>
                    </motion.div>
                </section>

                {/* System Architecture */}
                <section className="py-20 border-t border-glass-border">
                    <div className="text-center mb-20">
                        <h4 className="text-sm font-bold uppercase tracking-[0.4em] text-text-muted mb-4">Architecture</h4>
                        <h3 className="text-4xl font-extrabold font-outfit">The NEXUS Pipeline</h3>
                    </div>

                    <div className="premium-card p-2 relative overflow-hidden">
                        <div className="grid md:grid-cols-4 gap-4 p-8">
                            {[
                                { name: "Ingress", icon: <Cpu />, sub: "Sensor Data" },
                                { name: "FastAPI Nexus", icon: <HardDrive />, sub: "Processing" },
                                { name: "Isolation Engine", icon: <Workflow />, sub: "AI Inference" },
                                { name: "Dashboard UI", icon: <Code />, sub: "Visualization" }
                            ].map((step, i) => (
                                <div key={step.name} className="relative flex flex-col items-center text-center p-8 rounded-xl bg-white/5 border border-glass-border group hover:bg-white/10 transition-all">
                                    <div className="mb-6 text-primary group-hover:scale-110 transition-transform">
                                        {step.icon}
                                    </div>
                                    <h5 className="font-bold text-text-main font-outfit text-lg">{step.name}</h5>
                                    <p className="text-[10px] uppercase font-black tracking-widest text-text-muted mt-2">{step.sub}</p>
                                    {i < 3 && <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 text-primary/20 font-bold text-4xl leading-none">→</div>}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Tech Stack */}
                <section>
                    <div className="premium-card p-12 bg-primary/5 border-primary/10 flex flex-wrap justify-center gap-16">
                        <div className="text-center">
                            <p className="text-4xl font-black font-outfit">Python</p>
                            <p className="text-[10px] uppercase font-bold tracking-widest text-primary mt-2">Core ML</p>
                        </div>
                        <div className="text-center">
                            <p className="text-4xl font-black font-outfit">Next.js</p>
                            <p className="text-[10px] uppercase font-bold tracking-widest text-primary mt-2">Neural UI</p>
                        </div>
                        <div className="text-center">
                            <p className="text-4xl font-black font-outfit">FastAPI</p>
                            <p className="text-[10px] uppercase font-bold tracking-widest text-primary mt-2">API Nexus</p>
                        </div>
                        <div className="text-center">
                            <p className="text-4xl font-black font-outfit">SKLearn</p>
                            <p className="text-[10px] uppercase font-bold tracking-widest text-primary mt-2">Analytics</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
