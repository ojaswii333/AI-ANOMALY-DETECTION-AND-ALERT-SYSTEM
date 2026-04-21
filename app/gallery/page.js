"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, X, Cpu, Database, Activity, Shield, Monitor, Network } from 'lucide-react';

const galleryItems = [
    {
        title: "ESP32 Hardware Setup",
        category: "Hardware",
        description: "Physical ESP32 NodeMCU development board wired to an LDR photoresistor via a 10k ohm voltage divider circuit on a breadboard, ready for analog light intensity data acquisition.",
        image: "/hardware_setup.png",
        icon: <Cpu className="text-primary" size={24} />,
    },
    {
        title: "Live Dashboard Interface",
        category: "Software",
        description: "The real-time AI Command dashboard showing live signal propagation charts, status metric cards (Ingest Packets, ML Engine, Flagged Events), and the Alert Stream panel with SPIKE/DIP classification badges.",
        image: "/dashboard_preview.png",
        icon: <Monitor className="text-secondary" size={24} />,
    },
    {
        title: "System Architecture Diagram",
        category: "Blueprint",
        description: "Complete multi-layer architecture showing the data flow from ESP32 Edge Node through WiFi transmission to the FastAPI backend, Isolation Forest ML inference engine, SQLite persistence, and the Next.js reactive frontend.",
        image: "/sys_arch.png",
        icon: <Network className="text-primary" size={24} />,
    },
    {
        title: "Anomaly Detection Results",
        category: "Analytics",
        description: "Time-series visualization plotting LDR sensor values over a 72-hour testing window. Red markers indicate AI-flagged anomalies (spikes above 900 and dips below 100) detected by the Isolation Forest model.",
        image: "/anomaly_chart.png",
        icon: <Activity className="text-secondary" size={24} />,
    },
    {
        title: "ML Pipeline Workflow",
        category: "AI Model",
        description: "Step-by-step machine learning pipeline from raw sensor data ingestion, feature scaling via StandardScaler, Isolation Forest training with 100 estimators, to real-time anomaly scoring and classification output.",
        image: "/ml_pipeline.png",
        icon: <Database className="text-primary" size={24} />,
    },
    {
        title: "Data Flow Diagram",
        category: "Infrastructure",
        description: "Level-0 Data Flow Diagram mapping how sensor readings travel from the ESP32 physical layer through HTTP POST requests, backend processing, database storage, and finally to the client-side visualization layer.",
        image: "/dfd_level_0.png",
        icon: <Shield className="text-secondary" size={24} />,
    },
];

export default function GalleryPage() {
    const [lightbox, setLightbox] = useState(null);

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
                    Hardware photographs, architectural blueprints, analytics charts, and
                    interface snapshots documenting every layer of the AI Anomaly Detection System.
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
                        <div 
                            className="relative aspect-video rounded-xl overflow-hidden bg-obsidian mb-6 cursor-pointer"
                            onClick={() => setLightbox(item)}
                        >
                            <img 
                                src={item.image} 
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                            <div className="absolute bottom-4 left-4">
                                <span className="text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-black/60 border border-glass-border text-primary backdrop-blur-sm">
                                    {item.category}
                                </span>
                            </div>
                        </div>

                        <div className="p-6">
                            <h3 className="text-2xl font-bold font-outfit mb-3 group-hover:text-primary transition-colors">{item.title}</h3>
                            <p className="text-text-muted text-sm font-medium leading-relaxed mb-6">
                                {item.description}
                            </p>
                            <button 
                                onClick={() => setLightbox(item)}
                                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary hover:gap-4 transition-all"
                            >
                                View Full Image <ImageIcon size={12} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {lightbox && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-8"
                        onClick={() => setLightbox(null)}
                    >
                        <button className="absolute top-8 right-8 p-3 rounded-xl bg-white/10 border border-glass-border hover:bg-white/20 transition-colors text-white" onClick={() => setLightbox(null)}>
                            <X size={24} />
                        </button>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="max-w-5xl w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img src={lightbox.image} alt={lightbox.title} className="w-full rounded-2xl shadow-2xl" />
                            <div className="mt-6 text-center">
                                <h3 className="text-2xl font-bold font-outfit text-white">{lightbox.title}</h3>
                                <p className="text-white/60 text-sm mt-2">{lightbox.description}</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Research Footer */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="mt-32 p-12 rounded-[2rem] bg-gradient-to-r from-primary/5 to-secondary/5 border border-glass-border text-center max-w-4xl mx-auto"
            >
                <Database className="text-primary/40 mx-auto mb-6" size={48} />
                <h4 className="text-2xl font-bold font-outfit mb-4">Dataset Integrity</h4>
                <p className="text-text-muted font-medium mb-0">
                    All visualizations are rendered using live data samples from the LDR NEXUS training set
                    and real hardware photographs taken during the development and testing phases.
                </p>
            </motion.div>
        </div>
    );
}
