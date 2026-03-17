import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck, CheckCircle, Loader2, Lock } from 'lucide-react';

const CheckoutModal = ({ isOpen, onClose, course, onPaymentSuccess }) => {
    const [step, setStep] = useState('billing'); // 'billing', 'processing', 'success'
    const [cardData, setCardData] = useState({ number: '', expiry: '', cvc: '', name: '' });

    if (!isOpen || !course) return null;

    const handlePayment = () => {
        setStep('processing');
        // Simulate network delay
        setTimeout(() => {
            setStep('success');
            setTimeout(() => {
                onPaymentSuccess(course._id);
            }, 2000);
        }, 2500);
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="glass-card" style={{ width: '100%', maxWidth: '500px', padding: '40px', position: 'relative', overflow: 'hidden' }}>
                <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    <X size={24} />
                </button>

                {step === 'billing' && (
                    <div className="fade-in">
                        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                            <div style={{ background: 'rgba(99, 102, 241, 0.1)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'var(--accent-primary)' }}>
                                <CreditCard size={30} />
                            </div>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Secure Checkout</h2>
                            <p style={{ color: 'var(--text-secondary)' }}>Complete your enrollment for <strong>{course.title}</strong></p>
                        </div>

                        <div style={{ background: 'var(--bg-secondary)', padding: '20px', borderRadius: '15px', marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: '600' }}>Total Amount</span>
                            <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--accent-primary)' }}>${course.price}</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
                            <input 
                                className="input-field" 
                                placeholder="Card Number" 
                                value={cardData.number}
                                onChange={(e) => setCardData({...cardData, number: e.target.value})}
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
                                    onChange={(e) => setCardData({...cardData, cvc: e.target.value})}
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

                        <button onClick={handlePayment} className="btn btn-primary" style={{ width: '100%', padding: '18px', fontSize: '1.1rem', marginBottom: '20px' }}>
                            Pay and Enroll Now
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                            <Lock size={14} /> 256-bit SSL Secure Encryption
                        </div>
                    </div>
                )}

                {step === 'processing' && (
                    <div style={{ textAlign: 'center', padding: '40px 0' }} className="fade-in">
                        <Loader2 size={60} className="spin" style={{ color: 'var(--accent-primary)', marginBottom: '30px' }} />
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Processing Payment...</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>Verifying with your bank. Please do not close this window.</p>
                    </div>
                )}

                {step === 'success' && (
                    <div style={{ textAlign: 'center', padding: '40px 0' }} className="fade-in">
                        <div style={{ color: 'var(--success)', marginBottom: '30px' }}>
                            <CheckCircle size={80} />
                        </div>
                        <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '10px' }}>Payment Successful!</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>Welcome to the class. Redirecting you to your dashboard...</p>
                        <div style={{ background: 'var(--bg-secondary)', padding: '20px', borderRadius: '15px' }}>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Order ID: CH-{Math.floor(Math.random() * 90000) + 10000}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CheckoutModal;
