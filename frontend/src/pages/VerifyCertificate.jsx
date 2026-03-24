import React, { useState } from 'react';
import { ShieldCheck, Search, Loader2, Award, User, Calendar, CheckCircle, Info, QrCode, Scan, X, Camera } from 'lucide-react';

const VerifyCertificate = () => {
    const [certId, setCertId] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [isScanning, setIsScanning] = useState(false);

    const handleVerify = (e) => {
        if (e) e.preventDefault();
        if (!certId) return;
        
        setLoading(true);
        setError('');
        setResult(null);

        // Simulated verification logic
        setTimeout(() => {
            if (certId.toLowerCase().includes('cc-')) {
                setResult({
                    id: certId.toUpperCase(),
                    studentName: "Verified Student",
                    course: "Advanced Engineering & System Design",
                    issueDate: "October 24, 2025",
                    status: "Authentic"
                });
            } else {
                setError("Invalid Certificate ID. Please check the ID printed on the bottom left of your certificate.");
            }
            setLoading(false);
        }, 1500);
    };

    const simulateScan = () => {
        setIsScanning(true);
        setTimeout(() => {
            setCertId('CC-9988-QR-VALID');
            setIsScanning(false);
            // Auto trigger verification after scan
            setTimeout(() => {
                const fakeEvent = { preventDefault: () => {} };
                // Using the actual certId from closure wouldn't work easily here, 
                // but since handleVerify uses state, we just need to call it
                // after state has updated.
            }, 100);
        }, 3000);
    };

    // Effect to trigger verification when certId is set by scanner
    React.useEffect(() => {
        if (certId === 'CC-9988-QR-VALID') {
            handleVerify();
        }
    }, [certId]);

    return (
        <div className="container section-padding fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--success)10', padding: '10px 20px', borderRadius: '30px', color: 'var(--success)', fontWeight: '800', fontSize: '0.9rem', marginBottom: '20px', border: '1px solid var(--success)20' }}>
                    <ShieldCheck size={20} /> Official Verification Portal
                </div>
                <h1 style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '15px' }}>Verify <span className="text-gradient">Credentials</span></h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>Validate the authenticity of certificates issued by Coding Classes to our elite engineering cohorts.</p>
            </div>

            <div className="glass-card" style={{ padding: '50px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                    <button 
                        onClick={() => setIsScanning(true)}
                        className="btn" 
                        style={{ flex: 1, padding: '15px', background: 'var(--bg-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontWeight: '800' }}
                    >
                        <QrCode size={20} /> Scan QR Code
                    </button>
                    <div style={{ flex: 2, position: 'relative' }}>
                        <Search style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={18} />
                        <input 
                            type="text"
                            placeholder="Or enter Certificate ID manually..."
                            style={{ width: '100%', padding: '15px 15px 15px 45px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-primary)', fontWeight: '700' }}
                            value={certId}
                            onChange={(e) => setCertId(e.target.value)}
                        />
                    </div>
                </div>

                <button 
                    onClick={handleVerify} 
                    disabled={loading || !certId} 
                    className="btn btn-primary" 
                    style={{ width: '100%', padding: '18px', fontSize: '1.1rem', background: 'var(--success)', border: 'none', boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)' }}
                >
                    {loading ? <><Loader2 className="spin" size={24} /> Validating Hash...</> : "Verify Authenticity"}
                </button>

                {error && (
                    <div className="fade-in" style={{ marginTop: '30px', padding: '20px', background: '#fee2e2', color: '#b91c1c', borderRadius: '15px', display: 'flex', alignItems: 'center', gap: '15px', fontWeight: '700' }}>
                        <Info size={24} /> {error}
                    </div>
                )}

                {result && (
                    <div className="fade-in" style={{ marginTop: '40px', padding: '40px', background: 'var(--bg-accent)', borderRadius: '24px', border: '1px solid var(--border)' }}>
                        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--success)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 15px 30px rgba(16, 185, 129, 0.2)' }}>
                                <CheckCircle size={40} />
                            </div>
                            <h3 style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--success)' }}>Certificate Verified</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>This credential is an authentic digital issuance.</p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) minmax(200px, 1fr)', gap: '20px' }}>
                            <div style={{ padding: '20px', background: 'var(--bg-primary)', borderRadius: '15px', border: '1px solid var(--border)' }}>
                                <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: '800' }}><User size={14} style={{ verticalAlign: 'middle', marginRight: '5px' }} /> Recipient</p>
                                <p style={{ fontSize: '1.1rem', fontWeight: '800' }}>{result.studentName}</p>
                            </div>
                            <div style={{ padding: '20px', background: 'var(--bg-primary)', borderRadius: '15px', border: '1px solid var(--border)' }}>
                                <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: '800' }}><Award size={14} style={{ verticalAlign: 'middle', marginRight: '5px' }} /> Course</p>
                                <p style={{ fontSize: '1.1rem', fontWeight: '800' }}>{result.course}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* QR Scanner Simulation Modal */}
            {isScanning && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 99999, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div style={{ maxWidth: '500px', width: '100%', textAlign: 'center' }}>
                        <div style={{ position: 'relative', width: '300px', height: '300px', margin: '0 auto 40px', border: '2px solid rgba(255,255,255,0.2)', borderRadius: '30px', overflow: 'hidden' }}>
                            {/* Scanning Line Animation */}
                            <div className="scanner-line" style={{ 
                                position: 'absolute', 
                                top: 0, 
                                left: 0, 
                                width: '100%', 
                                height: '2px', 
                                background: 'var(--success)', 
                                boxShadow: '0 0 15px var(--success)',
                                zIndex: 2
                            }} />
                            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.1)' }}>
                                <Camera size={100} />
                            </div>
                            <video style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3 }} autoPlay muted playsInline />
                        </div>
                        <h2 style={{ color: 'white', fontSize: '1.8rem', fontWeight: '900', marginBottom: '15px' }}>Scanning QR Code...</h2>
                        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '30px' }}>Point your camera at the certificate's QR code to verify instantly.</p>
                        <button onClick={() => setIsScanning(false)} className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '12px 30px' }}><X size={18} /> Cancel Scan</button>
                        
                        {/* Simulation trigger */}
                        <div style={{ marginTop: '20px' }}>
                            <button onClick={simulateScan} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', padding: '5px 15px', borderRadius: '20px', cursor: 'pointer' }}>[SIMULATE SUCCESSFUL SCAN]</button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes scan {
                    0% { top: 0; }
                    100% { top: 100%; }
                }
                .scanner-line {
                    animation: scan 2s linear infinite;
                }
            `}</style>

            <div style={{ marginTop: '40px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <Info size={16} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                Having trouble? Contact our verification office at <span style={{ color: 'var(--accent-primary)', fontWeight: '700' }}>verify@codingclasses.edu</span>
            </div>
        </div>
    );
};

export default VerifyCertificate;
