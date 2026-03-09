import React, { useState, useEffect } from 'react'
import { Activity, TrendingUp, AlertTriangle, Eye } from 'lucide-react'
import { motion } from 'framer-motion'
import StatusCard from './StatusCard'
import RecentReadings from './RecentReadings'
import LiveChart from './LiveChart'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [readings, setReadings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
    const interval = setInterval(fetchDashboardData, 3000)
    return () => clearInterval(interval)
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [statsRes, historyRes] = await Promise.all([
        fetch('http://localhost:8000/stats'),
        fetch('http://localhost:8000/history?limit=50')
      ])
      
      const statsData = await statsRes.json()
      const historyData = await historyRes.json()
      
      setStats(statsData)
      setReadings(historyData.readings)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    }
  }

  return (
    <motion.div 
      className="max-w-7xl mx-auto px-6 py-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Animated Header */}
      <motion.div className="mb-8" variants={itemVariants}>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent mb-3">
          Live Dashboard
        </h1>
        <motion.p 
          className="text-gray-400 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Real-time anomaly detection and monitoring powered by AI
        </motion.p>
      </motion.div>

      {/* Stats Grid with Staggered Animation */}
      {stats && (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <StatusCard
              icon={<Activity className="w-6 h-6" />}
              label="Total Readings"
              value={stats.total_readings}
              color="blue"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatusCard
              icon={<AlertTriangle className="w-6 h-6" />}
              label="Anomalies Detected"
              value={stats.total_anomalies}
              color="red"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatusCard
              icon={<TrendingUp className="w-6 h-6" />}
              label="Anomaly Rate"
              value={stats.anomaly_rate}
              color="orange"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatusCard
              icon={<Eye className="w-6 h-6" />}
              label="Active Devices"
              value={stats.device_count}
              color="green"
            />
          </motion.div>
        </motion.div>
      )}

      {/* Charts & Data Section */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        variants={containerVariants}
      >
        {/* Live Chart */}
        <motion.div className="lg:col-span-2" variants={itemVariants}>
          <LiveChart readings={readings} />
        </motion.div>

        {/* Recent Readings */}
        <motion.div variants={itemVariants}>
          <RecentReadings readings={readings.slice(-10)} />
        </motion.div>
      </motion.div>

      {/* Sensor Statistics */}
      {stats && stats.sensor_stats && (
        <motion.div 
          className="mt-8 glass p-8 rounded-2xl border border-white/10 hover:border-neon-blue/50 transition-all duration-300"
          variants={itemVariants}
        >
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <motion.div 
              className="w-2 h-2 bg-neon-blue rounded-full"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            Sensor Statistics
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <motion.div 
              className="stat-card group"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-gray-400 text-sm mb-2 font-medium">Average</p>
              <p className="text-3xl font-bold text-glow">
                {stats.sensor_stats.average_value.toFixed(1)}
              </p>
            </motion.div>
            <motion.div 
              className="stat-card group"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-gray-400 text-sm mb-2 font-medium">Minimum</p>
              <p className="text-3xl font-bold text-green-400">
                {stats.sensor_stats.min_value.toFixed(1)}
              </p>
            </motion.div>
            <motion.div 
              className="stat-card group"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-gray-400 text-sm mb-2 font-medium">Maximum</p>
              <p className="text-3xl font-bold text-pink-400">
                {stats.sensor_stats.max_value.toFixed(1)}
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
