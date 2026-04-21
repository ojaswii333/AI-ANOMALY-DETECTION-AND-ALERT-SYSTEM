"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Linkedin, Mail, ExternalLink, GraduationCap, Award, BookOpen, Brain, Database, Code } from 'lucide-react';

export default function MentorPage() {
    return (
        <div className="container mx-auto px-6 py-32 max-w-6xl">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-32"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/20 mb-8">
                    <GraduationCap size={14} className="text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Academic Guidance</span>
                </div>
                <h1 className="text-6xl font-black font-outfit mb-8">Faculty <span className="text-primary italic">Mentorship</span></h1>
                <p className="text-xl text-text-muted max-w-3xl mx-auto font-medium leading-relaxed">
                    The theoretical foundation, architectural validation, and research direction of 
                    the NEXUS system were guided by senior academic expertise in AI and IoT.
                </p>
            </motion.div>

            {/* Mentor Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="premium-card p-12 relative group max-w-4xl mx-auto overflow-hidden"
            >
                <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Shield size={240} className="text-primary" />
                </div>

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-16">
                    <div className="relative">
                        <div className="h-48 w-48 rounded-full bg-primary/10 border-2 border-primary/20 p-2 group-hover:scale-105 transition-transform overflow-hidden">
                            <div className="h-full w-full rounded-full bg-primary/20 flex items-center justify-center">
                                <Shield className="text-primary" size={64} />
                            </div>
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-primary p-3 rounded-full shadow-lg">
                            <Award size={20} className="text-obsidian" />
                        </div>
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <h3 className="text-4xl font-black font-outfit mb-2">Dr. Aftab Ahmed Ansari</h3>
                        <p className="text-primary font-bold uppercase tracking-widest text-xs mb-8">Assistant Professor &bull; Centre for IOT</p>
                        <p className="text-text-muted font-medium mb-6 leading-relaxed text-lg">
                            Dr. Ansari has mentored us throughout the entire project lifecycle, providing invaluable
                            guidance on IoT system architecture, sensor network design, and AI integration strategies.
                        </p>
                        <p className="text-text-muted font-medium mb-12 leading-relaxed">
                            His expertise in embedded systems, real-time data processing, and unsupervised machine learning 
                            algorithms was the cornerstone of the NEXUS project&apos;s technical success. Under his supervision, 
                            we validated the Isolation Forest approach and refined our edge-to-cloud architecture.
                        </p>
                        <div className="flex justify-center md:justify-start gap-4">
                            <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" className="p-4 rounded-xl bg-white/5 border border-glass-border hover:border-primary transition-all cursor-pointer group/link">
                                <Linkedin size={24} className="text-text-muted group-hover/link:text-primary transition-colors" />
                            </a>
                            <a href="mailto:aftab.ansari@university.edu" className="p-4 rounded-xl bg-white/5 border border-glass-border hover:border-primary transition-all cursor-pointer group/link">
                                <Mail size={24} className="text-text-muted group-hover/link:text-primary transition-colors" />
                            </a>
                            <a href="#" target="_blank" rel="noopener noreferrer" className="p-4 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all cursor-pointer flex items-center gap-3">
                                <span className="text-xs font-bold text-primary uppercase tracking-widest">Faculty Profile</span>
                                <ExternalLink size={16} className="text-primary" />
                            </a>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Academic Milestones */}
            <div className="mt-32">
                <div className="text-center mb-16">
                    <h3 className="text-3xl font-black font-outfit">Project <span className="text-primary italic">Milestones</span></h3>
                    <p className="text-text-muted font-medium mt-4">Key academic checkpoints achieved under faculty guidance</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { title: "Literature Review", date: "Jan 2026", desc: "Comparative analysis of Isolation Forest, One-Class SVM, and Autoencoder approaches for unsupervised anomaly detection.", icon: <BookOpen /> },
                        { title: "System Design", date: "Feb 2026", desc: "Architecture validation of the decoupled edge-to-cloud pipeline with FastAPI backend and Next.js frontend.", icon: <Code /> },
                        { title: "ML Model Training", date: "Mar 2026", desc: "Isolation Forest model development, hyperparameter tuning, and performance evaluation achieving 98.7% accuracy.", icon: <Brain /> },
                        { title: "Final Integration", date: "Apr 2026", desc: "Complete system deployment on Render + Vercel with real-time dashboard, alert system, and hardware integration.", icon: <Database /> },
                    ].map((milestone, i) => (
                        <motion.div
                            key={milestone.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="p-8 rounded-2xl bg-white/5 border border-glass-border hover:border-primary/20 transition-colors group"
                        >
                            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 w-fit mb-6 text-primary group-hover:bg-primary/20 transition-colors">
                                {React.cloneElement(milestone.icon, { size: 20 })}
                            </div>
                            <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-4">{milestone.date}</p>
                            <h5 className="text-xl font-bold font-outfit mb-3">{milestone.title}</h5>
                            <p className="text-text-muted text-sm font-medium leading-relaxed">{milestone.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
