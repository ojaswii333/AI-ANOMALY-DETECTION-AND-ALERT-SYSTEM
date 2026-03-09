"use client";

import React from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';

export default function LiveChart({ data = [] }) {
    return (
        <div className="h-[400px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorLdr" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00F2FF" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#00F2FF" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorAnomaly" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#FF2E2E" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#FF2E2E" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis
                        dataKey="timestamp"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94A3B8', fontSize: 10 }}
                        tickFormatter={(time) => time ? new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94A3B8', fontSize: 10 }}
                        domain={[0, 1023]}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#0A0A0B',
                            borderColor: 'rgba(255, 255, 255, 0.08)',
                            borderRadius: '12px',
                            fontSize: '12px',
                            color: '#F8FAFC'
                        }}
                        itemStyle={{ color: '#00F2FF' }}
                    />

                    <ReferenceLine y={700} stroke="#FF2E2E" strokeDasharray="3 3" opacity={0.3} />
                    <ReferenceLine y={200} stroke="#FF2E2E" strokeDasharray="3 3" opacity={0.3} />

                    <Area
                        type="monotone"
                        dataKey="ldr_value"
                        stroke="#00F2FF"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorLdr)"
                        animationDuration={500}
                        dot={(props) => {
                            const { cx, cy, payload } = props;
                            if (payload.is_anomaly) {
                                return (
                                    <circle cx={cx} cy={cy} r={6} fill="#FF2E2E" stroke="white" strokeWidth={2} />
                                );
                            }
                            return null;
                        }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
