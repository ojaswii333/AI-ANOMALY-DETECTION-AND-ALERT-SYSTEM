"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Target, Cpu, HardDrive, Code, Workflow, Terminal, Zap, Database, BarChart3, Globe, Brain, ArrowRight, Lightbulb, Factory, Leaf, Building2, Ambulance } from 'lucide-react';

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
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary">System Documentation v4.0</span>
                </div>
                <h1 className="text-6xl font-black font-outfit mb-8 leading-tight">Project <span className="text-secondary italic">Genesis</span></h1>
                <p className="text-xl text-text-muted max-w-3xl mx-auto font-medium leading-relaxed">
                    A comprehensive AI-powered anomaly detection system that transforms raw IoT sensor data 
                    into actionable intelligence through unsupervised machine learning.
                </p>
            </motion.div>

            <div className="grid gap-20">
                {/* Problem & Solution */}
                <section className="grid md:grid-cols-2 gap-12 items-stretch">
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
                        <p className="text-text-muted font-medium leading-relaxed mb-4">
                            Traditional IoT monitoring systems rely on manually-configured static thresholds 
                            (simple if/else rules) to detect problems. These rigid approaches fail catastrophically 
                            in real-world environments where sensor behavior naturally drifts over time due to 
                            temperature changes, aging components, or gradual environmental shifts.
                        </p>
                        <ul className="space-y-3 text-text-muted text-sm">
                            <li className="flex items-start gap-3"><ArrowRight size={14} className="text-secondary mt-1 shrink-0" /> Static thresholds generate excessive false alarms</li>
                            <li className="flex items-start gap-3"><ArrowRight size={14} className="text-secondary mt-1 shrink-0" /> Subtle anomalies go undetected until system failure</li>
                            <li className="flex items-start gap-3"><ArrowRight size={14} className="text-secondary mt-1 shrink-0" /> Manual monitoring is not scalable for large sensor networks</li>
                            <li className="flex items-start gap-3"><ArrowRight size={14} className="text-secondary mt-1 shrink-0" /> No labeled anomaly data available for supervised training</li>
                        </ul>
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
                        <h3 className="text-3xl font-bold font-outfit mb-6">Our Solution</h3>
                        <p className="text-text-muted font-medium leading-relaxed mb-4">
                            We built an end-to-end system that deploys an <span className="text-primary font-bold italic">Isolation Forest</span> unsupervised 
                            machine learning model. Instead of defining what &quot;normal&quot; looks like, the algorithm 
                            mathematically isolates data points that are structurally different from the majority — 
                            requiring zero labeled training data.
                        </p>
                        <ul className="space-y-3 text-text-muted text-sm">
                            <li className="flex items-start gap-3"><ArrowRight size={14} className="text-primary mt-1 shrink-0" /> Learns normal sensor patterns automatically from data</li>
                            <li className="flex items-start gap-3"><ArrowRight size={14} className="text-primary mt-1 shrink-0" /> Detects both sudden spikes and gradual drift anomalies</li>
                            <li className="flex items-start gap-3"><ArrowRight size={14} className="text-primary mt-1 shrink-0" /> Real-time inference in under 2ms per prediction</li>
                            <li className="flex items-start gap-3"><ArrowRight size={14} className="text-primary mt-1 shrink-0" /> Browser audio alerts and desktop notifications on detection</li>
                        </ul>
                    </motion.div>
                </section>

                {/* How It Works */}
                <section className="py-20 border-t border-glass-border">
                    <div className="text-center mb-20">
                        <h4 className="text-sm font-bold uppercase tracking-[0.4em] text-text-muted mb-4">How It Works</h4>
                        <h3 className="text-4xl font-extrabold font-outfit">The NEXUS Pipeline</h3>
                    </div>

                    <div className="premium-card p-2 relative overflow-hidden">
                        <div className="grid md:grid-cols-4 gap-4 p-8">
                            {[
                                { name: "Edge Sensor Module", icon: <Cpu />, sub: "ESP32 + OLED", desc: "Collects DHT11 Temperature, Humidity, and Analog Soil Moisture readings." },
                                { name: "API Gateway", icon: <HardDrive />, sub: "FastAPI Backend", desc: "Receives HTTP POST via WiFi, stores in SQLite, routes to ML engine." },
                                { name: "AI Engine", icon: <Brain />, sub: "Multivariate Isolation Forest", desc: "Scores the 3D environmental array, flags droughts, floods, or heatwaves." },
                                { name: "Live Dashboard", icon: <BarChart3 />, sub: "Next.js + Recharts", desc: "Real-time converging multi-axis charts and prioritized notification stream." }
                            ].map((step, i) => (
                                <div key={step.name} className="relative flex flex-col items-center text-center p-8 rounded-xl bg-white/5 border border-glass-border group hover:bg-white/10 transition-all">
                                    <div className="mb-4 text-primary group-hover:scale-110 transition-transform">
                                        {React.cloneElement(step.icon, { size: 32 })}
                                    </div>
                                    <h5 className="font-bold text-text-main font-outfit text-lg">{step.name}</h5>
                                    <p className="text-[10px] uppercase font-black tracking-widest text-primary mt-1 mb-3">{step.sub}</p>
                                    <p className="text-text-muted text-xs leading-relaxed">{step.desc}</p>
                                    {i < 3 && <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 text-primary/30 font-bold text-3xl leading-none z-10">&rarr;</div>}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* System Architecture Image */}
                <section>
                    <div className="text-center mb-12">
                        <h4 className="text-sm font-bold uppercase tracking-[0.4em] text-text-muted mb-4">Architecture</h4>
                        <h3 className="text-4xl font-extrabold font-outfit">System Blueprint</h3>
                    </div>
                    <div className="premium-card p-4 overflow-hidden">
                        <img src="/sys_arch.png" alt="System Architecture Diagram" className="w-full rounded-xl" />
                    </div>
                </section>

                {/* Data Flow */}
                <section>
                    <div className="text-center mb-12">
                        <h4 className="text-sm font-bold uppercase tracking-[0.4em] text-text-muted mb-4">Data Flow</h4>
                        <h3 className="text-4xl font-extrabold font-outfit">Information Pipeline</h3>
                    </div>
                    <div className="premium-card p-4 overflow-hidden">
                        <img src="/dfd_level_0.png" alt="Data Flow Diagram" className="w-full rounded-xl" />
                    </div>
                </section>

                {/* Tech Stack */}
                <section>
                    <div className="text-center mb-12">
                        <h4 className="text-sm font-bold uppercase tracking-[0.4em] text-text-muted mb-4">Technology</h4>
                        <h3 className="text-4xl font-extrabold font-outfit">Tech Stack</h3>
                    </div>
                    <div className="premium-card p-12 bg-primary/5 border-primary/10 grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { name: "Python", role: "Core ML & Backend", desc: "Scikit-Learn Isolation Forest handling multivariate arrays" },
                            { name: "FastAPI", role: "REST API Server", desc: "Async ASGI framework handling data ingestion and SQLite schema" },
                            { name: "Next.js 16", role: "Frontend Framework", desc: "React-based app with App Router, real-time polling, Multi-axis Recharts" },
                            { name: "ESP32", role: "Edge Hardware", desc: "Connecting DHT11, Soil Sensor, OLED via I2C, and WiFi transmission" },
                        ].map(t => (
                            <div key={t.name} className="text-center">
                                <p className="text-3xl font-black font-outfit">{t.name}</p>
                                <p className="text-[10px] uppercase font-bold tracking-widest text-primary mt-2 mb-3">{t.role}</p>
                                <p className="text-text-muted text-xs leading-relaxed">{t.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Future Scope & Applications */}
                <section className="py-20 border-t border-glass-border">
                    <div className="text-center mb-20">
                        <h4 className="text-sm font-bold uppercase tracking-[0.4em] text-text-muted mb-4">What&apos;s Next</h4>
                        <h3 className="text-4xl font-extrabold font-outfit">Future Scope &amp; Applications</h3>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { title: "Industrial IoT Monitoring", icon: <Factory />, desc: "Deploy across factory floors to monitor vibration, temperature, and pressure sensors in manufacturing equipment for predictive maintenance.", color: "primary" },
                            { title: "Smart Agriculture", icon: <Leaf />, desc: "Monitor soil moisture, light levels, and humidity sensors in greenhouses to detect irrigation failures and environmental anomalies in crop systems.", color: "secondary" },
                            { title: "Building Security", icon: <Building2 />, desc: "Integrate with motion sensors and access control systems in smart buildings to detect unauthorized access patterns and security breaches.", color: "primary" },
                            { title: "Healthcare Monitoring", icon: <Ambulance />, desc: "Extend to wearable health sensors for continuous patient vital monitoring, flagging abnormal heart rate or temperature patterns.", color: "secondary" },
                            { title: "TinyML On-Device", icon: <Cpu />, desc: "Port the trained Isolation Forest model directly onto the ESP32 using TensorFlow Lite Micro, removing the need for cloud connectivity.", color: "primary" },
                            { title: "Multi-Sensor Fusion", icon: <Zap />, desc: "Expand from single LDR to multi-variate analysis combining temperature, pressure, humidity, and gas sensors for comprehensive environmental intelligence.", color: "secondary" },
                        ].map((item) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="premium-card p-8 group"
                            >
                                <div className={`mb-6 p-3 rounded-xl w-fit transition-colors ${item.color === 'primary' ? 'bg-primary/10 border border-primary/20 group-hover:bg-primary/20' : 'bg-secondary/10 border border-secondary/20 group-hover:bg-secondary/20'}`}>
                                    {React.cloneElement(item.icon, { size: 24, className: item.color === 'primary' ? 'text-primary' : 'text-secondary' })}
                                </div>
                                <h4 className="text-xl font-bold font-outfit mb-3">{item.title}</h4>
                                <p className="text-text-muted text-sm font-medium leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
