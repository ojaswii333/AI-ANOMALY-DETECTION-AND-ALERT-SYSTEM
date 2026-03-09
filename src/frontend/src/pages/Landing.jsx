import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Zap, Info, Users, Cpu } from 'lucide-react';

const Landing = () => {
    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Background Effects */}
            <div className="bg-grid absolute inset-0 opacity-20 pointer-events-none" />
            <div className="mesh-gradient absolute inset-0 pointer-events-none" />

            {/* Hero Section */}
            <section className="container mx-auto px-6 pt-32 pb-20 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="inline-block rounded-full border border-[var(--primary)] px-4 py-1 text-xs font-bold uppercase tracking-widest text-[var(--primary)] shadow-[0_0_15px_var(--primary-glow)]">
                        Award-Winning IoT Experiment
                    </span>
                    <h1 className="mt-8 text-6xl font-extrabold lg:text-8xl">
                        AI-Powered <br />
                        <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]">
                            Anomaly Detection
                        </span>
                    </h1>
                    <p className="mx-auto mt-8 max-w-2xl text-xl text-[var(--text-muted)] lg:text-2xl">
                        A production-grade neural-statistical hybrid for real-time sensor monitoring and predictive alerting.
                    </p>

                    <div className="mt-12 flex flex-wrap justify-center gap-6">
                        <Link to="/dashboard" className="neon-button inline-flex items-center justify-center">
                            Explore Dashboard
                        </Link>
                        <Link to="/docs" className="rounded-full border border-white/10 bg-white/5 px-8 py-3 text-sm font-bold uppercase tracking-widest backdrop-blur-md transition-all hover:bg-white/10 decoration-transparent">
                            Read Documentation
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/* Floating Elements (Background) */}
            <motion.div
                className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-[var(--primary-glow)] blur-3xl"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 8, repeat: Infinity }}
            />
        </div>
    );
};

export default Landing;
