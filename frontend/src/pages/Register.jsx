import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, UserPlus, Loader2, Code2, Users, BookOpen, Eye, EyeOff, Star, Phone } from 'lucide-react';
import class1 from '../assets/class1.png';
import class2 from '../assets/class2.png';

const Register = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        setLoading(true);
        try {
            const fullName = `${firstName.trim()} ${lastName.trim()}`;
            const fullPhone = `+91${phone}`;
            // Generate a professional registration number if not provided by backend
            const regNumber = `CC-REG-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
            
            await register(fullName, email, password, fullPhone, regNumber);
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
            backgroundColor: 'var(--bg-primary)',
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
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRight: '1px solid var(--border)'
                }}
            >
                <div style={{ position: 'relative', zIndex: 2 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
                        <div style={{ background: 'var(--accent-primary)', padding: '10px', borderRadius: '15px' }}>
                            <Code2 size={40} color="white" />
                        </div>
                        <h1 style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--text-primary)' }}>Coding Classes</h1>
                    </div>
                    
                    <h2 style={{ fontSize: '2.5rem', color: 'var(--text-primary)', marginBottom: '20px', lineHeight: '1.2' }}> Start Your <br/> <span style={{ color: 'var(--accent-primary)' }}>Engineering Journey</span></h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '50px', maxWidth: '500px' }}>Join a community of 50,000+ developers building the future. Experience our interactive classes and expert-led mentorship.</p>
                
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
                    <div className="glass-card" style={{ padding: '30px', background: 'rgba(255, 255, 255, 0.2)', border: '1px solid var(--border)', borderRadius: '24px' }}>
                        <div style={{ display: 'flex', gap: '4px', color: '#f59e0b', marginBottom: '15px' }}>
                            {[1, 2, 3, 4, 5].map(star => <Star key={star} size={16} fill="#f59e0b" />)}
                        </div>
                        <p style={{ color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: '600', lineHeight: '1.6', marginBottom: '25px', fontStyle: 'italic' }}>
                            "Detailed, project-oriented, and extremely hands-on. The AI Assistant helped me debug my code even late at night! Highly recommended."
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <img src="https://cdn-icons-png.flaticon.com/128/1995/1995539.png" style={{ width: '45px', height: '45px', borderRadius: '50%', border: '2px solid var(--accent-primary)' }} alt="student" />
                            <div>
                                <h4 style={{ color: 'var(--text-primary)', fontSize: '0.95rem', fontWeight: '800' }}>Sneha Kapur</h4>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Frontend Engineer</p>
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
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div style={{ position: 'relative' }}>
                                <User style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={18} />
                                <input 
                                    type="text" 
                                    className="input-field" 
                                    style={{ paddingLeft: '45px' }} 
                                    placeholder="First Name" 
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                />
                            </div>
                            <div style={{ position: 'relative' }}>
                                <User style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={18} />
                                <input 
                                    type="text" 
                                    className="input-field" 
                                    style={{ paddingLeft: '45px' }} 
                                    placeholder="Last Name" 
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                />
                            </div>
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
                            <Phone size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <div style={{ position: 'absolute', left: '45px', top: '50%', transform: 'translateY(-50%)', fontWeight: '800', color: 'var(--text-primary)', borderRight: '1px solid var(--border)', paddingRight: '8px', pointerEvents: 'none' }}>
                                +91
                            </div>
                            <input 
                                type="tel" 
                                placeholder="Mobile Number" 
                                className="input-field" 
                                style={{ paddingLeft: '85px' }} 
                                value={phone}
                                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
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
                        <div style={{ position: 'relative' }}>
                            <Lock style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={18} />
                            <input 
                                type={showPassword ? "text" : "password"} 
                                className="input-field" 
                                style={{ paddingLeft: '45px', paddingRight: '45px' }} 
                                placeholder="Confirm Password" 
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
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
