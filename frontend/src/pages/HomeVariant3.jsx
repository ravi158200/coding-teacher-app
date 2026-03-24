import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, Layers, Cpu, Code2, MoveRight, MonitorPlay } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomeVariant3 = () => {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 1000], [0, -150]);
    const y2 = useTransform(scrollY, [0, 1000], [0, 150]);

    return (
        <div className="bg-[var(--bg-primary)] min-h-screen text-slate-800 overflow-hidden font-sans">
            {/* Full HD Photo Background Elements */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <img 
                    src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=3840&auto=format&fit=crop" 
                    alt="Developer Desktop" 
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-[var(--bg-primary)]/70 backdrop-blur-md" />
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-300/40 rounded-full blur-[100px] mix-blend-multiply" />
                <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] bg-blue-300/40 rounded-full blur-[100px] mix-blend-multiply" />
                <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[40%] bg-amber-200/40 rounded-full blur-[100px] mix-blend-multiply" />
            </div>

            <div className="container relative z-10 pt-32 lg:pt-48 pb-20">
                <section className="text-center max-w-4xl mx-auto mb-32 relative">
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-md border border-white/40 shadow-xl shadow-slate-200/50 text-sm font-semibold text-slate-700 mb-8"
                    >
                        <Sparkles size={16} className="text-pink-500" /> Defining the standard
                    </motion.div>

                    <motion.h1 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1, duration: 0.6 }}
                        className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-slate-900 via-slate-700 to-slate-500 mb-8"
                    >
                        Code in 
                        <br />
                        <span className="italic font-serif text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500">High Definition.</span>
                    </motion.h1>

                    <motion.p 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="text-xl md:text-2xl text-slate-500 font-medium leading-relaxed mb-12"
                    >
                        Interactive, visually stunning, and pedagogically sound. Elevate your software engineering journey with immersive cohorts.
                    </motion.p>

                    <motion.div disable initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="flex justify-center gap-6">
                        <Link to="/courses" className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-2xl shadow-slate-900/20 hover:-translate-y-1 hover:shadow-slate-900/40 transition-all flex items-center gap-3">
                            Explore Cohorts <MoveRight size={20} />
                        </Link>
                    </motion.div>
                </section>

                {/* Floating Glass Panels */}
                <section className="relative h-[600px] w-full flex items-center justify-center perspective-[1000px]">
                    <motion.div style={{ y: y1 }} className="absolute -left-10 lg:left-20 top-20 w-72 p-6 bg-white/40 backdrop-blur-2xl border border-white/60 rounded-[2rem] shadow-[0_20px_40px_-20px_rgba(0,0,0,0.1)] rotate-[-6deg] hover:rotate-0 transition-transform duration-500 z-10">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-500/30">
                            <Layers size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Architectural Patterns</h3>
                        <p className="text-slate-500 font-medium leading-relaxed">Design patterns and scalable system architecture broken down visually.</p>
                    </motion.div>

                    <motion.div className="w-80 p-8 bg-white/60 backdrop-blur-3xl border border-white/80 rounded-[2.5rem] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.15)] z-20">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white mb-8 shadow-xl shadow-pink-500/30">
                            <Code2 size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-4">Functional Mastery</h3>
                        <div className="space-y-4 mb-8">
                            <div className="h-2 w-full bg-slate-200/50 rounded-full overflow-hidden">
                                <div className="h-full w-[85%] bg-pink-500 rounded-full" />
                            </div>
                            <div className="h-2 w-full bg-slate-200/50 rounded-full overflow-hidden">
                                <div className="h-full w-[60%] bg-violet-500 rounded-full" />
                            </div>
                            <div className="h-2 w-full bg-slate-200/50 rounded-full overflow-hidden">
                                <div className="h-full w-[90%] bg-amber-500 rounded-full" />
                            </div>
                        </div>
                        <p className="text-slate-500 font-semibold leading-relaxed">Track progress in real-time as you master core algorithms.</p>
                    </motion.div>

                    <motion.div style={{ y: y2 }} className="absolute -right-10 lg:right-20 bottom-20 w-72 p-6 bg-white/40 backdrop-blur-2xl border border-white/60 rounded-[2rem] shadow-[0_20px_40px_-20px_rgba(0,0,0,0.1)] rotate-[6deg] hover:rotate-0 transition-transform duration-500 z-10">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white mb-6 shadow-lg shadow-amber-500/30">
                            <MonitorPlay size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Live Classrooms</h3>
                        <p className="text-slate-500 font-medium leading-relaxed">Immersive video pairs you directly with senior engineers.</p>
                    </motion.div>
                </section>
            </div>
            
            {/* Footer gradient fade */}
            <div className="h-40 bg-gradient-to-t from-white to-transparent" />
        </div>
    );
};

export default HomeVariant3;
