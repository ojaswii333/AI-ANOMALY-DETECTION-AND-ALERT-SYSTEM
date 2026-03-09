"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Maximize2, Cpu, Database, Activity, Shield } from 'lucide-react';

const galleryItems = [
    {
        title: "System Architecture",
        category: "Blueprint",
        description: "The multi-layer NEXUS pipeline from Edge LDR sensors to the Isolation Forest AI core.",
        icon: <Cpu className="text-primary" size={24} />,
        gradient: "from-primary/20 to-transparent"
    },
    {
        title: "Anomaly Visualization",
        category: "Analytics",
        description: "High-fidelity representation of LDR signal spikes and AI-flagged anomaly points.",
        icon: <Activity className="text-secondary" size={24} />,
        gradient: "from-secondary/20 to-transparent"
    },
    {
        title: "Neural Mapping",
        category: "AI Model",
        description: "Unsupervised learning clusters showcasing how abnormal lighting patterns are isolated.",
        icon: <Database className="text-primary" size={24} />,
        gradient: "from-primary/20 to-transparent"
    },
    {
        title: "Security Protocols",
        category: "Hardware",
        description: "Physical ESP32 and LDR sensor schematics for the IoT Edge layer.",
        icon: <Shield className="text-secondary" size={24} />,
        gradient: "from-secondary/20 to-transparent"
    },
    {
        title: "Telemetry Stream",
        category: "Infrastructure",
        description: "Real-time data flow logs processed by the FastAPI WebSocket gateway.",
        icon: <ImageIcon className="text-primary" size={24} />,
        gradient: "from-primary/20 to-transparent"
    },
    {
        title: "Production Dashboard",
        category: "Interface",
        description: "The final mission-control UI featuring dark-glassmorphism and neon telemetry.",
        icon: <Maximize2 className="text-secondary" size={24} />,
        gradient: "from-secondary/20 to-transparent"
    }
];

export default function GalleryPage() {
    return (
        <div className="container mx-auto px-6 py-32 max-w-7xl">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-24"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/20 mb-8">
                    <ImageIcon size={14} className="text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Visual Archive</span>
                </div>
                <h1 className="text-6xl font-black font-outfit mb-8 tracking-tight">System <span className="text-primary italic">Gallery</span></h1>
                <p className="text-xl text-text-muted max-w-2xl font-medium leading-relaxed">
                    A collection of technical visualizations, architectural blueprints, and
                    interface snapshots defining the NEXUS Anomaly Detection System.
                </p>
            </motion.div>

            {/* Gallery Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {galleryItems.map((item, i) => (
                    <motion.div
                        key={item.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="group premium-card p-1 overflow-hidden"
                    >
                        <div className="relative aspect-video rounded-xl overflow-hidden bg-obsidian mb-6">
                            <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-50 group-hover:opacity-100 transition-opacity duration-500`} />
                            <div className="absolute inset-0 bg-grid opacity-10" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <motion.div
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    className="p-6 rounded-2xl bg-white/5 border border-glass-border backdrop-blur-lg shadow-2xl"
                                >
                                    {item.icon}
                                </motion.div>
                            </div>
                            <div className="absolute bottom-4 left-4">
                                <span className="text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-black/60 border border-glass-border text-primary">
                                    {item.category}
                                </span>
                            </div>
                        </div>

                        <div className="p-6">
                            <h3 className="text-2xl font-bold font-outfit mb-3 group-hover:text-primary transition-colors">{item.title}</h3>
                            <p className="text-text-muted text-sm font-medium leading-relaxed mb-6">
                                {item.description}
                            </p>
                            <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary hover:gap-4 transition-all">
                                View Full Definition <Maximize2 size={12} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Research Footer */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="mt-32 p-12 rounded-[2rem] bg-gradient-to-r from-primary/5 to-secondary/5 border border-glass-border text-center max-w-4xl mx-auto"
            >
                <Database className="text-primary/40 mx-auto mb-6" size={48} />
                <h4 className="text-2xl font-bold font-outfit mb-4">Dataset Integrity</h4>
                <p className="text-text-muted font-medium mb-0">
                    All visualizations are rendered using live data samples from the LDR NEXUS training set,
                    ensuring mathematical accuracy in representation.
                </p>
            </motion.div>
        </div>
    );
}
