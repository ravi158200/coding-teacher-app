import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ASSET_URL } from '../services/api';
import { Sun, Moon, Search, LogOut, Code2, Heart, User } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const Navigate = useNavigate();

    return (
        <nav className="glass-card" style={{ margin: '20px', padding: '12px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: '20px', zIndex: 1000 }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ background: 'var(--accent-primary)', padding: '8px', borderRadius: '12px', color: 'white' }}>
                    <Code2 size={24} />
                </div>
                <span style={{ fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-1px' }}>Coding Classes</span>
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
                <Link to="/" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '0.95rem' }}>Home</Link>
                <Link to="/courses" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '0.95rem' }}>All Courses</Link>
                {user && (
                    <Link to="/profile" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '0.95rem' }}>Dashboard</Link>
                )}
                <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-accent)', padding: '8px 16px', borderRadius: '12px', gap: '10px' }}>
                    <Search size={18} color="var(--text-secondary)" />
                    <input type="text" placeholder="Search lessons..." style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', width: '200px' }} />
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <button onClick={toggleTheme} className="btn" style={{ background: 'var(--bg-accent)', color: 'var(--text-primary)', width: '45px', height: '45px', padding: 0 }}>
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>

                {user ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        {(user.role === 'admin' || user.role === 'teacher') && (
                            <Link to="/admin" style={{ textDecoration: 'none', color: 'var(--accent-primary)', fontWeight: '800', fontSize: '0.9rem' }}>
                                {user.role === 'admin' ? 'Admin' : 'Creator'}
                            </Link>
                        )}
                        <Link to="/profile#favorites" style={{ textDecoration: 'none', color: 'inherit', position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <Heart size={22} color="var(--text-secondary)" />
                            {user.favorites?.length > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: '-8px',
                                    right: '-10px',
                                    background: '#ef4444',
                                    color: 'white',
                                    fontSize: '0.65rem',
                                    fontWeight: '800',
                                    width: '18px',
                                    height: '18px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '2px solid var(--bg-primary)'
                                }}>
                                    {user.favorites.length}
                                </span>
                            )}
                        </Link>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Welcome, <span style={{ color: 'var(--text-primary)' }}>{user.name}</span></span>
                            <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'var(--text-primary)' }}>
                                <img 
                                    src={user.avatar?.startsWith('http') ? user.avatar : `${ASSET_URL}${user.avatar}`} 
                                    style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid var(--accent-primary)', objectFit: 'cover' }} 
                                    alt="avatar" 
                                />
                            </Link>
                            <button 
                                onClick={() => {
                                    logout();
                                    // Timeout ensures React re-renders and removes user UI before the alert blocks the thread
                                    setTimeout(() => {
                                        alert('Successfully logged out!');
                                        Navigate('/login');
                                    }, 100);
                                }} 
                                className="btn" 
                                style={{ color: 'var(--text-secondary)', padding: 0 }}
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <Link to="/login" style={{ textDecoration: 'none' }}>
                            <button className="btn btn-primary" style={{ background: '#3b82f6', boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.4)' }}>Login</button>
                        </Link>
                        <Link to="/register" style={{ textDecoration: 'none' }}>
                            <button className="btn btn-primary">Signup</button>
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
