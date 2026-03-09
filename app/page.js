"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, Brain, Activity, Zap, ArrowRight, CheckCircle2, Cpu } from 'lucide-react';
import NeuralBackground from '../components/NeuralBackground';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

export default function LandingPage() {
  return (
    <div className="flex flex-col gap-32 pb-32">
      <NeuralBackground />
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-6 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[160px] opacity-20 animate-pulse pointer-events-none" />

        <motion.div
          className="max-w-5xl mx-auto text-center z-10"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/20 mb-8">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Next-Gen Intelligence</span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-black mb-8 leading-[1.1] font-outfit">
            AI <span className="text-primary italic">Anomaly</span> <br /> Detection System
          </motion.h1>

          <motion.p variants={itemVariants} className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
            A research-grade AI monitoring system powered by <span className="text-text-main">Isolation Forest</span> algorithms to detect ultra-subtle pattern deviations in real-time telemetry streams.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-6">
            <Link href="/dashboard" className="neon-button group">
              Launch Dashboard
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
            <Link href="/project" className="px-8 py-3 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-sm font-bold uppercase tracking-widest backdrop-blur-md">
              System Architecture
            </Link>
          </motion.div>
        </motion.div>

        {/* Floating Particle Simulation (Placeholder for Visuals) */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-1 w-1 bg-primary/40 rounded-full"
              initial={{ opacity: 0, x: Math.random() * 2000, y: Math.random() * 1000 }}
              animate={{
                opacity: [0, 0.5, 0],
                y: [null, Math.random() * -200],
                transition: { duration: Math.random() * 10 + 5, repeat: Infinity, ease: "linear" }
              }}
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 max-w-7xl mx-auto w-full">
        <div className="text-center mb-20">
          <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-primary mb-4">Core Capabilities</h2>
          <h3 className="text-4xl font-extrabold font-outfit">Intelligent Edge Processing</h3>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: "Real-Time Detection", icon: <Zap />, desc: "Sub-millisecond latency for live sensor telemetry processing." },
            { title: "Smart Alert Engine", icon: <Activity />, desc: "Color-coded anomaly flagging with instant notification triggers." },
            { title: "Isolation Intelligence", icon: <Brain />, desc: "Advanced unsupervised learning for zero-day pattern detection." }
          ].map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="premium-card p-10 group"
            >
              <div className="mb-6 p-4 rounded-2xl bg-primary/5 border border-primary/20 w-fit group-hover:bg-primary/20 transition-colors">
                {React.cloneElement(feat.icon, { className: "text-primary", size: 32 })}
              </div>
              <h4 className="text-2xl font-bold mb-4 font-outfit">{feat.title}</h4>
              <p className="text-text-muted leading-relaxed font-medium">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* System Workflow Section */}
      <section className="px-6 py-32 bg-surface/50 border-y border-glass-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-secondary mb-6">Scientific Pipeline</h2>
              <h3 className="text-5xl font-black font-outfit mb-8">How the Intelligence Flows</h3>
              <p className="text-lg text-text-muted mb-12 font-medium">
                Our system follows a structured data-to-insight pipeline, ensuring every packet is verified against our baseline behavior model.
              </p>

              <div className="space-y-6">
                {[
                  "LDR Sensor Signal Acquisition",
                  "Preprocessing & Noise Reduction",
                  "Isolation Forest Feature Inference",
                  "Real-time Dashboard Visualization"
                ].map((step, i) => (
                  <div key={step} className="flex items-center gap-4 group">
                    <div className="h-10 w-10 rounded-full bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary font-bold group-hover:bg-secondary/20 transition-colors">
                      {i + 1}
                    </div>
                    <span className="font-bold text-text-main/80">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="premium-card p-4 aspect-square flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-grid opacity-20" />
                {/* Simulated Pipeline UI */}
                <div className="relative z-10 flex flex-col items-center gap-8 w-full p-8 text-center">
                  <div className="p-6 rounded-full bg-primary/10 border border-primary/30 animate-pulse">
                    <Cpu size={48} className="text-primary" />
                  </div>
                  <div className="w-1 h-20 bg-gradient-to-b from-primary to-secondary opacity-50" />
                  <div className="p-6 rounded-full bg-secondary/10 border border-secondary/30">
                    <Shield size={48} className="text-secondary" />
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 h-32 w-32 bg-primary/20 blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6">
        <div className="max-w-5xl mx-auto premium-card p-20 text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform">
            <Brain size={200} className="text-primary" />
          </div>
          <h3 className="text-5xl font-black font-outfit mb-8">Ready to analyze sensor intelligence?</h3>
          <p className="text-xl text-text-muted mb-12 font-medium max-w-2xl mx-auto">
            Experience the full research dashboard and view the real-time processing engine in action.
          </p>
          <Link href="/dashboard" className="neon-button !text-lg !py-5 !px-12">
            Launch Detection Dashboard
          </Link>
        </div>
      </section>
    </div>
  );
}
