/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ASSET_URL } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Search, LogOut, Code2, Shield, Layout, Bell, User as UserIcon, Menu, X } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Academy', path: '/courses' },
        { name: 'Insights', path: '/content' },
    ];

    if (user) {
        navLinks.push({ name: 'Dashboard', path: '/profile' });
    }

    return (
        <nav className={`
            fixed top-0 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-7xl px-4 py-4 transition-all duration-500
            ${scrolled ? 'top-2' : 'top-0'}
        `}>
            <div className={`
                relative flex items-center justify-between px-6 py-3 rounded-[24px] transition-all duration-500 border
                ${scrolled 
                    ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-white/10 shadow-2xl shadow-indigo-500/10' 
                    : 'bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border-transparent'}
            `}>
                {/* ── Brand ── */}
                <Link to="/" className="flex items-center gap-3 group shrink-0">
                    <motion.div 
                        whileHover={{ rotate: 10, scale: 1.1 }}
                        className="bg-gradient-to-br from-indigo-600 to-violet-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-500/20"
                    >
                        <Code2 size={24} />
                    </motion.div>
                    <span className="text-2xl font-black tracking-[0.1em] text-slate-800 dark:text-white flex items-center gap-2">
                        Coding<span className="text-indigo-600">Classes</span>
                    </span>
                </Link>

                {/* ── Desktop Navigation ── */}
                <div className="hidden lg:flex items-center gap-5 bg-slate-100/50 dark:bg-slate-800/50 p-2 rounded-2xl border border-white/20 dark:border-white/5">
                    {navLinks.map((link) => (
                        <Link 
                            key={link.path} 
                            to={link.path}
                            className="relative px-4 py-2"
                        >
                            <span className={`
                                relative z-10 text-sm font-bold transition-colors duration-300
                                ${location.pathname === link.path 
                                    ? 'text-indigo-600 dark:text-indigo-400' 
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'}
                            `}>
                                {link.name}
                            </span>
                            {location.pathname === link.path && (
                                <motion.div 
                                    layoutId="activeNav"
                                    className="absolute inset-0 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                        </Link>
                    ))}
                </div>

                {/* ── Search Bar ── */}
                <div className={`
                    hidden md:flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-300 border
                    ${searchFocused 
                        ? 'bg-white dark:bg-slate-900 border-indigo-600/50 shadow-lg shadow-indigo-500/10 w-64' 
                        : 'bg-slate-100/50 dark:bg-slate-800/50 border-transparent w-48'}
                `}>
                    <Search size={16} className={searchFocused ? 'text-indigo-600' : 'text-slate-400'} />
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        className="bg-transparent border-none outline-none text-sm w-full text-slate-700 dark:text-slate-200"
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)}
                    />
                </div>

                {/* ── Actions ── */}
                <div className="flex items-center gap-8 shrink-0">
                    <motion.button 
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleTheme}
                        className="p-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </motion.button>

                    <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block" />

                    {user && (user.role === 'admin' || user.role === 'teacher') && (
                        <Link to="/admin">
                            <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`
                                    flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all
                                    ${user.role === 'admin' 
                                        ? 'bg-rose-500/10 text-rose-600 hover:bg-rose-500 hover:text-white shadow-rose-500/20 shadow-lg' 
                                        : 'bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500 hover:text-white shadow-indigo-500/20 shadow-lg'}
                                `}
                            >
                                {user.role === 'admin' ? <Shield size={16} /> : <Layout size={16} />}
                                <span>{user.role === 'admin' ? 'Admin' : 'Studio'}</span>
                            </motion.button>
                        </Link>
                    )}

                    {user ? (
                        <div className="flex items-center gap-3">
                            <Link to="/profile" className="flex items-center gap-3 pl-2 transition-transform hover:scale-105">
                                <div className="relative">
                                    <img 
                                        src={user.avatar?.startsWith('http') ? user.avatar : `${ASSET_URL}${user.avatar}`} 
                                        className="w-10 h-10 rounded-xl object-cover border-2 border-indigo-600/20 shadow-lg"
                                        alt="avatar" 
                                    />
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                                </div>
                                <div className="hidden lg:flex flex-col -space-y-1">
                                    <span className="text-sm font-bold text-slate-800 dark:text-white">{user.name.split(' ')[0]}</span>
                                    <span className="text-[10px] uppercase font-black tracking-widest text-indigo-600">{user.role}</span>
                                </div>
                            </Link>

                            <motion.button 
                                whileTap={{ scale: 0.9 }}
                                onClick={logout}
                                className="p-2.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all"
                            >
                                <LogOut size={20} />
                            </motion.button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link to="/login" className="hidden sm:block text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 px-4 py-2">
                                Login
                            </Link>
                            <Link to="/register" className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all active:scale-95">
                                Join Now
                            </Link>
                        </div>
                    )}

                    {/* Mobile Toggle */}
                    <button 
                        className="lg:hidden p-2 text-slate-600 dark:text-slate-400"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* ── Mobile Menu ── */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-full left-4 right-4 mt-2 p-6 bg-white dark:bg-slate-900 rounded-3xl border border-white/20 dark:border-white/10 shadow-2xl lg:hidden"
                    >
                        <div className="flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <Link 
                                    key={link.path} 
                                    to={link.path}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`
                                        text-lg font-bold p-2 transition-colors
                                        ${location.pathname === link.path ? 'text-indigo-600' : 'text-slate-600 dark:text-slate-400'}
                                    `}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <Link 
                                to={user ? "/profile" : "/login"}
                                onClick={() => setMobileMenuOpen(false)}
                                className="mt-4 p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center gap-3"
                            >
                                <div className="p-2 bg-indigo-600 rounded-xl text-white">
                                    <UserIcon size={20} />
                                </div>
                                <span className="font-bold text-slate-800 dark:text-white">
                                    {user ? 'My Profile' : 'Sign In'}
                                </span>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
