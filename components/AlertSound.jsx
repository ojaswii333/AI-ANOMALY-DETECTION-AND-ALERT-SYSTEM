"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, AlertTriangle, X } from 'lucide-react';

/**
 * AlertSound Component
 * - Plays a browser beep (Web Audio API) when a new anomaly alert arrives
 * - Shows toast notification popup
 * - Fires browser Notification API for desktop notifications
 * - Mute/unmute toggle for presentations
 */
export default function AlertSound({ alerts = [], latestAlertCount = 0 }) {
    const [muted, setMuted] = useState(false);
    const [toasts, setToasts] = useState([]);
    const lastAlertCountRef = useRef(0);
    const audioCtxRef = useRef(null);
    const hasInteracted = useRef(false);

    // Request notification permission on mount
    useEffect(() => {
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }, []);

    // Initialize AudioContext after first user interaction
    useEffect(() => {
        const initAudio = () => {
            if (!audioCtxRef.current && typeof window !== 'undefined') {
                audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
                hasInteracted.current = true;
            }
        };
        document.addEventListener('click', initAudio, { once: true });
        document.addEventListener('keydown', initAudio, { once: true });
        return () => {
            document.removeEventListener('click', initAudio);
            document.removeEventListener('keydown', initAudio);
        };
    }, []);

    const playAlarmBeep = useCallback(() => {
        if (muted || !audioCtxRef.current) return;
        const ctx = audioCtxRef.current;

        // Triple beep pattern
        [0, 0.18, 0.36].forEach((delay) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(880, ctx.currentTime + delay);
            gain.gain.setValueAtTime(0.15, ctx.currentTime + delay);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.12);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime + delay);
            osc.stop(ctx.currentTime + delay + 0.12);
        });
    }, [muted]);

    const showBrowserNotification = useCallback((alert) => {
        if (typeof window === 'undefined' || !('Notification' in window)) return;
        if (Notification.permission === 'granted') {
            new Notification('Anomaly Detected!', {
                body: `LDR Value: ${alert.ldr_value?.toFixed(1) || 'N/A'} | Type: ${alert.alert_type || 'ANOMALY'}`,
                icon: '/favicon.ico',
                tag: 'anomaly-alert',
                requireInteraction: false
            });
        }
    }, []);

    // Watch for new alerts
    useEffect(() => {
        const currentCount = alerts.length;
        if (currentCount > lastAlertCountRef.current && lastAlertCountRef.current > 0) {
            const newAlerts = alerts.slice(0, currentCount - lastAlertCountRef.current);
            newAlerts.forEach((alert) => {
                playAlarmBeep();
                showBrowserNotification(alert);
                const toastId = Date.now() + Math.random();
                setToasts(prev => [...prev.slice(-4), {
                    id: toastId,
                    alert_type: alert.alert_type || 'ANOMALY',
                    ldr_value: alert.ldr_value,
                    timestamp: alert.timestamp
                }]);
                // Auto-dismiss after 5 seconds
                setTimeout(() => {
                    setToasts(prev => prev.filter(t => t.id !== toastId));
                }, 5000);
            });
        }
        lastAlertCountRef.current = currentCount;
    }, [alerts, playAlarmBeep, showBrowserNotification]);

    const dismissToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <>
            {/* Mute/Unmute Toggle */}
            <button
                onClick={() => setMuted(!muted)}
                className={`fixed bottom-6 right-6 z-50 p-3 rounded-full border transition-all duration-300 backdrop-blur-xl ${muted
                        ? 'bg-white/5 border-white/10 text-white/40 hover:text-white/60'
                        : 'bg-primary/10 border-primary/30 text-primary hover:bg-primary/20 shadow-[0_0_20px_-5px_rgba(0,242,255,0.3)]'
                    }`}
                title={muted ? 'Unmute Alerts' : 'Mute Alerts'}
            >
                {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>

            {/* Toast Notifications */}
            <div className="fixed top-24 right-6 z-50 space-y-3 w-80">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, x: 100, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 100, scale: 0.9 }}
                            className="relative p-4 rounded-xl border border-red-500/30 bg-red-950/80 backdrop-blur-xl shadow-[0_0_30px_-5px_rgba(255,46,46,0.3)]"
                        >
                            <div className="absolute inset-0 rounded-xl animate-pulse bg-red-500/5" />
                            <div className="relative flex items-start gap-3">
                                <div className="mt-0.5 p-1.5 rounded-lg bg-red-500/20 text-red-400">
                                    <AlertTriangle size={16} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-red-400 mb-1">
                                        {toast.alert_type} Detected
                                    </p>
                                    <p className="text-xs text-white/80 font-medium">
                                        LDR Value: <span className="text-red-400 font-bold">{toast.ldr_value?.toFixed(1)}</span>
                                    </p>
                                </div>
                                <button onClick={() => dismissToast(toast.id)} className="text-white/30 hover:text-white/60 transition-colors">
                                    <X size={14} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </>
    );
}
