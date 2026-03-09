"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

const typeStyles = {
    primary: "border-primary/20 bg-primary/5 text-primary hover:shadow-[0_0_50px_-10px_rgba(0,242,255,0.4)] hover:border-primary/40",
    secondary: "border-secondary/20 bg-secondary/5 text-secondary hover:shadow-[0_0_50px_-10px_rgba(139,92,246,0.4)] hover:border-secondary/40",
    danger: "border-anomaly/20 bg-anomaly/5 text-anomaly hover:shadow-[0_0_50px_-10px_rgba(255,46,46,0.4)] hover:border-anomaly/40",
    success: "border-success/20 bg-success/5 text-success hover:shadow-[0_0_50px_-10px_rgba(16,185,129,0.4)] hover:border-success/40",
};

export default function StatusCard({ title, value, icon, type = "primary", className }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ translateY: -4 }}
            className={twMerge(
                "premium-card flex flex-col items-center justify-center text-center p-8 border-2 transition-all duration-300",
                typeStyles[type],
                className
            )}
        >
            <div className="mb-4 p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
                {React.cloneElement(icon, { size: 28 })}
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60 mb-2">
                {title}
            </p>
            <h3 className="text-4xl font-black font-outfit tracking-tighter">
                {value}
            </h3>
        </motion.div>
    );
}
