import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, Code2, Loader2, BookOpen, Users, Eye, EyeOff, Star, CheckCircle2, AlertCircle, Phone, KeyRound, ArrowLeft, CheckCircle } from 'lucide-react';
import class1 from '../assets/class1.png';
import class2 from '../assets/class2.png';
import API from '../services/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(null);
    const [isPasswordStrong, setIsPasswordStrong] = useState(null);

    // Forgot password states
    const [view, setView] = useState('login'); // 'login' | 'forgot'
    const [forgotStep, setForgotStep] = useState(1); // 1=email, 2=phone+newpwd, 3=success
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotPhone, setForgotPhone] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showNewPwd, setShowNewPwd] = useState(false);
    const [forgotLoading, setForgotLoading] = useState(false);
    const [forgotError, setForgotError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    const validateEmail = (val) => {
        setEmail(val);
        setIsEmailValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val));
    };
    const validatePassword = (val) => {
        setPassword(val);
        setIsPasswordStrong(val.length >= 6);
    };

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

    const handleForgotStep1 = (e) => {
        e.preventDefault();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) {
            setForgotError('Please enter a valid email address.');
            return;
        }
        setForgotError('');
        setForgotStep(2);
    };

    const handleForgotStep2 = async (e) => {
        e.preventDefault();
        if (newPassword.length < 6) {
            setForgotError('New password must be at least 6 characters.');
            return;
        }
        setForgotLoading(true);
        setForgotError('');
        try {
            await API.post('/auth/forgot-password', {
                email: forgotEmail,
                phoneNumber: forgotPhone,
                newPassword
            });
            setForgotStep(3);
        } catch (err) {
            setForgotError(err.response?.data?.message || 'Reset failed. Please try again.');
        } finally {
            setForgotLoading(false);
        }
    };

    const resetForgot = () => {
        setView('login');
        setForgotStep(1);
        setForgotEmail('');
        setForgotPhone('');
        setNewPassword('');
        setForgotError('');
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-primary)', fontFamily: 'var(--font-body)' }}>
            {/* Left Side */}
            <div className="desktop-only" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px', position: 'relative', overflow: 'hidden', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderRight: '1px solid var(--border)' }}>
                <div style={{ position: 'relative', zIndex: 2 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
                        <div style={{ background: 'var(--accent-primary)', padding: '10px', borderRadius: '15px' }}>
                            <Code2 size={40} color="white" />
                        </div>
                        <h1 style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--text-primary)' }}>Coding Classes</h1>
                    </div>
                    <h2 style={{ fontSize: '2.5rem', color: 'var(--text-primary)', marginBottom: '20px', lineHeight: '1.2' }}>Master the Art of <br/><span style={{ color: 'var(--accent-primary)' }}>Modern Engineering</span></h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '50px', maxWidth: '500px' }}>Join a community of 50,000+ developers building the future.</p>
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
                <div style={{ marginTop: 'auto' }}>
                    <div className="glass-card" style={{ padding: '30px', background: 'rgba(255,255,255,0.2)', border: '1px solid var(--border)', borderRadius: '24px' }}>
                        <div style={{ display: 'flex', gap: '4px', color: '#f59e0b', marginBottom: '15px' }}>
                            {[1,2,3,4,5].map(s => <Star key={s} size={16} fill="#f59e0b" />)}
                        </div>
                        <p style={{ color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: '600', lineHeight: '1.6', marginBottom: '25px', fontStyle: 'italic' }}>
                            "The live mentorship sessions are a game changer."
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <img src="https://cdn-icons-png.flaticon.com/128/3177/3177440.png" style={{ width: '45px', height: '45px', borderRadius: '50%', border: '2px solid var(--accent-primary)' }} alt="student" />
                            <div>
                                <h4 style={{ color: 'var(--text-primary)', fontSize: '0.95rem', fontWeight: '800' }}>Arjun Verma</h4>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>SDE-1 @ TechFlow</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '400px', height: '400px', background: 'var(--accent-primary)', filter: 'blur(150px)', opacity: 0.2 }}></div>
            </div>

            {/* Right Side */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
                <div className="glass-card fade-in" style={{ width: '100%', maxWidth: '450px', padding: '50px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>

                    {/* ── LOGIN VIEW ── */}
                    {view === 'login' && (
                        <>
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
                                    <input type="email" className="input-field" style={{ paddingLeft: '45px', borderColor: isEmailValid === true ? 'var(--success)' : isEmailValid === false ? '#ef4444' : 'var(--border)' }} placeholder="Email Address" value={email} onChange={(e) => validateEmail(e.target.value)} required />
                                    {isEmailValid !== null && (
                                        <div style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', color: isEmailValid ? 'var(--success)' : '#ef4444' }}>
                                            {isEmailValid ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                                        </div>
                                    )}
                                </div>
                                <div style={{ position: 'relative' }}>
                                    <Lock style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={18} />
                                    <input type={showPassword ? "text" : "password"} className="input-field" style={{ paddingLeft: '45px', paddingRight: '70px', borderColor: isPasswordStrong === true ? 'var(--success)' : isPasswordStrong === false ? '#f59e0b' : 'var(--border)' }} placeholder="Password" value={password} onChange={(e) => validatePassword(e.target.value)} required />
                                    <div style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: '8px', alignItems: 'center' }}>
                                        {isPasswordStrong !== null && (
                                            <div style={{ color: isPasswordStrong ? 'var(--success)' : '#f59e0b' }}>
                                                {isPasswordStrong ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                                            </div>
                                        )}
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0 }}>
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Forgot Password link */}
                                <div style={{ textAlign: 'right', marginTop: '-10px' }}>
                                    <button type="button" onClick={() => setView('forgot')} style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>
                                        Forgot Password?
                                    </button>
                                </div>

                                <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '16px', fontSize: '1.1rem', background: '#3b82f6', boxShadow: '0 10px 20px -5px rgba(59,130,246,0.4)' }}>
                                    {loading ? <><Loader2 className="spin" size={20} /> Authenticating...</> : "Log In Now"}
                                </button>
                                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                    Don't have an account? <Link to="/register" style={{ color: 'var(--accent-primary)', fontWeight: '700', textDecoration: 'none' }}>Sign Up</Link>
                                </p>
                            </form>
                        </>
                    )}

                    {/* ── FORGOT PASSWORD VIEW ── */}
                    {view === 'forgot' && (
                        <>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px' }}>
                                <button onClick={resetForgot} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '700', padding: 0 }}>
                                    <ArrowLeft size={18} /> Back to Login
                                </button>
                            </div>

                            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                                <div style={{ background: forgotStep === 3 ? 'var(--success)' : '#f59e0b', width: '60px', height: '60px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'white', transition: 'background 0.4s' }}>
                                    {forgotStep === 3 ? <CheckCircle size={28} /> : <KeyRound size={28} />}
                                </div>
                                <h2 style={{ fontSize: '1.9rem', fontWeight: '800' }}>
                                    {forgotStep === 1 ? 'Reset Password' : forgotStep === 2 ? 'Verify Identity' : 'All Done!'}
                                </h2>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '8px' }}>
                                    {forgotStep === 1 && 'Enter your registered email to begin.'}
                                    {forgotStep === 2 && 'Enter your new password. If you have a phone on your profile, enter it too.'}
                                    {forgotStep === 3 && 'Your password has been reset successfully.'}
                                </p>
                            </div>

                            {/* Step dots */}
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '25px' }}>
                                {[1, 2, 3].map(s => (
                                    <div key={s} style={{ width: s === forgotStep ? '28px' : '8px', height: '8px', borderRadius: '4px', background: s <= forgotStep ? (forgotStep === 3 ? 'var(--success)' : '#f59e0b') : 'var(--border)', transition: 'all 0.3s' }} />
                                ))}
                            </div>

                            {forgotError && (
                                <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '10px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', color: '#ef4444', fontSize: '0.88rem', fontWeight: '600' }}>
                                    <AlertCircle size={16} /> {forgotError}
                                </div>
                            )}

                            {/* Step 1: Email */}
                            {forgotStep === 1 && (
                                <form onSubmit={handleForgotStep1} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    <div style={{ position: 'relative' }}>
                                        <Mail style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={18} />
                                        <input type="email" className="input-field" style={{ paddingLeft: '45px' }} placeholder="Registered Email Address" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} required />
                                    </div>
                                    <button type="submit" className="btn btn-primary" style={{ padding: '15px', background: '#f59e0b', boxShadow: '0 10px 20px -5px rgba(245,158,11,0.4)' }}>
                                        Continue →
                                    </button>
                                </form>
                            )}

                            {/* Step 2: Phone (optional) + New Password */}
                            {forgotStep === 2 && (
                                <form onSubmit={handleForgotStep2} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    <div style={{ position: 'relative' }}>
                                        <Phone style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={18} />
                                        <input type="tel" className="input-field" style={{ paddingLeft: '45px' }} placeholder="Phone Number (if saved on profile)" value={forgotPhone} onChange={e => setForgotPhone(e.target.value)} />
                                    </div>
                                    <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '-10px' }}>ℹ️ Only required if you added a phone number to your account.</p>
                                    <div style={{ position: 'relative' }}>
                                        <Lock style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={18} />
                                        <input type={showNewPwd ? "text" : "password"} className="input-field" style={{ paddingLeft: '45px', paddingRight: '50px' }} placeholder="New Password (min. 6 chars)" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                                        <button type="button" onClick={() => setShowNewPwd(!showNewPwd)} style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: 0 }}>
                                            {showNewPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    <button type="submit" disabled={forgotLoading} className="btn btn-primary" style={{ padding: '15px', background: '#f59e0b', boxShadow: '0 10px 20px -5px rgba(245,158,11,0.4)' }}>
                                        {forgotLoading ? <><Loader2 className="spin" size={18} /> Resetting...</> : 'Reset Password'}
                                    </button>
                                </form>
            )}

                            {/* Step 3: Success */}
                            {forgotStep === 3 && (
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid var(--success)', borderRadius: '16px', padding: '20px', marginBottom: '25px' }}>
                                        <p style={{ color: 'var(--success)', fontWeight: '700' }}>✅ Password updated successfully!</p>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '6px' }}>You can now log in with your new password.</p>
                                    </div>
                                    <button onClick={resetForgot} className="btn btn-primary" style={{ width: '100%', padding: '15px' }}>
                                        Go to Login
                                    </button>
                                </div>
                            )}
                        </>
                    )}
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
