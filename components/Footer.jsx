"use client";

import React from 'react';
import Link from 'next/link';
import { Shield, Github, Mail, Linkedin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="relative z-10 border-t border-glass-border bg-obsidian/50 backdrop-blur-md pt-16 pb-8 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="flex items-center gap-3 mb-6">
                            <Shield className="text-primary" size={28} />
                            <span className="text-2xl font-bold tracking-tight text-text-main font-outfit">
                                AI <span className="text-primary opacity-80">ANOMALY</span>
                            </span>
                        </Link>
                        <p className="text-text-muted text-sm leading-relaxed max-w-sm">
                            Advanced anomaly detection system utilizing Isolation Forest machine learning 
                            to secure IoT sensor networks. Built with ESP32, FastAPI, and Next.js.
                            A research project by the Centre for IoT.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-text-main font-bold mb-6 font-outfit text-sm uppercase tracking-widest">Navigation</h4>
                        <ul className="space-y-4 text-text-muted text-sm">
                            <li><Link href="/dashboard" className="hover:text-primary transition-colors">Live Dashboard</Link></li>
                            <li><Link href="/model" className="hover:text-primary transition-colors">AI Architecture</Link></li>
                            <li><Link href="/project" className="hover:text-primary transition-colors">Project Overview</Link></li>
                            <li><Link href="/gallery" className="hover:text-primary transition-colors">System Gallery</Link></li>
                            <li><Link href="/docs" className="hover:text-primary transition-colors">Technical Docs</Link></li>
                            <li><Link href="/developer" className="hover:text-primary transition-colors">Developer</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-text-main font-bold mb-6 font-outfit text-sm uppercase tracking-widest">Connect</h4>
                        <div className="flex gap-4 mb-6">
                            <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 border border-glass-border hover:border-primary/50 transition-colors">
                                <Github size={20} className="text-text-muted" />
                            </a>
                            <a href="https://linkedin.com/in/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 border border-glass-border hover:border-primary/50 transition-colors">
                                <Linkedin size={20} className="text-text-muted" />
                            </a>
                            <a href="mailto:ojaswianand@gmail.com" className="p-2 rounded-lg bg-white/5 border border-glass-border hover:border-primary/50 transition-colors">
                                <Mail size={20} className="text-text-muted" />
                            </a>
                        </div>
                        <p className="text-[10px] text-text-muted/60 uppercase tracking-tighter">
                            v4.0 Research-Grade Release
                        </p>
                    </div>
                </div>

                <div className="border-t border-glass-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-text-muted text-[10px] uppercase tracking-widest font-bold">
                        &copy; 2026 AI Anomaly System &bull; Faculty Mentor Approved
                    </p>
                    <div className="flex gap-8 text-[10px] uppercase tracking-widest font-bold text-text-muted">
                        <Link href="/docs" className="hover:text-text-main transition-colors">Docs</Link>
                        <Link href="/nexus" className="hover:text-text-main transition-colors">Contact</Link>
                        <Link href="/project" className="hover:text-text-main transition-colors">About</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
