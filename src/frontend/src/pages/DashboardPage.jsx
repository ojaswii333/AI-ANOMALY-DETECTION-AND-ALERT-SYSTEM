import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ShieldAlert, Cpu, Database, RefreshCw } from 'lucide-react';
import LiveChart from '../components/LiveChart';
import RecentReadings from '../components/RecentReadings';
import AlertCenter from '../components/AlertCenter';
import StatusCard from '../components/StatusCard';

const API_BASE_URL = 'http://localhost:8000';

const DashboardPage = () => {
    const [readings, setReadings] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [stats, setStats] = useState({
        total_readings: 0,
        total_anomalies: 0,
        model_loaded: false,
        anomaly_rate: '0%'
    });
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [historyRes, alertsRes, statsRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/history?limit=30`),
                axios.get(`${API_BASE_URL}/alerts/recent?limit=10`),
                axios.get(`${API_BASE_URL}/stats`)
            ]);

            setReadings(historyRes.data.readings || []);
            setAlerts(alertsRes.data.alerts || []);
            setStats({
                total_readings: statsRes.data.total_readings,
                total_anomalies: statsRes.data.total_anomalies,
                model_loaded: statsRes.data.model_info?.is_trained,
                anomaly_rate: statsRes.data.anomaly_rate
            });
            setLoading(false);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 2000);
        return () => clearInterval(interval);
    }, []);

    const dismissAlert = async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/alerts/${id}`);
            fetchData();
        } catch (error) {
            console.error("Error dismissing alert:", error);
        }
    };

    return (
        <div className="container mx-auto px-6 py-24 min-h-screen">
            {/* Header with Pulse Animation */}
            <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold Outfit leading-none">Command Center</h1>
                    <p className="mt-2 text-[var(--text-muted)] font-medium">Monitoring Real-time Sensor Feed & Edge Intelligence</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="premium-card py-2 px-4 flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-[var(--primary)] animate-pulse shadow-[0_0_10px_var(--primary-glow)]" />
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Stream Live</span>
                    </div>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
            >
                <StatusCard
                    title="Total Packets"
                    value={stats.total_readings}
                    icon={<Database />}
                    type="primary"
                />
                <StatusCard
                    title="Edge AI Model"
                    value={stats.model_loaded ? "Isolation" : "Offline"}
                    icon={<Cpu />}
                    type="secondary"
                />
                <StatusCard
                    title="Detected Anomalies"
                    value={stats.total_anomalies}
                    icon={<ShieldAlert />}
                    type="danger"
                />
                <StatusCard
                    title="Anomaly Rate"
                    value={stats.anomaly_rate}
                    icon={<Activity />}
                    type="success"
                />
            </motion.div>

            <div className="mt-8 grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-8">
                    <div className="premium-card">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-bold Outfit">LDR Telemetry</h3>
                                <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-bold">Signal Propagation Graph</p>
                            </div>
                            <RefreshCw size={14} className="text-[var(--text-muted)] animate-spin-slow" />
                        </div>
                        <LiveChart data={readings} />
                    </div>
                    <RecentReadings readings={[...readings].reverse()} />
                </div>
                <div className="h-full">
                    <AlertCenter alerts={alerts} onDismiss={dismissAlert} />
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
