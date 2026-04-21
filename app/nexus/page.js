"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Brain, Zap, MessageSquare, Send, Github, Linkedin, Terminal, CheckCircle, Cpu, Database, Globe, Rocket, Lightbulb, ArrowRight } from 'lucide-react';

export default function NexusConnect() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email.trim()) {
            // Open mailto link so it sends to project email
            window.location.href = `mailto:ojaswianand@gmail.com?subject=NEXUS Connection Request&body=Hi, I would like to stay connected with the AI Anomaly Detection project updates. My email: ${email}`;
            setSubmitted(true);
            setTimeout(() => setSubmitted(false), 5000);
            setEmail('');
        }
    };

    return (
        <div className="container mx-auto px-6 py-32 max-w-6xl">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center mb-32"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/20 mb-8">
                    <Zap size={14} className="text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Nexus Hub</span>
                </div>
                <h1 className="text-6xl font-black font-outfit mb-8 leading-tight">Universal <span className="text-primary italic">Nexus</span></h1>
                <p className="text-xl text-text-muted max-w-2xl mx-auto font-medium">
                    The central hub connecting research, code, community, and the future roadmap
                    of the AI Anomaly Detection System.
                </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-20 items-start">
                {/* Connection Box */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="space-y-12"
                >
                    <div className="premium-card p-12 bg-primary/5 border-primary/20">
                        <h3 className="text-3xl font-black font-outfit mb-4 italic">Stay <span className="text-primary">Connected</span></h3>
                        <p className="text-text-muted font-medium mb-8">
                            Enter your email to connect with us. You will receive project updates,
                            new feature announcements, and research milestone notifications directly.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="relative group">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your.email@example.com"
                                    required
                                    className="w-full bg-black/40 border border-glass-border rounded-2xl p-6 text-sm font-medium focus:outline-none focus:border-primary/50 transition-all pl-14"
                                />
                                <MessageSquare className="absolute left-6 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={20} />
                            </div>
                            <button type="submit" className="neon-button w-full !py-6 group">
                                {submitted ? (
                                    <span className="flex items-center justify-center gap-3">
                                        <CheckCircle size={18} /> Connection Established!
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-3">
                                        Establish Connection
                                        <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </span>
                                )}
                            </button>
                        </form>

                        <div className="mt-12 pt-12 border-t border-glass-border flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-text-muted">
                            <span>Research Project 2026</span>
                            <div className="flex gap-6">
                                <a href="https://github.com/" target="_blank" rel="noopener noreferrer"><Github size={16} className="hover:text-primary cursor-pointer transition-colors" /></a>
                                <a href="https://linkedin.com/in/" target="_blank" rel="noopener noreferrer"><Linkedin size={16} className="hover:text-primary cursor-pointer transition-colors" /></a>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Future Roadmap */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="space-y-8"
                >
                    <div className="mb-8">
                        <h3 className="text-3xl font-black font-outfit mb-4">Future <span className="text-primary italic">Roadmap</span></h3>
                        <p className="text-text-muted font-medium">Key milestones and features planned for upcoming releases of the NEXUS system.</p>
                    </div>

                    {[
                        { phase: "Phase 1", title: "TinyML Edge Deployment", desc: "Compress the Isolation Forest model using ONNX Runtime and deploy directly on ESP32, enabling fully offline anomaly detection without cloud dependency.", icon: <Cpu />, status: "Planned" },
                        { phase: "Phase 2", title: "Multi-Sensor Fusion", desc: "Expand from single LDR sensor to multivariate inputs including temperature (DHT22), gas (MQ-2), and vibration sensors for comprehensive industrial monitoring.", icon: <Database />, status: "Research" },
                        { phase: "Phase 3", title: "SMS & Email Alert Pipeline", desc: "Integrate Twilio API for real-time SMS alerts and SendGrid for email notifications when critical anomalies exceed configurable severity thresholds.", icon: <Zap />, status: "Planned" },
                        { phase: "Phase 4", title: "Mobile Companion App", desc: "Build a React Native mobile application for on-the-go monitoring, push notifications, and historical trend analysis with offline data caching.", icon: <Globe />, status: "Concept" },
                        { phase: "Phase 5", title: "Federated Learning", desc: "Deploy multiple edge nodes across different locations and implement federated model training where each node contributes to a shared global anomaly model.", icon: <Brain />, status: "Research" },
                    ].map((item, i) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="premium-card p-8 group hover:border-primary/20 transition-colors"
                        >
                            <div className="flex items-start gap-6">
                                <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-primary shrink-0 group-hover:bg-primary/20 transition-colors">
                                    {React.cloneElement(item.icon, { size: 20 })}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-[8px] font-black uppercase tracking-widest text-primary">{item.phase}</span>
                                        <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/5 border border-glass-border text-text-muted">{item.status}</span>
                                    </div>
                                    <h4 className="text-lg font-bold font-outfit mb-2">{item.title}</h4>
                                    <p className="text-text-muted text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Footer Text */}
            <div className="mt-32 text-center opacity-30">
                <p className="text-[8px] uppercase tracking-[0.5em] font-black">Designed & Engineered by Ojaswi Anand Sharma — Research Prototype v4.0</p>
            </div>
        </div>
    );
}
