import React, { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, ScatterChart, Scatter } from 'recharts'
import { motion } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
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

export default function DataVisualization() {
  const [timeSeriesData, setTimeSeriesData] = useState([])
  const [anomalyDistribution, setAnomalyDistribution] = useState([])

  useEffect(() => {
    fetchVisualizationData()
  }, [])

  const fetchVisualizationData = async () => {
    try {
      const response = await fetch('http://localhost:8000/history?limit=100')
      const data = await response.json()
      
      // Process time series
      const timeSeries = data.readings.map((reading, idx) => ({
        index: idx,
        ldr_value: reading.ldr_value,
        is_anomaly: reading.is_anomaly ? 1 : 0
      }))
      setTimeSeriesData(timeSeries)

      // Process anomaly distribution
      const anomalies = timeSeries.filter(r => r.is_anomaly).length
      const normal = timeSeries.length - anomalies
      setAnomalyDistribution([
        { name: 'Normal', value: normal },
        { name: 'Anomaly', value: anomalies }
      ])
    } catch (error) {
      console.error('Failed to fetch visualization data:', error)
    }
  }

  return (
    <motion.div 
      className="max-w-7xl mx-auto px-6 py-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div className="mb-8" variants={itemVariants}>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent mb-2">
          Data Visualization
        </h2>
        <p className="text-gray-400">Comprehensive analysis of sensor data</p>
      </motion.div>

      <motion.div className="space-y-6" variants={containerVariants}>
        {/* Time Series Chart */}
        <motion.div className="glass-hover p-6 rounded-xl" variants={itemVariants}>
          <h3 className="text-lg font-semibold text-white mb-6">LDR Values Over Time</h3>
          {timeSeriesData.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="index" stroke="rgba(255,255,255,0.3)" />
                <YAxis stroke="rgba(255,255,255,0.3)" />
                <Tooltip contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.95)',
                  border: '1px solid rgba(0, 212, 255, 0.3)',
                  borderRadius: '8px'
                }} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="ldr_value" 
                  stroke="#00d4ff" 
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6, fill: '#00d4ff', stroke: '#fff', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400">No data available</p>
          )}
        </motion.div>

        {/* Anomaly Distribution */}
        <motion.div className="glass-hover p-6 rounded-xl" variants={itemVariants}>
          <h3 className="text-lg font-semibold text-white mb-6">Normal vs Anomaly Distribution</h3>
          {anomalyDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={anomalyDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" />
                <YAxis stroke="rgba(255,255,255,0.3)" />
                <Tooltip contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.95)',
                  border: '1px solid rgba(168, 85, 247, 0.3)'
                }} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {
                    anomalyDistribution.map((entry, index) => (
                      <cell key={`cell-${index}`} fill={entry.name === 'Anomaly' ? '#ec4899' : '#00d4ff'} />
                    ))
                  }
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400">No data available</p>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
