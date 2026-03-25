/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ASSET_URL, formatAssetUrl } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Search, LogOut, Code2, Shield, Layout, Bell, User as UserIcon, Menu, X, ChevronDown, GraduationCap, BookOpen } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);



    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Auto-close menus on route change
    useEffect(() => {
        setMobileMenuOpen(false);
        setUserMenuOpen(false);
    }, [location.pathname, location.hash]);

    // Click outside listener
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Courses', path: '/courses' },
        { name: 'Insights & Updates', path: '/content' },
    ];



    return (
        <nav className={`
            fixed top-0 left-0 z-[1000] w-full transition-all duration-500 border-b
            ${scrolled 
                ? 'bg-[#0F172A]/90 backdrop-blur-xl border-slate-800 shadow-2xl shadow-indigo-500/10 py-2' 
                : 'bg-[#0F172A] border-slate-800/50 shadow-lg py-3'}
        `}>
            <div className="flex items-center justify-between px-6 md:px-12 w-full max-w-[1400px] mx-auto">
                {/* ── Brand ── */}
                <Link to="/" className="flex items-center gap-4 group shrink-0">
                    <motion.div 
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="relative"
                    >
                        <img 
                            src="/logo_dark.png" 
                            alt="Coding Classes Official Logo" 
                            style={{ width: '48px', height: '48px', borderRadius: '14px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' }} 
                        />
                    </motion.div>
                    <span 
                        className="text-[2.2rem] leading-none font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-400 drop-shadow-lg pb-1"
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
                        <div className="flex items-center gap-6 relative" ref={userMenuRef}>
                            {/* User Folder/Dropdown */}
                            <div className="relative">
                                <button 
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center gap-3 pl-2 transition-all hover:opacity-80 group py-1"
                                >
                                    <div className="relative">
                                        <img 
                                             src={formatAssetUrl(user.avatar)} 
                                             onError={(e) => { e.target.src = "https://cdn-icons-png.flaticon.com/128/3177/3177440.png"; e.target.onError = null; }}
                                             className="w-10 h-10 rounded-xl object-cover border-2 border-indigo-600/20 shadow-lg group-hover:border-indigo-500/50 transition-colors"
                                            alt="avatar" 
                                        />
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full" />
                                    </div>
                                    <div className="hidden lg:flex flex-col items-start -space-y-1">
                                        <div className="flex items-center gap-1">
                                            <span className="text-sm font-bold text-white">{user.name.split(' ')[0]}'s Dashboard</span>
                                            <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${userMenuOpen ? 'rotate-180' : ''}`} />
                                        </div>
                                        <span className="text-[10px] uppercase font-black tracking-widest text-indigo-400">{user.role}</span>
                                    </div>
                                </button>

                                {/* Dropdown Menu (The "Folder") */}
                                <AnimatePresence>
                                    {userMenuOpen && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute right-0 mt-3 w-56 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-2 z-[1100]"
                                        >
                                            <div className="px-3 py-2 border-b border-slate-800/50 mb-1">
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">My Workspace</p>
                                            </div>
                                            

                                            {user.role === 'student' && (
                                                <Link 
                                                    to="/profile#my-courses" 
                                                    onClick={() => setUserMenuOpen(false)}
                                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                                                >
                                                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                                                        <BookOpen size={18} />
                                                    </div>
                                                    My Courses
                                                </Link>
                                            )}

                                            <Link 
                                                to="/profile" 
                                                onClick={() => setUserMenuOpen(false)}
                                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                                                    <UserIcon size={18} />
                                                </div>
                                                All Profile
                                            </Link>

                                            <Link 
                                                to="/profile#security" 
                                                onClick={() => setUserMenuOpen(false)}
                                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                                                    <Shield size={18} />
                                                </div>
                                                Change Password
                                            </Link>



                                            <div className="mt-2 pt-2 border-t border-slate-800/50">
                                                <button 
                                                    onClick={() => { logout(); setUserMenuOpen(false); }}
                                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-rose-400 hover:bg-rose-500/10 transition-all"
                                                >
                                                    <LogOut size={18} />
                                                    Sign Out
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
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
                        className="absolute top-full left-4 right-4 mt-2 p-8 bg-[#0F172A] rounded-3xl border border-slate-800 shadow-2xl lg:hidden z-[2000] overflow-hidden"
                    >
                        {/* Mobile menu background flare */}
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 blur-3xl rounded-full" />
                        
                        <div className="flex flex-col gap-5 relative z-10">
                            {navLinks.map((link) => (
                                <Link 
                                    key={link.path} 
                                    to={link.path}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`
                                        text-xl font-bold p-2 transition-colors
                                        ${location.pathname === link.path ? 'text-indigo-400' : 'text-slate-400 hover:text-white'}
                                    `}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <Link 
                                to={user ? "/profile" : "/login"}
                                onClick={() => setMobileMenuOpen(false)}
                                className="mt-4 p-5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group active:scale-95 transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 bg-indigo-500/20 rounded-xl text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                                        <UserIcon size={20} />
                                    </div>
                                    <span className="font-bold text-white text-lg">
                                        {user ? 'My Dashboard' : 'Account Access'}
                                    </span>
                                </div>
                                <ChevronDown className="-rotate-90 text-slate-500" size={18} />
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
