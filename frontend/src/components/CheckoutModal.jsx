import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck, CheckCircle, Loader2, Lock, Smartphone, Globe, Landmark, ChevronRight } from 'lucide-react';

const CheckoutModal = ({ isOpen, onClose, course, onPaymentSuccess }) => {
    const [step, setStep] = useState('billing'); // 'billing', 'processing', 'success'
    const [method, setMethod] = useState('card'); // 'card', 'upi', 'netbanking'
    const [cardData, setCardData] = useState({ number: '', expiry: '', cvc: '', name: '' });
    const [upiId, setUpiId] = useState('');
    const [selectedBank, setSelectedBank] = useState('');

    if (!isOpen || !course) return null;

    const handlePayment = () => {
        if (method === 'card') {
            if (!cardData.number || cardData.number.length < 16) {
                alert('Please enter a valid 16-digit card number.');
                return;
            }
            if (!cardData.expiry || !cardData.cvc) {
                alert('Expiry date and CVC are mandatory for secure payment.');
                return;
            }
            if (!cardData.name) {
                alert('Please enter the cardholder name.');
                return;
            }
        } else if (method === 'upi') {
            if (!upiId || !upiId.includes('@')) {
                alert('Please enter a valid UPI ID (e.g. name@bank)');
                return;
            }
        } else if (method === 'netbanking') {
            if (!selectedBank) {
                alert('Please select your bank for Net Banking.');
                return;
            }
        }

        setStep('processing');
        // Simulate network delay
        setTimeout(() => {
            setStep('success');
            setTimeout(() => {
                onPaymentSuccess(course._id);
            }, 2000);
        }, 2500);
    };

    const methodTabStyle = (active) => ({
        flex: 1,
        padding: '12px',
        borderRadius: '12px',
        border: active ? '2px solid var(--accent-primary)' : '1px solid var(--border)',
        background: active ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
        color: active ? 'var(--accent-primary)' : 'var(--text-secondary)',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        transition: 'all 0.2s ease',
        fontWeight: '700',
        fontSize: '0.75rem'
    });

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="glass-card" style={{ width: '100%', maxWidth: '500px', padding: '40px', position: 'relative', overflow: 'hidden' }}>
                <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    <X size={24} />
                </button>

                {step === 'billing' && (
                    <div className="fade-in">
                        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Secure Checkout</h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Enrolling in: <strong>{course.title}</strong></p>
                        </div>

                        {/* Order Summary */}
                        <div style={{ background: 'var(--bg-secondary)', padding: '15px 20px', borderRadius: '15px', marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px dashed var(--border)' }}>
                            <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>Payable Amount</span>
                            <span style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--accent-primary)' }}>₹{course.price}</span>
                        </div>

                        {/* Method Selector */}
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
                            <div onClick={() => setMethod('card')} style={methodTabStyle(method === 'card')}>
                                <CreditCard size={20} />
                                <span>CARD</span>
                            </div>
                            <div onClick={() => setMethod('upi')} style={methodTabStyle(method === 'upi')}>
                                <Smartphone size={20} />
                                <span>UPI</span>
                            </div>
                            <div onClick={() => setMethod('netbanking')} style={methodTabStyle(method === 'netbanking')}>
                                <Landmark size={20} />
                                <span>NET BANKING</span>
                            </div>
                        </div>

                        {/* Payment Inputs */}
                        <div style={{ marginBottom: '30px' }}>
                            {method === 'card' && (
                                <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    <input 
                                        className="input-field" 
                                        placeholder="16-Digit Card Number" 
                                        value={cardData.number}
                                        onChange={(e) => setCardData({...cardData, number: e.target.value.replace(/\D/g, '')})}
                                        maxLength="16"
                                    />
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                        <input 
                                            className="input-field" 
                                            placeholder="MM/YY" 
                                            value={cardData.expiry}
                                            onChange={(e) => setCardData({...cardData, expiry: e.target.value})}
                                        />
                                        <input 
                                            className="input-field" 
                                            placeholder="CVC" 
                                            type="password"
                                            value={cardData.cvc}
                                            onChange={(e) => setCardData({...cardData, cvc: e.target.value.replace(/\D/g, '')})}
                                            maxLength="3"
                                        />
                                    </div>
                                    <input 
                                        className="input-field" 
                                        placeholder="Cardholder Name" 
                                        value={cardData.name}
                                        onChange={(e) => setCardData({...cardData, name: e.target.value})}
                                    />
                                </div>
                            )}

                            {method === 'upi' && (
                                <div className="fade-in">
                                    <p style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '10px', color: 'var(--text-secondary)' }}>Enter UPI ID (VPA)</p>
                                    <input 
                                        className="input-field" 
                                        placeholder="username@bank / mobile@upi" 
                                        value={upiId}
                                        onChange={(e) => setUpiId(e.target.value)}
                                    />
                                    <div style={{ marginTop: '15px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                        {['@okaxis', '@okhdfcbank', '@okicici', '@paytm'].map(suffix => (
                                            <button 
                                                key={suffix}
                                                onClick={() => setUpiId(prev => prev.split('@')[0] + suffix)}
                                                style={{ padding: '6px 12px', borderRadius: '8px', background: 'var(--bg-accent)', border: '1px solid var(--border)', fontSize: '0.7rem', color: 'var(--text-secondary)', cursor: 'pointer' }}
                                            >
                                                {suffix}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {method === 'netbanking' && (
                                <div className="fade-in">
                                    <p style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '10px', color: 'var(--text-secondary)' }}>Select Your Bank</p>
                                    <select 
                                        className="input-field" 
                                        value={selectedBank}
                                        onChange={(e) => setSelectedBank(e.target.value)}
                                        style={{ height: '50px' }}
                                    >
                                        <option value="">-- Choose Bank --</option>
                                        <option value="sbi">State Bank of India</option>
                                        <option value="hdfc">HDFC Bank</option>
                                        <option value="icici">ICICI Bank</option>
                                        <option value="axis">Axis Bank</option>
                                        <option value="kotak">Kotak Mahindra</option>
                                    </select>
                                </div>
                            )}
                        </div>

                        <button onClick={handlePayment} className="btn btn-primary" style={{ width: '100%', padding: '18px', fontSize: '1.1rem', marginBottom: '20px' }}>
                            {method === 'card' ? 'Pay and Enroll' : method === 'upi' ? 'Verify and Pay' : 'Proceed to Bank'} <ChevronRight size={18} />
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                            <Lock size={12} /> Secure PCI-DSS Encrypted Transaction
                        </div>
                    </div>
                )}

                {step === 'processing' && (
                    <div style={{ textAlign: 'center', padding: '40px 0' }} className="fade-in">
                        <Loader2 size={60} className="spin" style={{ color: 'var(--accent-primary)', marginBottom: '30px' }} />
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Processing {method.toUpperCase()} Payment...</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>Verifying your credentials. Please do not close this window.</p>
                    </div>
                )}

                {step === 'success' && (
                    <div style={{ textAlign: 'center', padding: '40px 0' }} className="fade-in">
                        <div style={{ color: 'var(--success)', marginBottom: '30px' }}>
                            <CheckCircle size={80} />
                        </div>
                        <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '10px' }}>Payment Successful!</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>Welcome to the platform. Redirecting to your dashboard...</p>
                        <div style={{ background: 'var(--bg-secondary)', padding: '20px', borderRadius: '15px' }}>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Order ID: CH-{Math.floor(Math.random() * 90000) + 10000}</p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '5px' }}>Mode: {method.toUpperCase()}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CheckoutModal;
