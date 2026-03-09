import React from 'react';
import { motion } from 'framer-motion';

const StatusCard = ({ title, value, icon, type = 'primary' }) => {
  const typeMap = {
    primary: 'var(--primary)',
    secondary: 'var(--secondary)',
    danger: 'var(--anomaly)',
    success: 'var(--success)',
  };

  const glowMap = {
    primary: 'var(--primary-glow)',
    secondary: 'var(--secondary-glow)',
    danger: 'var(--anomaly-glow)',
    success: 'rgba(16, 185, 129, 0.4)',
  };

  const color = typeMap[type] || typeMap.primary;
  const glow = glowMap[type] || glowMap.primary;

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className="premium-card relative group flex flex-col items-center text-center py-8"
    >
      <div
        className="mb-4 rounded-xl p-3 backdrop-blur-md border"
        style={{
          backgroundColor: `rgba(${parseInt(color.slice(1, 3), 16) || 0}, ${parseInt(color.slice(3, 5), 16) || 0}, ${parseInt(color.slice(5, 7), 16) || 0}, 0.1)`,
          borderColor: `rgba(${parseInt(color.slice(1, 3), 16) || 0}, ${parseInt(color.slice(3, 5), 16) || 0}, ${parseInt(color.slice(5, 7), 16) || 0}, 0.2)`
        }}
      >
        <div style={{ color }}>
          {icon && React.cloneElement(icon, { size: 28 })}
        </div>
      </div>

      <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2">
        {title}
      </h4>
      <div className="text-3xl font-extrabold Outfit tracking-tight">
        {value}
      </div>

      {/* Decorative Glow */}
      <div
        className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity duration-500"
        style={{ backgroundColor: glow }}
      />
    </motion.div>
  );
};

export default StatusCard;
