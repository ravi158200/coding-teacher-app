import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Terminal, Cpu, Blocks, Zap, Rocket, ChevronRight, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomeVariant1 = () => {
    return (
        <div className="bg-[var(--bg-primary)] min-h-screen text-slate-800 overflow-hidden relative">
            {/* Ambient Background with Full HD Photo */}
            <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-[var(--bg-primary)]/85 z-10" />
                <img 
                    src="https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=3840&auto=format&fit=crop" 
                    alt="Coding Environment" 
                    className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-luminosity"
                />
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/30 blur-[120px] z-20" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-600/20 blur-[120px] z-20" />
            </div>

            <div className="container relative z-10 pt-20">
                {/* Hero Section */}
                <section className="min-h-[80vh] flex flex-col items-center justify-center text-center">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-500/30 bg-violet-500/10 backdrop-blur-md"
                    >
                        <Zap size={16} className="text-violet-400" />
                        <span className="text-sm font-medium text-violet-300">The Next Gen Coding Programs</span>
                    </motion.div>

                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-6xl md:text-8xl font-black mb-8 tracking-tight leading-tight"
                    >
                        Master Code.<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-500 to-violet-500">
                            Build the Future.
                        </span>
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="text-lg md:text-xl text-slate-600 max-w-2xl mb-12"
                    >
                        Join an elite network of developers. Immersive environments, real-world projects, and hyper-focused curriculum designed for modern engineering.
                    </motion.p>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="flex flex-wrap justify-center gap-6"
                    >
                        <Link to="/courses" className="px-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-lg hover:shadow-[0_0_40px_-10px_rgba(139,92,246,0.6)] transition-all hover:-translate-y-1 flex items-center gap-2">
                            Start Coding <ChevronRight size={20} />
                        </Link>
                        <Link to="/content" className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 transition-all flex items-center gap-2 backdrop-blur-md">
                            <Terminal size={20} /> View Curriculum
                        </Link>
                    </motion.div>
                </section>

                {/* Cyber Features Layout */}
                <section className="py-20 relative">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: <Cpu className="text-cyan-400" size={32} />, title: 'System Design', desc: 'Deep dive into scalable architectures and microservices.' },
                            { icon: <Blocks className="text-violet-400" size={32} />, title: 'Advanced Algorithms', desc: 'Master competitive programming and core logic.' },
                            { icon: <Code2 className="text-indigo-400" size={32} />, title: 'Full-Stack Mastery', desc: 'End-to-end framework proficiency from DB to DOM.' }
                        ].map((feat, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: i * 0.2 }}
                                viewport={{ once: true }}
                                className="group relative p-8 rounded-3xl bg-slate-900/50 border border-white/5 hover:border-violet-500/30 transition-colors backdrop-blur-sm overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-500/10 to-transparent rounded-full blur-[40px] group-hover:from-violet-500/30 transition-all" />
                                <div className="mb-6">{feat.icon}</div>
                                <h3 className="text-2xl font-bold mb-4 text-slate-900">{feat.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{feat.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Code Window Showcase */}
                <section className="py-32">
                    <div className="max-w-5xl mx-auto">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className="rounded-2xl overflow-hidden border border-slate-800 bg-[#0d1117] shadow-2xl shadow-indigo-500/10"
                        >
                            <div className="flex items-center gap-2 px-4 py-3 bg-[#161b22] border-b border-slate-800">
                                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                                <span className="ml-4 text-xs font-mono text-slate-500">server.js</span>
                            </div>
                            <div className="p-6 font-mono text-sm overflow-x-auto text-slate-300 leading-relaxed">
                                <p><span className="text-pink-400">import</span> <span className="text-blue-400">{' { serve } '}</span> <span className="text-pink-400">from</span> <span className="text-amber-300">"academy-engine"</span>;</p>
                                <br/>
                                <p><span className="text-pink-400">const</span> <span className="text-blue-400">initBootcamp</span> <span className="text-cyan-400">=</span> <span className="text-pink-400">async</span> () <span className="text-pink-400">{'=>'}</span> {'{'}</p>
                                <p className="pl-4"><span className="text-pink-400">await</span> serve({'{'}</p>
                                <p className="pl-8">port: <span className="text-purple-400">2026</span>,</p>
                                <p className="pl-8">curriculum: <span className="text-amber-300">"hyper-advanced"</span>,</p>
                                <p className="pl-8">mentorship: <span className="text-purple-400">true</span>,</p>
                                <p className="pl-8">stack: [<span className="text-amber-300">"React"</span>, <span className="text-amber-300">"Node"</span>, <span className="text-amber-300">"PostgreSQL"</span>]</p>
                                <p className="pl-4">{'}'});</p>
                                <p className="pl-4">console.<span className="text-cyan-400">log</span>(<span className="text-amber-300">"Engineers ready for deployment. 🚀"</span>);</p>
                                <p>{'}'};</p>
                                <br/>
                                <p>initBootcamp();</p>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default HomeVariant1;
