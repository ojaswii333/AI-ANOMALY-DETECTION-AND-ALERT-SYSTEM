import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, ExternalLink } from 'lucide-react';

const TeamPage = () => {
    const team = [
        {
            name: 'Dr. Ojasw',
            role: 'Faculty Mentor',
            desc: 'Expert in Embedded Systems and AI architecture.',
            social: { linkedin: '#', twitter: '#' }
        },
        {
            name: 'Lead Developer',
            role: 'Systems Architect',
            desc: 'Building the bridge between hardware and intelligence.',
            social: { github: '#', linkedin: '#' }
        }
    ];

    return (
        <div className="container mx-auto px-6 py-32">
            <div className="text-center mb-24">
                <h1 className="text-5xl font-extrabold mb-4">Innovation Team</h1>
                <p className="text-[var(--text-muted)]">The minds behind the anomaly detection system.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-12 max-w-4xl mx-auto">
                {team.map((member, i) => (
                    <motion.div
                        key={i}
                        className="group relative"
                        initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="premium-card p-10 flex flex-col items-center text-center">
                            <div className="mb-6 h-32 w-32 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] p-1">
                                <div className="h-full w-full rounded-xl bg-[var(--bg-surface)] flex items-center justify-center text-white font-bold text-2xl">
                                    {member.name[0]}
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold mb-1 Outfit">{member.name}</h3>
                            <div className="text-[var(--primary)] font-bold uppercase tracking-widest text-[10px] mb-4">
                                {member.role}
                            </div>
                            <p className="text-[var(--text-muted)] text-sm mb-8 leading-relaxed">
                                {member.desc}
                            </p>
                            <div className="flex gap-4">
                                <Github className="text-[var(--text-muted)] cursor-pointer hover:text-white transition-colors" size={20} />
                                <Linkedin className="text-[var(--text-muted)] cursor-pointer hover:text-white transition-colors" size={20} />
                                <Twitter className="text-[var(--text-muted)] cursor-pointer hover:text-white transition-colors" size={20} />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default TeamPage;
