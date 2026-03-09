import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import DashboardPage from './pages/DashboardPage';
import AboutPage from './pages/AboutPage';
import InsightsPage from './pages/InsightsPage';
import TeamPage from './pages/TeamPage';

const Documentation = () => (
  <div className="container mx-auto px-6 py-32">
    <h1 className="text-5xl font-extrabold mb-8">Technical Documentation</h1>
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-8">
        <section className="premium-card">
          <h3 className="text-xl font-bold mb-4">Hardware Stack</h3>
          <ul className="space-y-2 text-[var(--text-muted)] text-sm">
            <li>Microcontroller: ESP32 (simulated) </li>
            <li>Sensor: LDR (Light Dependent Resistor)</li>
            <li>Comm Protocol: HTTP/REST</li>
          </ul>
        </section>
        <section className="premium-card">
          <h3 className="text-xl font-bold mb-4">Software Architecture</h3>
          <p className="text-[var(--text-muted)] text-sm">
            Built with a modular FastAPI backend, optimized SQLite storage,
            and a high-performance React-Vite frontend specialized in real-time data visualization.
          </p>
        </section>
      </div>
      <aside className="premium-card">
        <h4 className="text-sm font-bold uppercase tracking-widest mb-4">Quick Links</h4>
        <div className="flex flex-col gap-3 text-sm text-[var(--primary)] font-medium">
          <a href="#" className="hover:underline">GitHub Repository</a>
          <a href="#" className="hover:underline">Training Dataset</a>
          <a href="#" className="hover:underline">Project Report PDF</a>
        </div>
      </aside>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <div className="relative min-h-screen bg-[var(--bg-obsidian)] text-[var(--text-main)] overflow-x-hidden">
        {/* Persistent Background Elements */}
        <div className="bg-grid fixed inset-0 opacity-10 pointer-events-none" />
        <div className="mesh-gradient fixed inset-0 pointer-events-none opacity-40 shadow-[inset_0_0_100px_rgba(0,0,0,1)]" />

        <Navbar />

        <main className="relative z-10">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/ai" element={<InsightsPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/docs" element={<Documentation />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
