import React from 'react'
import { Activity, Zap, Database, TrendingUp, Server } from 'lucide-react'
import { motion } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
}

export default function SystemMonitor({ systemStatus }) {
  return (
    <motion.div
      className="max-w-7xl mx-auto px-6 py-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div className="mb-8" variants={itemVariants}>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-neon-blue via-emerald-400 to-neon-green bg-clip-text text-transparent mb-2">
          System Monitor
        </h2>
        <p className="text-gray-400">Real-time system health and performance</p>
      </motion.div>

      {systemStatus ? (
        <motion.div className="space-y-6" variants={containerVariants}>
          {/* Health Status */}
          <motion.div className="glass-hover p-6 rounded-xl relative overflow-hidden group" variants={itemVariants}>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-50 group-hover:opacity-100 transition-opacity" />

            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Server className="w-5 h-5 text-neon-blue" />
              System Health
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Model Status */}
              <motion.div
                className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-green-500/30 transition-all hover:bg-green-500/5 cursor-default"
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg flex items-center justify-center border border-green-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                  <Activity className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1 uppercase tracking-wider text-xs font-semibold">ML Model</p>
                  <p className="text-white font-semibold flex items-center gap-2">
                    {systemStatus.model_loaded ? (
                      <><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]"></span>Loaded</>
                    ) : (
                      <><span className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_#ef4444]"></span>Error</>
                    )}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Anomaly detection active</p>
                </div>
              </motion.div>

              {/* Database Status */}
              <motion.div
                className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-blue-500/30 transition-all hover:bg-blue-500/5 cursor-default"
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center border border-blue-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                  <Database className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1 uppercase tracking-wider text-xs font-semibold">Database</p>
                  <p className="text-white font-semibold flex items-center gap-2">
                    {systemStatus.database_connected ? (
                      <><span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_#3b82f6]"></span>Connected</>
                    ) : (
                      <><span className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_#ef4444]"></span>Offline</>
                    )}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">SQLite operational</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Performance Metrics */}
          <motion.div className="glass-hover p-6 rounded-xl relative overflow-hidden" variants={itemVariants}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-neon-purple/10 rounded-full blur-3xl -z-10" />

            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5 text-neon-purple" />
              Performance Metrics
            </h3>

            <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-4" variants={containerVariants}>
              <motion.div className="stat-card group" variants={itemVariants} whileHover={{ scale: 1.05 }}>
                <p className="text-gray-400 text-sm mb-2 font-medium tracking-wide uppercase text-xs">Total Readings</p>
                <p className="text-3xl font-bold text-glow">
                  {systemStatus.total_readings.toLocaleString()}
                </p>
              </motion.div>
              <motion.div className="stat-card group hover:border-red-500/40 hover:shadow-red-500/20" variants={itemVariants} whileHover={{ scale: 1.05 }}>
                <p className="text-gray-400 text-sm mb-2 font-medium tracking-wide uppercase text-xs">Total Anomalies</p>
                <p className="text-3xl font-bold text-red-400 drop-shadow-[0_0_10px_rgba(248,113,113,0.3)]">
                  {systemStatus.total_anomalies.toLocaleString()}
                </p>
              </motion.div>
              <motion.div className="stat-card group hover:border-orange-500/40 hover:shadow-orange-500/20" variants={itemVariants} whileHover={{ scale: 1.05 }}>
                <p className="text-gray-400 text-sm mb-2 font-medium tracking-wide uppercase text-xs">Detection Rate</p>
                <p className="text-3xl font-bold text-orange-400 drop-shadow-[0_0_10px_rgba(251,146,60,0.3)]">
                  {systemStatus.total_readings > 0
                    ? ((systemStatus.total_anomalies / systemStatus.total_readings) * 100).toFixed(1)
                    : '0'
                  }%
                </p>
              </motion.div>
              <motion.div className="stat-card group hover:border-green-500/40 hover:shadow-green-500/20" variants={itemVariants} whileHover={{ scale: 1.05 }}>
                <p className="text-gray-400 text-sm mb-2 font-medium tracking-wide uppercase text-xs">Uptime</p>
                <p className="text-2xl font-bold text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.3)] truncate">
                  {systemStatus.uptime}
                </p>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* System Info */}
          <motion.div className="glass-hover p-6 rounded-xl" variants={itemVariants}>
            <h3 className="text-lg font-semibold text-white mb-6">System Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/[0.02] p-4 rounded-xl border border-white/5">
              <div className="flex justify-between items-center md:block">
                <p className="text-gray-400 text-sm mb-1 uppercase tracking-wider text-xs font-semibold">API Status</p>
                <p className="text-white font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 bg-neon-green rounded-full animate-pulse shadow-[0_0_8px_#10b981]"></span>
                  Running
                </p>
              </div>
              <div className="flex justify-between items-center md:block">
                <p className="text-gray-400 text-sm mb-1 uppercase tracking-wider text-xs font-semibold">API Endpoint</p>
                <p className="text-neon-blue font-mono text-sm bg-blue-500/10 px-3 py-1 rounded inline-block">
                  localhost:8000
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          className="glass p-12 rounded-xl text-center flex flex-col items-center justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-10 h-10 border-t-2 border-r-2 border-neon-blue rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <p className="text-gray-400 font-medium tracking-wide">Connecting to telemetry stream...</p>
        </motion.div>
      )}
    </motion.div>
  )
}
