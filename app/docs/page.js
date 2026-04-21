"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FileCode, Layers, HardDrive, Cpu, Terminal, BookOpen, ExternalLink, Github, Download, Database } from 'lucide-react';

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
                    mathematical frameworks, and deployment infrastructure powering the anomaly detection system.
                </p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-16">
                <div className="lg:col-span-2 space-y-20">
                    {/* Hardware Stack */}
                    <section>
                        <div className="flex items-center gap-4 mb-10">
                            <div className="h-1 shadow-[0_0_20px_var(--secondary)] bg-secondary flex-1" />
                            <h3 className="text-2xl font-black font-outfit uppercase tracking-widest flex items-center gap-3">
                                <Cpu className="text-secondary" /> Hardware Layer
                            </h3>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8">
                            {[
                                { name: "ESP32 NodeMCU", val: "Dual-Core 240MHz", desc: "Tensilica Xtensa LX6 processor with integrated Wi-Fi. Handles DHT11 polling, I2C OLED driving, and an analog read for the soil moisture sensor, sending JSON payloads to the cloud infrastructure via HTTP POST." },
                                { name: "DHT11 & Soil Sensors", val: "Multivariate Data", desc: "Collects real-time Temperature (°C), Humidity (%), and Analog Soil Moisture (0-1023). This 3D data pipeline captures a holistic view of the physical environment." },
                                { name: "OLED & Interaction", val: "I2C SSD1306 | ISR", desc: "Features a 128x64 display representing an Edge UI to monitor readings locally. A hardware push-button provides hardware-interrupt capability to toggle display screens." },
                                { name: "Communication", val: "WiFi HTTP REST", desc: "Edge-to-cloud data pipeline using standard JSON-REST protocols. The payload `{device_id, temperature, humidity, soil_moisture}` is mapped to the FastAPI backend." }
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
                                    { layer: "Machine Learning", tech: "Isolation Forest (Scikit-Learn)", desc: "Unsupervised ensemble algorithm using 100 randomized decision trees. Contamination factor set to 0.1 (10% expected anomaly rate). Trained on 1000 synthetic data points at startup, retrainable on real data via /train endpoint." },
                                    { layer: "Backend API", tech: "FastAPI + SQLite3 + WAL Mode", desc: "Asynchronous Python ASGI server with automatic OpenAPI documentation. SQLite with Write-Ahead Logging for concurrent read/write. Endpoints: /detect-anomaly, /history, /stats, /alerts, /train, /clear-data." },
                                    { layer: "Frontend UI", tech: "Next.js 16 + Tailwind CSS v4 + Recharts", desc: "React-based App Router with real-time 3-second polling, AreaChart visualizations, SPIKE/DIP alert badges, Web Audio API beep alerts, and browser notification support." },
                                    { layer: "Animation Engine", tech: "GSAP + Framer Motion", desc: "GSAP ScrollTrigger for reveal animations, Framer Motion for component transitions, AnimatePresence for toast notifications. Custom cursor and preloader effects." },
                                    { layer: "Deployment", tech: "Render (Backend) + Vercel (Frontend)", desc: "Backend deployed as a Python web service on Render with auto-sleep. Frontend deployed on Vercel with edge functions. Environment variable NEXT_PUBLIC_API_URL bridges the two." }
                                ].map((layer) => (
                                    <div key={layer.layer} className="flex flex-col md:flex-row md:items-start justify-between gap-4 p-6 rounded-xl bg-white/5 border border-glass-border hover:bg-white/10 transition-colors">
                                        <div className="flex-1">
                                            <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1">{layer.layer}</p>
                                            <h6 className="text-lg font-bold text-text-main font-outfit mb-2">{layer.tech}</h6>
                                            <p className="text-sm text-text-muted leading-relaxed">{layer.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* API Endpoints Reference */}
                    <section>
                        <div className="flex items-center gap-4 mb-10">
                            <div className="h-1 shadow-[0_0_20px_var(--primary)] bg-primary flex-1" />
                            <h3 className="text-2xl font-black font-outfit uppercase tracking-widest flex items-center gap-3">
                                <Database className="text-primary" /> API Reference
                            </h3>
                        </div>
                        <div className="premium-card p-8 overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-glass-border">
                                        <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">Method</th>
                                        <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">Endpoint</th>
                                        <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">Description</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {[
                                        ["POST", "/detect-anomaly", "Send sensor reading, get anomaly prediction with score"],
                                        ["GET", "/history", "Fetch recent sensor readings with pagination"],
                                        ["GET", "/stats", "System statistics, anomaly rates, model info"],
                                        ["GET", "/alerts/recent", "Latest active anomaly alerts"],
                                        ["POST", "/train", "Retrain ML model on collected real data"],
                                        ["POST", "/clear-data", "Wipe database for clean demo restart"],
                                        ["GET", "/health", "System health, uptime, reading counts"],
                                    ].map(([method, endpoint, desc]) => (
                                        <tr key={endpoint} className="hover:bg-white/5 transition-colors">
                                            <td className="py-3"><span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${method === 'POST' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'}`}>{method}</span></td>
                                            <td className="py-3 font-mono text-primary text-xs">{endpoint}</td>
                                            <td className="py-3 text-text-muted text-xs">{desc}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>

                {/* Sidebar Resources */}
                <div className="space-y-12">
                    <div className="premium-card p-10 py-12 text-center border-primary/20">
                        <Terminal size={48} className="mx-auto text-primary mb-8" />
                        <h4 className="text-2xl font-black font-outfit mb-4 italic">Quick Links</h4>
                        <div className="space-y-4 pt-4">
                            <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-primary/10 border border-primary/20 text-primary font-bold uppercase tracking-widest text-[10px] hover:bg-primary/20 transition-all">
                                <Github size={14} /> Source Repository
                            </a>
                            <a href="/ml_pipeline.png" target="_blank" className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-white/5 border border-glass-border text-text-main font-bold uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all">
                                <Layers size={14} /> ML Pipeline Diagram
                            </a>
                            <a href="https://doi.org/10.1109/ICDM.2008.17" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-white/5 border border-glass-border text-text-main font-bold uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all">
                                <ExternalLink size={14} /> Isolation Forest Paper (IEEE)
                            </a>
                            <a href="https://doi.org/10.1145/3439950" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-white/5 border border-glass-border text-text-main font-bold uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all">
                                <ExternalLink size={14} /> Deep Learning Anomaly Review
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
                            Full OpenAPI documentation available at /docs endpoint.
                        </p>
                    </div>

                    <div className="premium-card p-10 border-primary/10">
                        <h5 className="text-sm font-black uppercase tracking-widest text-primary mb-6">Key References</h5>
                        <ul className="space-y-4 text-text-muted text-xs leading-relaxed">
                            <li><span className="text-text-main font-bold">Liu et al. (2008)</span> — Isolation Forest, IEEE ICDM</li>
                            <li><span className="text-text-main font-bold">Pang et al. (2021)</span> — Deep Learning for Anomaly Detection, ACM CSUR</li>
                            <li><span className="text-text-main font-bold">Pedregosa et al. (2011)</span> — Scikit-learn: ML in Python, JMLR</li>
                            <li><span className="text-text-main font-bold">Ali et al. (2022)</span> — IoT Technologies Review, IEEE Access</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
