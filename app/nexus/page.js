"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Brain, Zap, MessageSquare, Send, Github, Linkedin, Twitter, Terminal } from 'lucide-react';

export default function NexusConnect() {
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
                    The final bridge in the NEXUS ecosystem. Connect with the research,
                    the code, and the team driving AI innovation.
                </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-20 items-center">
                {/* Connection Box */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="premium-card p-12 bg-primary/5 border-primary/20"
                >
                    <h3 className="text-3xl font-black font-outfit mb-8 italic">Stay <span className="text-primary">Synced</span></h3>
                    <p className="text-text-muted font-medium mb-12">
                        Get notified about the next phase of NEXUS security updates
                        and edge-AI breakthroughs.
                    </p>

                    <div className="space-y-6">
                        <div className="relative group">
                            <input
                                type="email"
                                placeholder="neural_id@nexus.com"
                                className="w-full bg-black/40 border border-glass-border rounded-2xl p-6 text-sm font-medium focus:outline-none focus:border-primary/50 transition-all pl-14"
                            />
                            <MessageSquare className="absolute left-6 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={20} />
                        </div>
                        <button className="neon-button w-full !py-6 group">
                            Establish Connection
                            <Send size={18} className="ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </button>
                    </div>

                    <div className="mt-12 pt-12 border-t border-glass-border flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-text-muted">
                        <span>Link established 2026</span>
                        <div className="flex gap-6">
                            <Twitter size={16} className="hover:text-primary cursor-pointer transition-colors" />
                            <Github size={16} className="hover:text-primary cursor-pointer transition-colors" />
                            <Linkedin size={16} className="hover:text-primary cursor-pointer transition-colors" />
                        </div>
                    </div>
                </motion.div>

                {/* Decorative Visual */}
                <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-[120px] opacity-30 rounded-full" />
                    <div className="premium-card p-2 aspect-square flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-grid opacity-10" />
                        <div className="relative z-10 p-12 text-center">
                            <div className="mb-12 animate-pulse">
                                <Brain size={120} className="text-primary mx-auto" strokeWidth={1} />
                            </div>
                            <div className="space-y-4">
                                <div className="h-1 w-48 bg-primary/20 mx-auto rounded-full" />
                                <div className="h-1 w-32 bg-primary/10 mx-auto rounded-full" />
                                <div className="h-1 w-20 bg-primary/5 mx-auto rounded-full" />
                            </div>
                            <div className="mt-12 flex items-center gap-3 justify-center text-primary">
                                <Terminal size={16} />
                                <span className="text-[10px] font-black uppercase tracking-widest">System Ready</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Text */}
            <div className="mt-32 text-center opacity-30">
                <p className="text-[8px] uppercase tracking-[0.5em] font-black">Design & AI Engineered by Ojasw • Research Milestone Prototype v1.5.0</p>
            </div>
        </div>
    );
}
