import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Network, Zap, ShieldCheck } from 'lucide-react';

const AboutPage = () => {
    return (
        <div className="container mx-auto px-6 py-32">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto"
            >
                <h1 className="text-5xl font-extrabold mb-8 italic">Project Genesis</h1>
                <p className="text-xl text-[var(--text-muted)] leading-relaxed mb-12">
                    In an increasingly automated world, sensor integrity is the cornerstone of safety.
                    Our system addresses the critical problem of <strong>silent sensor failure</strong>
                    by utilizing unsupervised machine learning to detect anomalies in real-time.
                </p>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="premium-card">
                        <div className="h-12 w-12 rounded-lg bg-[var(--primary-glow)] flex items-center justify-center text-[var(--primary)] mb-4">
                            <Layers size={24} />
                        </div>
                        <h4 className="text-lg font-bold mb-2">System Architecture</h4>
                        <p className="text-sm text-[var(--text-muted)]">
                            A decentralized edge-to-cloud pipeline using FastAPI and SQLite.
                        </p>
                    </div>
                    <div className="premium-card">
                        <div className="h-12 w-12 rounded-lg bg-[var(--secondary-glow)] flex items-center justify-center text-[var(--secondary)] mb-4">
                            <Network size={24} />
                        </div>
                        <h4 className="text-lg font-bold mb-2">Isolation Forest</h4>
                        <p className="text-sm text-[var(--text-muted)]">
                            Leveraging tree-based isolation for superior anomaly detection.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AboutPage;
