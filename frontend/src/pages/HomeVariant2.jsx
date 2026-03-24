import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Trophy, Target, ArrowRight, PlayCircle, Users2, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomeVariant2 = () => {
    return (
        <div className="bg-[var(--bg-primary)] min-h-screen text-slate-800 font-sans selection:bg-rose-500/20 selection:text-rose-900">
            {/* Minimal Header Spacer */}
            <div className="h-32 bg-transparent" />

            <div className="container max-w-6xl mx-auto px-6">
                
                {/* Clean Typography Hero */}
                <section className="py-20 lg:py-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center border-b border-slate-100">
                    <div>
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 text-rose-600 rounded-lg text-xs font-bold uppercase tracking-wider mb-8"
                        >
                            <Trophy size={14} /> Top Rated Courses
                        </motion.div>

                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl lg:text-7xl font-light tracking-tight text-slate-900 mb-6 leading-[1.1]"
                        >
                            Learn to <span className="font-bold">Engineer</span> <br className="hidden lg:block"/> The Abstract.
                        </motion.h1>

                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl text-slate-500 mb-10 leading-relaxed font-light"
                        >
                            A curated curriculum that strips away the noise. Focus on foundational principles, clean architecture, and systematic problem solving.
                        </motion.p>

                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="flex items-center gap-4"
                        >
                            <Link to="/courses" className="px-8 py-4 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-2 group">
                                Browse Catalogue <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <button className="px-8 py-4 text-slate-600 font-medium hover:text-slate-900 transition-colors flex items-center gap-2">
                                <PlayCircle size={20} /> Watch Intro
                            </button>
                        </motion.div>
                    </div>

                    <div className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl">
                        {/* Full HD Photo */}
                        <img 
                            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=3840&auto=format&fit=crop" 
                            alt="Team Collaborating" 
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                        <div className="absolute top-10 right-10 w-40 h-40 bg-rose-500/20 rounded-full blur-[50px]"></div>
                        <div className="absolute bottom-10 left-10 w-60 h-60 bg-blue-500/20 rounded-full blur-[60px]"></div>
                        
                        <div className="absolute inset-x-8 bottom-8 p-8 bg-white/80 backdrop-blur-xl rounded-2xl border border-white max-w-sm ml-auto mr-0 shadow-2xl shadow-slate-200/50">
                            <h4 className="font-bold text-slate-900 mb-2 font-serif text-xl">The Science of Code</h4>
                            <p className="text-slate-500 text-sm leading-relaxed mb-6">Mastering computer science through rigorous, peer-reviewed study patterns and structured mentorship.</p>
                            <div className="flex items-center gap-4 border-t border-slate-100 pt-4">
                                <div className="flex -space-x-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white"></div>
                                    <div className="w-8 h-8 rounded-full bg-slate-300 border-2 border-white"></div>
                                    <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold">+2k</div>
                                </div>
                                <span className="text-xs font-semibold text-slate-500">Graduates globally</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Metrics / Trust */}
                <section className="py-20 border-b border-slate-100">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-x divide-slate-100">
                        {[
                            { stat: '98%', label: 'Placement Rate' },
                            { stat: '500+', label: 'Hiring Partners' },
                            { stat: '4.9/5', label: 'Average Review' },
                            { stat: '24/7', label: 'Mentor Support' }
                        ].map((item, i) => (
                            <div key={i} className="px-4">
                                <Reveal>
                                    <div className="text-4xl lg:text-5xl font-light text-slate-900 mb-2">{item.stat}</div>
                                    <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">{item.label}</div>
                                </Reveal>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Minimal Value Props */}
                <section className="py-32">
                    <div className="max-w-3xl mx-auto text-center mb-20">
                        <h2 className="text-4xl font-light text-slate-900 mb-6">A Platform Built for Excellence</h2>
                        <p className="text-lg text-slate-500">No fluff. Just the exact concepts, systems, and practical applications you need to scale your engineering career.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            { icon: <BookOpen />, title: "Structured Learning", desc: "Sequential pedagogical design ensuring high retention and deep understanding." },
                            { icon: <Target />, title: "Targeted Outcomes", desc: "Every module maps directly to an industry standard requirement." },
                            { icon: <Users2 />, title: "Elite Network", desc: "Join an alumni network actively building the next generation of tech." }
                        ].map((feat, i) => (
                            <Reveal key={i} delay={i * 0.1}>
                                <div className="text-center group">
                                    <div className="w-16 h-16 mx-auto bg-slate-50 rounded-2xl flex items-center justify-center text-slate-900 mb-6 group-hover:scale-110 group-hover:bg-slate-900 group-hover:text-white transition-all duration-300 shadow-sm border border-slate-100">
                                        {feat.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-4">{feat.title}</h3>
                                    <p className="text-slate-500 leading-relaxed">{feat.desc}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

const Reveal = ({ children, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, delay }}
    >
        {children}
    </motion.div>
);

export default HomeVariant2;
