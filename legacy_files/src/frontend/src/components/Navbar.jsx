import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Info, Cpu, Users, BookOpen } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/', icon: <Info size={18} /> },
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'AI Insights', path: '/ai', icon: <Cpu size={18} /> },
    { name: 'Documentation', path: '/docs', icon: <BookOpen size={18} /> },
    { name: 'Team', path: '/team', icon: <Users size={18} /> },
  ];

  return (
    <nav className="fixed top-6 left-1/2 z-50 w-full max-w-4xl -translate-x-1/2 px-6">
      <div className="flex items-center justify-between rounded-full border border-white/10 bg-[rgba(10,10,11,0.5)] px-6 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] p-0.5 transition-transform group-hover:rotate-12">
            <div className="flex h-full w-full items-center justify-center rounded-[7px] bg-[var(--bg-obsidian)] text-[var(--primary)]">
              <Cpu size={14} fill="currentColor" opacity={0.5} />
            </div>
          </div>
          <span className="font-bold tracking-tighter uppercase text-sm">AI Anomaly</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-xs font-bold uppercase tracking-widest transition-all hover:text-[var(--primary)] ${location.pathname === link.path ? 'text-[var(--primary)]' : 'text-[var(--text-muted)]'
                }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <Link to="/dashboard" className="rounded-full bg-white/5 border border-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all hover:bg-white/10">
          Live Feed
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
