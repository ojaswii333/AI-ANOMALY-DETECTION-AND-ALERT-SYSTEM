"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ShieldAlert, Cpu, Database, RefreshCw, Terminal, AlertTriangle, Layers } from 'lucide-react';
import LiveChart from '../../components/LiveChart';
import RecentReadings from '../../components/RecentReadings';
import AlertCenter from '../../components/AlertCenter';
import StatusCard from '../../components/StatusCard';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function DashboardPage() {
    const [stats, setStats] = useState({
        total_readings: 0,
        total_anomalies: 0,
        anomaly_rate: '0%',
        model_info: { is_trained: false }
    });
    const [readings, setReadings] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [streamStatus, setStreamStatus] = useState('OFFLINE'); // 'LIVE' | 'IDLE' | 'OFFLINE'
    const [prevReadingCount, setPrevReadingCount] = useState(0);

    const fetchData = async () => {
        try {
            const [statsRes, historyRes, alertsRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/stats`),
                axios.get(`${API_BASE_URL}/history?limit=50`),
                axios.get(`${API_BASE_URL}/alerts/recent?limit=10`)
            ]);
            setStats(statsRes.data);
            const newReadings = historyRes.data.readings || [];
            setReadings(newReadings);
            setAlerts(alertsRes.data.alerts || []);
            setLastUpdated(new Date());
            setLoading(false);

            // Check if new data is flowing in
            const currentCount = statsRes.data.total_readings || 0;
            if (currentCount > prevReadingCount && prevReadingCount > 0) {
                setStreamStatus('LIVE');
            } else if (currentCount > 0) {
                setStreamStatus('IDLE');
            } else {
                setStreamStatus('IDLE');
            }
            setPrevReadingCount(currentCount);
        } catch (error) {
            console.error("Dashboard Fetch Error:", error);
            setStreamStatus('OFFLINE');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 3000);
        return () => clearInterval(interval);
    }, []);

    if (loading && readings.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-obsidian text-text-main">
                <div className="text-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="mb-8"
                    >
                        <RefreshCw size={56} className="text-primary mx-auto" strokeWidth={1} />
                    </motion.div>
                    <p className="text-primary text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">Neural Nexus Uplink Active...</p>
                    <div className="mt-8 flex gap-2 justify-center">
                        <div className="h-1 w-12 bg-primary/20 rounded-full overflow-hidden">
                            <motion.div
                                animate={{ x: [-48, 48] }}
                                transition={{ duration: 1, repeat: Infinity }}
                                className="h-full w-full bg-primary"
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const dismissAlert = async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/alerts/${id}`);
            fetchData();
        } catch (error) {
            console.error("Alert Dismiss Error:", error);
        }
    };

    return (
        <div className="container mx-auto px-6 py-32 min-h-screen">
            {/* Command Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8 border-l-2 border-primary/20 pl-8"
            >
                <div>
                    <div className="flex items-center gap-2 text-primary mb-4">
                        <Terminal size={16} />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">System.initialize() — Nexus Active</span>
                    </div>
                    <h1 className="text-6xl font-black font-outfit tracking-tighter">AI <span className="text-primary italic">COMMAND</span></h1>
                    <p className="mt-3 text-text-muted font-medium max-w-xl text-lg leading-relaxed">
                        Real-time neural telemetry and anomaly orchestration.
                        Monitoring all Edge sensor packets via NEXUS-1 Gateway.
                    </p>
                </div>

                <div className="flex items-center gap-6">
                    <div className="text-right hidden md:block">
                        <p className="text-[8px] font-black uppercase tracking-widest text-text-muted mb-1">Last Neural Sync</p>
                        <p className="text-xs font-mono text-primary">{lastUpdated.toLocaleTimeString()}</p>
                    </div>
                    <div className={`premium-card flex items-center gap-4 py-3 px-6 ${streamStatus === 'LIVE' ? 'bg-primary/5 border-primary/20' :
                            streamStatus === 'IDLE' ? 'bg-amber-500/5 border-amber-500/20' :
                                'bg-red-500/5 border-red-500/20'
                        }`}>
                        <div className={`h-3 w-3 rounded-full ${streamStatus === 'LIVE' ? 'bg-primary animate-ping' :
                                streamStatus === 'IDLE' ? 'bg-amber-500 animate-pulse' :
                                    'bg-red-500'
                            }`} />
                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${streamStatus === 'LIVE' ? 'text-primary' :
                                streamStatus === 'IDLE' ? 'text-amber-500' :
                                    'text-red-500'
                            }`}>Neural Stream {streamStatus}</span>
                    </div>
                </div>
            </motion.div>

            {/* Metrics Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-16">
                <StatusCard
                    title="Ingest Packets"
                    value={stats.total_readings.toLocaleString()}
                    icon={<Database />}
                    type="primary"
                />
                <StatusCard
                    title="ML Engine"
                    value={stats.model_info?.is_trained ? "Isolation Forest" : "Calibrating"}
                    icon={<Cpu />}
                    type="secondary"
                />
                <StatusCard
                    title="Flagged Events"
                    value={stats.total_anomalies}
                    icon={<ShieldAlert size={24} />}
                    type="danger"
                />
                <StatusCard
                    title="Neural Drift"
                    value={stats.anomaly_rate}
                    icon={<Activity />}
                    type="success"
                />
            </div>

            {/* Visual Analytics Section */}
            <div className="grid gap-12 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="premium-card p-12 bg-obsidian-light"
                    >
                        <div className="flex items-center justify-between mb-12">
                            <div>
                                <h3 className="text-3xl font-black font-outfit italic tracking-tight">Signal <span className="text-primary text-2xl not-italic opacity-80">Propagation</span></h3>
                                <p className="text-[10px] uppercase tracking-[0.3em] text-text-muted font-black mt-2">NEXUS Energy Intensity Monitoring</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/5 border border-glass-border">
                                <Layers size={20} className="text-primary animate-pulse" />
                            </div>
                        </div>
                        <div className="h-[400px]">
                            <LiveChart data={readings} />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <RecentReadings readings={[...readings].reverse()} />
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <AlertCenter alerts={alerts} onDismiss={dismissAlert} />
                </motion.div>
            </div>

            {/* Footer Tag */}
            <div className="mt-32 text-center opacity-20 hover:opacity-100 transition-opacity">
                <p className="text-[10px] font-black uppercase tracking-[0.8em] text-text-muted">Research Monitoring Interface • System Instance v2.0</p>
            </div>
        </div>
    );
}

