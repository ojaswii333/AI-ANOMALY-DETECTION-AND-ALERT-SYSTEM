"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, LayoutDashboard, Brain, Users, FileText, Menu, X, Rocket, Terminal, Sun, Moon, Image as ImageIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Insights', href: '/model', icon: <Brain size={18} /> },
    { name: 'Project', href: '/project', icon: <Shield size={18} /> },
    { name: 'Gallery', href: '/gallery', icon: <ImageIcon size={18} /> },
    { name: 'Mentor', href: '/mentor', icon: <Users size={18} /> },
    { name: 'Developer', href: '/developer', icon: <Rocket size={18} /> },
    { name: 'Nexus', href: '/nexus', icon: <Terminal size={18} /> },
    { name: 'Docs', href: '/docs', icon: <FileText size={18} /> },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [lightMode, setLightMode] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (lightMode) {
            document.documentElement.classList.add('light-mode');
        } else {
            document.documentElement.classList.remove('light-mode');
        }
    }, [lightMode]);

    return (
        <nav
            className={twMerge(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
                scrolled ? "bg-obsidian/80 backdrop-blur-xl border-b border-glass-border shadow-2xl" : "bg-transparent"
            )}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 group-hover:border-primary/50 transition-colors">
                        <Shield className="text-primary group-hover:scale-110 transition-transform" size={24} />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-text-main font-outfit">
                        AI <span className="text-primary opacity-80">ANOMALY</span>
                    </span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden xl:flex items-center gap-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={twMerge(
                                "flex items-center gap-2 px-3 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all",
                                pathname === link.href
                                    ? "bg-primary/10 text-primary border border-primary/20"
                                    : "text-text-muted hover:text-text-main hover:bg-white/5"
                            )}
                        >
                            {link.icon}
                            {link.name}
                        </Link>
                    ))}
                    <div className="h-6 w-[1px] bg-glass-border mx-2" />
                    
                    {/* Theme Toggle */}
                    <button
                        onClick={() => setLightMode(!lightMode)}
                        className="p-2 rounded-full bg-white/5 border border-glass-border hover:bg-white/10 transition-all mr-2"
                        title={lightMode ? "Switch to Dark Mode" : "Switch to Light Mode"}
                    >
                        {lightMode ? <Moon size={16} className="text-text-muted" /> : <Sun size={16} className="text-text-muted" />}
                    </button>
                    
                    <Link href="/dashboard" className="neon-button !py-2 !px-5 !text-[10px]">
                        Live Analytics
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <div className="xl:hidden flex items-center gap-2">
                    <button
                        onClick={() => setLightMode(!lightMode)}
                        className="p-2 rounded-full bg-white/5 border border-glass-border"
                    >
                        {lightMode ? <Moon size={18} /> : <Sun size={18} />}
                    </button>
                    <button
                        className="p-2 text-text-muted transition-colors"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="xl:hidden absolute top-full left-0 right-0 bg-obsidian border-b border-glass-border overflow-hidden px-6 pb-6"
                    >
                        <div className="flex flex-col gap-4 py-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={twMerge(
                                        "flex items-center gap-3 text-lg font-medium",
                                        pathname === link.href ? "text-primary" : "text-text-muted"
                                    )}
                                >
                                    {link.icon}
                                    {link.name}
                                </Link>
                            ))}
                            <Link href="/dashboard" className="neon-button mt-4 text-center">
                                Launch Dashboard
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
