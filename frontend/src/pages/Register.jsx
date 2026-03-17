import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, UserPlus, Loader2, Code2, Users, BookOpen } from 'lucide-react';
import class1 from '../assets/class1.png';
import class2 from '../assets/class2.png';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await register(name, email, password);
            navigate('/');
        } catch (error) {
            alert(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ 
            display: 'flex', 
            minHeight: '100vh',
            backgroundImage: 'linear-gradient(rgba(2, 6, 23, 0.8), rgba(2, 6, 23, 0.9)), url("/auth-bg.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            fontFamily: 'var(--font-body)'
        }}>
            {/* Left Side: Preview Images & Branding */}
            <div 
                className="desktop-only"
                style={{ 
                    flex: 1, 
                    display: 'flex', 
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '60px',
                    position: 'relative',
                    overflow: 'hidden',
                    background: 'rgba(15, 23, 42, 0.4)',
                    backdropFilter: 'blur(10px)',
                    borderRight: '1px solid rgba(255, 255, 255, 0.05)'
                }}
            >
                <div style={{ position: 'relative', zIndex: 2 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
                        <div style={{ background: 'var(--accent-primary)', padding: '10px', borderRadius: '15px' }}>
                            <Code2 size={40} color="white" />
                        </div>
                        <h1 style={{ fontSize: '3rem', fontWeight: '800', color: 'white' }}>Coding Classes</h1>
                    </div>
                    
                    <h2 style={{ fontSize: '2.5rem', color: 'white', marginBottom: '20px', lineHeight: '1.2' }}> Start Your <br/> <span style={{ color: 'var(--accent-primary)' }}>Engineering Journey</span></h2>
                    <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '50px', maxWidth: '500px' }}>Join a community of 50,000+ developers building the future. Experience our interactive classes and expert-led mentorship.</p>
                
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                        <div className="glass-card" style={{ padding: '0', overflow: 'hidden', borderRadius: '20px', transform: 'rotate(-2deg)' }}>
                            <img src={class1} style={{ width: '100%', height: '250px', objectFit: 'cover' }} alt="Class Preview" />
                            <div style={{ padding: '15px', color: 'white', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)' }}>
                                <p style={{ fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}><Users size={16}/> Live Mentorship</p>
                            </div>
                        </div>
                        <div className="glass-card" style={{ padding: '0', overflow: 'hidden', borderRadius: '20px', transform: 'rotate(2deg)', marginTop: '40px' }}>
                            <img src={class2} style={{ width: '100%', height: '250px', objectFit: 'cover' }} alt="Class Preview" />
                            <div style={{ padding: '15px', color: 'white', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)' }}>
                                <p style={{ fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}><BookOpen size={16}/> Interactive Labs</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Decorative mesh */}
                <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '400px', height: '400px', background: 'var(--accent-primary)', filter: 'blur(150px)', opacity: 0.2 }}></div>
            </div>

            {/* Right Side: Register Form */}
            <div style={{ 
                flex: 1, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                padding: '40px'
            }}>
                <div className="glass-card fade-in" style={{ 
                    width: '100%', 
                    maxWidth: '450px', 
                    padding: '50px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <div style={{ background: 'var(--accent-primary)', width: '60px', height: '60px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'white' }}>
                            <UserPlus size={28} />
                        </div>
                        <h2 style={{ fontSize: '2.2rem', fontWeight: '800' }}>Join Us</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>Get started with your developer journey.</p>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ position: 'relative' }}>
                            <User style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={18} />
                            <input 
                                type="text" 
                                className="input-field" 
                                style={{ paddingLeft: '45px' }} 
                                placeholder="Full Name" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div style={{ position: 'relative' }}>
                            <Mail style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={18} />
                            <input 
                                type="email" 
                                className="input-field" 
                                style={{ paddingLeft: '45px' }} 
                                placeholder="Email Address" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div style={{ position: 'relative' }}>
                            <Lock style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={18} />
                            <input 
                                type="password" 
                                className="input-field" 
                                style={{ paddingLeft: '45px' }} 
                                placeholder="Password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        
                        <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '16px', fontSize: '1.1rem', marginTop: '10px' }}>
                            {loading ? <><Loader2 className="spin" size={20} /> Creating Account...</> : "Create Account"}
                        </button>
                        
                        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            Already a member? <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: '700', textDecoration: 'none' }}>Log In</Link>
                        </p>
                    </form>
                </div>
            </div>
            
            <style>{`
                @media (max-width: 1024px) {
                    .desktop-only { display: none !important; }
                }
            `}</style>
        </div>
    );
};

export default Register;
