import React from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, Target, BarChart3 } from 'lucide-react';

const InsightsPage = () => {
    const metrics = [
        { label: 'Precision', value: '95.5%', icon: <Target className="text-[var(--primary)]" /> },
        { label: 'Recall', value: '92.1%', icon: <TrendingUp className="text-[var(--secondary)]" /> },
        { label: 'F1-Score', value: '93.5%', icon: <BarChart3 className="text-[var(--primary)]" /> },
        { label: 'Accuracy', value: '98.3%', icon: <Brain className="text-[var(--secondary)]" /> },
    ];

    return (
        <div className="container mx-auto px-6 py-32">
            <div className="text-center mb-16">
                <h1 className="text-5xl font-extrabold mb-4">Neural Insights</h1>
                <p className="text-[var(--text-muted)] max-w-2xl mx-auto">
                    A deep dive into the performance and logic of our Isolation Forest anomaly detection engine.
                </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6 mb-16">
                {metrics.map((m, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="premium-card text-center"
                    >
                        <div className="h-10 w-10 mx-auto mb-4 flex items-center justify-center opacity-80">
                            {m.icon}
                        </div>
                        <div className="text-3xl font-bold mb-1 Outfit">{m.value}</div>
                        <div className="text-xs uppercase tracking-widest text-[var(--text-muted)] font-bold">{m.label}</div>
                    </motion.div>
                ))}
            </div>

            <div className="premium-card">
                <h3 className="text-2xl font-bold mb-6">Algorithm Explanation</h3>
                <div className="grid md:grid-cols-2 gap-10 items-center">
                    <div className="space-y-4 text-[var(--text-muted)] leading-relaxed">
                        <p>
                            Our system utilizes the <strong>Isolation Forest</strong> algorithm, an unsupervised
                            approach that isolates anomalies instead of profiling normal points.
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-sm">
                            <li><strong>Recursive Partitioning:</strong> Anomalies are susceptible to isolation.</li>
                            <li><strong>Path Length Strategy:</strong> Anomalous points have shorter path lengths in the trees.</li>
                            <li><strong>Scalability:</strong> Optimized for high-frequency sensor streams (1Hz - 1kHz).</li>
                        </ul>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-8 border border-white/5 flex items-center justify-center">
                        {/* Placeholder for an SVG Diagram or Plot */}
                        <div className="text-center italic opacity-40">
                            [Interactive AI Flow Diagram]
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InsightsPage;
