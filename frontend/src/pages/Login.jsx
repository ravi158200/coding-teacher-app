import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, Code2, Loader2, Sparkles, BookOpen, Users, Eye, EyeOff } from 'lucide-react';
import class1 from '../assets/class1.png';
import class2 from '../assets/class2.png';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
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
            backgroundColor: '#1E293B',
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
                    
                    <h2 style={{ fontSize: '2.5rem', color: 'white', marginBottom: '20px', lineHeight: '1.2' }}> Master the Art of <br/> <span style={{ color: 'var(--accent-primary)' }}>Modern Engineering</span></h2>
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

            {/* Right Side: Login Form */}
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
                            <LogIn size={28} />
                        </div>
                        <h2 style={{ fontSize: '2.2rem', fontWeight: '800' }}>Welcome Back</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>Continue your learning journey.</p>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
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
                                type={showPassword ? "text" : "password"} 
                                className="input-field" 
                                style={{ paddingLeft: '45px', paddingRight: '45px' }} 
                                placeholder="Password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '15px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        
                        <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '16px', fontSize: '1.1rem', background: '#3b82f6', boxShadow: '0 10px 20px -5px rgba(59, 130, 246, 0.4)' }}>
                            {loading ? <><Loader2 className="spin" size={20} /> Authenticating...</> : "Log In Now"}
                        </button>
                        
                        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            Don't have an account? <Link to="/register" style={{ color: 'var(--accent-primary)', fontWeight: '700', textDecoration: 'none' }}>Sign Up</Link>
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

export default Login;
