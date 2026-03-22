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
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchCategory, setSearchCategory] = useState('all');

    const handleSearch = () => {
        if (!searchQuery.trim()) return;
        if (searchCategory === 'ai') {
            window.dispatchEvent(new CustomEvent('open-ai-assistant', { detail: searchQuery }));
        } else if (searchCategory === 'content') {
            navigate(`/content?search=${encodeURIComponent(searchQuery)}`);
        } else {
            navigate(`/courses?search=${encodeURIComponent(searchQuery)}`);
        }
        setSearchQuery('');
    };

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
            fixed top-0 left-0 z-[1000] w-full transition-all duration-500 border-b
            ${scrolled 
                ? 'bg-[#0F172A]/90 backdrop-blur-xl border-slate-800 shadow-2xl shadow-indigo-500/10 py-2' 
                : 'bg-[#0F172A] border-slate-800/50 shadow-lg py-3'}
        `}>
            <div className="flex items-center justify-between px-6 md:px-12 w-full max-w-[1400px] mx-auto">
                {/* ── Brand ── */}
                <Link to="/" className="flex items-center gap-3 group shrink-0">
                    <motion.div 
                        whileHover={{ rotate: 10, scale: 1.1 }}
                        className="bg-gradient-to-br from-indigo-500 to-cyan-400 p-2 rounded-xl text-white shadow-lg shadow-cyan-500/20"
                    >
                        <Code2 size={24} />
                    </motion.div>
                    <span 
                        className="text-[2rem] leading-none font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-400 drop-shadow-sm pb-1"
                        style={{ fontFamily: "'Dancing Script', cursive" }}
                    >
                        Coding Classes
                    </span>
                </Link>

                {/* ── Desktop Navigation ── */}
                <div className="hidden lg:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <Link 
                            key={link.path} 
                            to={link.path}
                            className="relative px-2 py-4"
                        >
                            <span className={`
                                relative z-10 text-sm font-bold transition-colors duration-300
                                ${location.pathname === link.path 
                                    ? 'text-cyan-400' 
                                    : 'text-slate-400 hover:text-white'}
                            `}>
                                {link.name}
                            </span>
                            {location.pathname === link.path && (
                                <motion.div 
                                    layoutId="activeNav"
                                    className="absolute bottom-1 left-0 right-0 h-0.5 bg-cyan-400"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                        </Link>
                    ))}
                </div>

                {/* ── Search Bar ── */}
                <div className={`
                    hidden md:flex items-center gap-2 px-3 py-2 rounded-sm transition-all duration-300 border
                    ${searchFocused 
                        ? 'bg-slate-800/80 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)] min-w-[300px]' 
                        : 'bg-slate-800/40 border-slate-600 hover:border-slate-500 w-64'}
                `}>
                    <select 
                        value={searchCategory}
                        onChange={(e) => setSearchCategory(e.target.value)}
                        className="bg-transparent border-none outline-none text-xs font-bold text-slate-400 cursor-pointer appearance-none uppercase tracking-wide"
                    >
                        <option value="all" className="bg-slate-800 text-white">All</option>
                        <option value="content" className="bg-slate-800 text-white">Insights</option>
                        <option value="ai" className="bg-slate-800 text-cyan-400">Ask AI 🤖</option>
                        <option value="courses" className="bg-slate-800 text-white">Courses</option>
                    </select>
                    <div className="w-[1px] h-4 bg-slate-600 mx-1 shrink-0" />
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        className="bg-transparent border-none outline-none text-sm w-full text-white placeholder-slate-400 text-center"
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)}
                    />
                    <button 
                        onClick={handleSearch}
                        className={`p-1.5 flex items-center justify-center rounded-sm transition-colors ${searchFocused ? 'text-cyan-400 hover:bg-cyan-400/10' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}
                    >
                        <Search size={16} />
                    </button>
                </div>

                {/* ── Actions ── */}
                <div className="flex items-center gap-6 shrink-0">

                    {user && (user.role === 'admin' || user.role === 'teacher') && (
                        <Link to="/admin">
                            <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`
                                    flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer
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
                                    <span className="text-sm font-bold text-white">{user.name.split(' ')[0]}</span>
                                    <span className="text-[10px] uppercase font-black tracking-widest text-indigo-400">{user.role}</span>
                                </div>
                            </Link>

                            <motion.button 
                                whileTap={{ scale: 0.95 }}
                                onClick={logout}
                                className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold text-slate-400 hover:text-white hover:bg-rose-500 transition-all shadow-sm hover:shadow-rose-500/25"
                            >
                                <LogOut size={16} />
                                <span className="hidden sm:inline">Sign Out</span>
                            </motion.button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-5">
                            <Link to="/login" className="hidden sm:block text-sm font-bold text-slate-400 hover:text-white px-4 py-2">
                                Login
                            </Link>
                            <Link to="/register" className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-bold px-5 py-2.5 rounded-md shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all active:scale-95">
                                Join Now
                            </Link>
                        </div>
                    )}

                    {/* Mobile Toggle */}
                    <button 
                        className="lg:hidden p-2 text-slate-400 hover:text-white"
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
