"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FileCode, Layers, HardDrive, Cpu, Terminal, BookOpen, ExternalLink, Github } from 'lucide-react';

export default function Documentation() {
    return (
        <div className="container mx-auto px-6 py-32 max-w-6xl">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-32"
            >
                <div className="flex items-center gap-3 text-secondary mb-6">
                    <BookOpen size={20} />
                    <span className="text-sm font-black uppercase tracking-[0.3em]">Knowledge Base</span>
                </div>
                <h1 className="text-6xl font-black font-outfit mb-8 leading-tight">Technical <br /><span className="text-secondary italic">Blueprint</span></h1>
                <p className="text-xl text-text-muted max-w-2xl font-medium">
                    Comprehensive documentation of the hardware architecture, software stack,
                    and mathematical frameworks powering the anomaly detection system.
                </p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-16">
                <div className="lg:col-span-2 space-y-20">
                    {/* Hardware Stack */}
                    <section>
                        <div className="flex items-center gap-4 mb-10">
                            <div className="h-1 shadow-[0_0_20px_var(--secondary)] bg-secondary flex-1" />
                            <h3 className="text-2xl font-black font-outfit uppercase tracking-widest flex items-center gap-3">
                                <Cpu className="text-secondary" /> Hardware Nexus
                            </h3>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8">
                            {[
                                { name: "Microcontroller", val: "ESP32 / Simulated Edge", desc: "Dual-core processor managing sensor ingress and WiFi telemetry." },
                                { name: "Optical Sensors", val: "LDR Matrix", desc: "High-sensitivity light dependent resistors for environmental analysis." },
                                { name: "A/D Converters", val: "12-bit Resolution", desc: "High-fidelity conversion of analog signals to discrete datasets." },
                                { name: "Transmission", val: "HTTP via WiFi", desc: "Edge-to-cloud communication protocol using REST pipelines." }
                            ].map((item) => (
                                <div key={item.name} className="premium-card p-10 bg-secondary/5 border-secondary/10">
                                    <h5 className="font-bold text-text-main mb-2 font-outfit text-xl">{item.name}</h5>
                                    <p className="text-secondary text-[10px] uppercase font-black tracking-widest mb-4">{item.val}</p>
                                    <p className="text-text-muted text-sm font-medium leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Software Stack */}
                    <section>
                        <div className="flex items-center gap-4 mb-10">
                            <div className="h-1 shadow-[0_0_20px_var(--primary)] bg-primary flex-1" />
                            <h3 className="text-2xl font-black font-outfit uppercase tracking-widest flex items-center gap-3">
                                <FileCode className="text-primary" /> Software Layer
                            </h3>
                        </div>
                        <div className="premium-card p-1 overflow-hidden">
                            <div className="p-8 space-y-6">
                                {[
                                    { layer: "AI Model", tech: "Python / Isolation Forest", desc: "Mathematically isolates anomalies based on path depth analysis." },
                                    { layer: "Backend API", tech: "FastAPI / SQLite", desc: "High-performance asynchronous nexus for data persistence." },
                                    { layer: "Frontend UI", tech: "Next.js / Tailwind v4", desc: "Real-time reactive visualization with glassmorphism aesthetics." },
                                    { layer: "Motion Engine", tech: "GSAP / Framer Motion", desc: "Coordinating cinematic transitions and scroll-based reveals." }
                                ].map((layer) => (
                                    <div key={layer.layer} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-xl bg-white/5 border border-glass-border hover:bg-white/10 transition-colors">
                                        <div>
                                            <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1">{layer.layer}</p>
                                            <h6 className="text-lg font-bold text-text-main font-outfit">{layer.tech}</h6>
                                        </div>
                                        <p className="text-sm text-text-muted max-w-xs">{layer.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>

                {/* Sidebar Resources */}
                <div className="space-y-12">
                    <div className="premium-card p-10 py-12 text-center border-primary/20">
                        <Terminal size={48} className="mx-auto text-primary mb-8" />
                        <h4 className="text-2xl font-black font-outfit mb-4 italic">Quick Links</h4>
                        <div className="space-y-4 pt-4">
                            <a href="#" className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-primary/10 border border-primary/20 text-primary font-bold uppercase tracking-widest text-[10px] hover:bg-primary/20 transition-all">
                                <Github size={14} /> Source Repository
                            </a>
                            <a href="#" className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-white/5 border border-glass-border text-text-main font-bold uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all">
                                <Layers size={14} /> Model weights
                            </a>
                            <a href="#" className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-white/5 border border-glass-border text-text-main font-bold uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all">
                                <ExternalLink size={14} /> Research PDF
                            </a>
                        </div>
                    </div>

                    <div className="premium-card p-10 bg-secondary/5 border-secondary/10">
                        <h5 className="text-sm font-black uppercase tracking-widest text-secondary mb-6 italic underline">API Status</h5>
                        <div className="flex items-center gap-3 text-xs font-bold text-text-main/80">
                            <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                            Nexus Interface Online
                        </div>
                        <p className="mt-4 text-[10px] text-text-muted leading-relaxed font-medium">
                            Access telemetry streams via standard JSON-REST interfaces at port 8000.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
