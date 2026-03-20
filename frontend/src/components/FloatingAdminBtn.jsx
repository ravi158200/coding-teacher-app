
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Settings, Layout, Plus, Video, Megaphone, HelpCircle, ArrowRight, X } from 'lucide-react';

const FloatingAdminBtn = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    if (!user || (user.role !== 'admin' && user.role !== 'teacher')) return null;

    const quickLinks = [
        { label: 'Draft Course', icon: <Plus size={18} />, path: '/admin?tab=create' },
        { label: 'Upload Video', icon: <Video size={18} />, path: '/admin?tab=videos' },
        { label: 'Post Update', icon: <Megaphone size={18} />, path: '/admin?tab=announcements' },
        { label: 'Enquiries', icon: <HelpCircle size={18} />, path: '/admin?tab=enquiries' },
        { label: 'Manage All', icon: <Layout size={18} />, path: '/admin?tab=manage' },
    ];

    const handleClick = (path) => {
        setIsOpen(false);
        navigate(path);
    };

    return (
        <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '15px' }}>
            
            {/* Quick Menu Items */}
            {isOpen && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '10px' }}>
                    {quickLinks.map((link, idx) => (
                        <div 
                            key={idx}
                            onClick={() => handleClick(link.path)}
                            className="fade-in"
                            style={{
                                background: 'white',
                                color: 'var(--text-primary)',
                                padding: '12px 24px',
                                borderRadius: '16px',
                                boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                cursor: 'pointer',
                                fontWeight: '700',
                                fontSize: '0.9rem',
                                transition: 'all 0.2s',
                                border: '1px solid var(--border)',
                                animation: `slideUp 0.3s ease forwards ${idx * 0.05}s`
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateX(-10px)';
                                e.currentTarget.style.color = 'var(--accent-primary)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateX(0)';
                                e.currentTarget.style.color = 'var(--text-primary)';
                            }}
                        >
                            <span style={{ color: 'var(--accent-primary)' }}>{link.icon}</span>
                            {link.label}
                        </div>
                    ))}
                </div>
            )}

            {/* Main Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    background: isOpen ? '#ef4444' : 'var(--accent-primary)',
                    color: 'white',
                    width: '64px',
                    height: '64px',
                    borderRadius: '20px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 12px 40px rgba(99, 102, 241, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
                onMouseEnter={e => {
                    e.currentTarget.style.transform = 'scale(1.1) translateY(-5px)';
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.transform = 'scale(1) translateY(0)';
                }}
            >
                {isOpen ? <X size={28} /> : <Shield size={28} />}
                {!isOpen && (
                    <span style={{
                        position: 'absolute',
                        top: '-5px',
                        right: '-5px',
                        background: '#ef4444',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        border: '3px solid white',
                        display: 'block'
                    }}></span>
                )}
            </button>

            <style>{`
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default FloatingAdminBtn;
