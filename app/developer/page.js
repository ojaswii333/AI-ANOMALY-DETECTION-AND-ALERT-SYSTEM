"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Code, Github, Linkedin, Mail, Cpu, Globe, Rocket, Terminal, FileText } from 'lucide-react';

export default function DeveloperPage() {
    return (
        <div className="container mx-auto px-6 py-32 max-w-6xl">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-32"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/5 border border-secondary/20 mb-8">
                    <Terminal size={14} className="text-secondary" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary">Lead Architect</span>
                </div>
                <h1 className="text-6xl font-black font-outfit mb-8">Developer <span className="text-secondary italic">Portfolio</span></h1>
                <p className="text-xl text-text-muted max-w-3xl mx-auto font-medium leading-relaxed">
                    Engineering every layer of the NEXUS stack—from raw telemetry
                    processing to advanced AI modeling and visual experiences.
                </p>
            </motion.div>

            {/* Developer Details */}
            <div className="grid lg:grid-cols-2 gap-16 items-start">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="space-y-12"
                >
                    <div className="flex items-center gap-8">
                        <div className="h-40 w-40 rounded-[2.5rem] bg-secondary flex items-center justify-center rotate-3 hover:rotate-0 transition-transform duration-500 shadow-[0_0_50px_rgba(139,92,246,0.3)]">
                            <span className="text-obsidian text-6xl font-black font-outfit">OA</span>
                        </div>
                        <div>
                            <h2 className="text-4xl font-black font-outfit">Ojaswi Anand Sharma</h2>
                            <p className="text-secondary font-bold uppercase tracking-widest text-sm mt-1">4th Year Student • Centre for IOT</p>
                            <div className="flex gap-4 mt-6">
                                <a href="#" border-secondary title="LinkedIn" className="p-3 rounded-xl bg-white/5 border border-glass-border hover:bg-secondary/20 hover:border-secondary transition-all">
                                    <Linkedin size={20} />
                                </a>
                                <a href="#" title="Instagram" className="p-3 rounded-xl bg-white/5 border border-glass-border hover:bg-secondary/20 hover:border-secondary transition-all">
                                    <Globe size={20} />
                                </a>
                                <a href="#" title="Resume" className="p-3 rounded-xl bg-secondary/10 border border-secondary/20 hover:bg-secondary text-secondary hover:text-obsidian transition-all flex items-center gap-2 px-6">
                                    <FileText size={16} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">CV</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="premium-card p-10 bg-secondary/5 border-secondary/20">
                        <h3 className="text-2xl font-bold font-outfit mb-6 flex items-center gap-3">
                            <Rocket className="text-secondary" size={24} />
                            Mission Control
                        </h3>
                        <p className="text-text-muted font-medium leading-relaxed mb-8">
                            Building systems that bridge the physical and digital worlds. My focus is on
                            high-performance data pipelines and intuitive AI visualizations that make
                            complex anomalies understandable at a glance.
                        </p>
                        <button className="w-full py-4 rounded-xl bg-secondary text-obsidian font-black uppercase tracking-widest text-xs hover:scale-[1.02] transition-transform shadow-xl">
                            Download Resume
                        </button>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="grid gap-6"
                >
                    {[
                        { title: "Python Excellence", icon: <Cpu />, tags: ["Scikit-Learn", "FastAPI", "NumPy", "Pandas"], color: "secondary" },
                        { title: "Modern Web Stack", icon: <Code />, tags: ["Next.js", "Tailwind v4", "Framer Motion", "GSAP"], color: "primary" },
                        { title: "Core Strengths", icon: <Terminal />, tags: ["Anomaly Detection", "IoT Telemetry", "High-Fidelity UI"], color: "secondary" }
                    ].map((skill) => (
                        <div key={skill.title} className="premium-card p-8 group">
                            <div className={`mb-6 p-3 rounded-xl bg-${skill.color}/5 border border-${skill.color}/20 w-fit group-hover:bg-${skill.color}/20 transition-colors`}>
                                {React.cloneElement(skill.icon, { size: 24, className: `text-${skill.color}` })}
                            </div>
                            <h4 className="text-xl font-bold font-outfit mb-4">{skill.title}</h4>
                            <div className="flex flex-wrap gap-2">
                                {skill.tags.map(tag => (
                                    <span key={tag} className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-white/5 border border-glass-border text-text-muted`}>
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
