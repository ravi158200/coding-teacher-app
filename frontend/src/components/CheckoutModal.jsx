import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck, CheckCircle, Loader2, Lock, Smartphone, Globe, Landmark, ChevronRight, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CheckoutModal = ({ isOpen, onClose, course, onPaymentSuccess }) => {
    const { user } = useAuth();
    const [step, setStep] = useState('billing'); // 'billing', 'processing', 'success'
    const [method, setMethod] = useState('card'); // 'card', 'upi', 'netbanking'
    const [cardData, setCardData] = useState({ number: '', expiry: '', cvc: '', name: '' });
    const [upiId, setUpiId] = useState('');
    const [selectedBank, setSelectedBank] = useState('');
    const [mobile, setMobile] = useState('');
    const [transactionId, setTransactionId] = useState('');

    if (!isOpen || !course) return null;

    const handlePayment = () => {
        if (!mobile || mobile.length < 10) {
            alert('Please enter a valid 10-digit mobile number.');
            return;
        }

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

        const newTxnId = 'TXN' + Math.floor(Math.random() * 90000000) + 10000000;
        setTransactionId(newTxnId);
        setStep('processing');
        // Simulate network delay
        setTimeout(() => {
            setStep('success');
            // Removed automatic close to allow user to download PDF
        }, 2000);
    };

    const handleDownloadPDF = () => {
        const receiptWindow = window.open('', '_blank');
        const studentName = user?.name || cardData.name || 'Student';
        const studentEmail = user?.email || 'N/A';
        const paymentDetail = method === 'card' ? `ending in ${cardData.number.slice(-4) || 'XXXX'}` : method === 'upi' ? upiId : selectedBank;
        
        receiptWindow.document.write(`
            <html>
                <head>
                    <title>Payment Receipt - ${transactionId}</title>
                    <style>
                        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 50px; color: #1e293b; max-width: 800px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; margin-top: 40px; }
                        .header { border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; text-align: center; }
                        h1 { color: #4f46e5; margin-bottom: 5px; }
                        .details { margin-top: 30px; line-height: 2; font-size: 1.1rem; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                        .total { grid-column: 1 / -1; font-size: 1.6rem; font-weight: 800; margin-top: 30px; color: #10b981; padding: 20px; background: #f8fafc; border-radius: 10px; text-align: center; border: 1px dashed #cbd5e1; }
                        .footer { margin-top: 50px; text-align: center; font-size: 0.9rem; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 20px; }
                        .detail-group p { margin: 5px 0; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>Coding Classes Pvt. Ltd.</h1>
                        <p>Official Payment Receipt (Tax Invoice)</p>
                    </div>
                    <div class="details">
                        <div class="detail-group">
                            <h3 style="color: #64748b; font-size: 0.9rem; text-transform: uppercase;">Student Details</h3>
                            <p><strong>Name:</strong> ${studentName}</p>
                            <p><strong>Email:</strong> ${studentEmail}</p>
                            <p><strong>Mobile No:</strong> +91 ${mobile}</p>
                        </div>
                        <div class="detail-group">
                            <h3 style="color: #64748b; font-size: 0.9rem; text-transform: uppercase;">Transaction Details</h3>
                            <p><strong>Date/Time:</strong> ${new Date().toLocaleString()}</p>
                            <p><strong>Transaction ID:</strong> ${transactionId}</p>
                            <p><strong>Method:</strong> ${method.toUpperCase()} (${paymentDetail})</p>
                        </div>
                        
                        <div class="total">
                            Course Enrolled: ${course.title}<br/>
                            <span style="font-size: 1.2rem; color: #64748b;">Total Paid: </span> ₹${course.price}.00
                        </div>
                    </div>
                    <div class="footer">
                        Organization: Coding Classes Pvt. Ltd. | Contact: support@codingclasses.com<br/>
                        This is an electronically generated receipt and does not require a physical signature.
                    </div>
                    <script>
                        window.onload = () => { 
                            setTimeout(() => {
                                window.print(); 
                                window.close(); 
                            }, 500);
                        }
                    </script>
                </body>
            </html>
        `);
        receiptWindow.document.close();
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
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
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

                        {/* Mobile Number Generic Input */}
                        <div style={{ marginBottom: '20px' }}>
                            <input 
                                className="input-field" 
                                placeholder="Billing Mobile Number (Required)" 
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                                maxLength="10"
                                required
                            />
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
                    <div style={{ textAlign: 'center', padding: '30px 0' }} className="fade-in">
                        <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--success)', marginBottom: '20px' }}>
                            <CheckCircle size={70} />
                        </div>
                        <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '10px' }}>Payment Successful!</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>Welcome aboard! Your course access is now active.</p>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
                            <button 
                                onClick={handleDownloadPDF}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    background: 'var(--bg-secondary)',
                                    color: 'var(--text-primary)',
                                    border: '1px solid var(--border)',
                                    padding: '12px 24px',
                                    borderRadius: '12px',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
                                }}
                                onMouseEnter={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                                onMouseLeave={(e) => e.target.style.borderColor = 'var(--border)'}
                            >
                                <Download size={18} /> Download Receipt (PDF)
                            </button>

                            <button 
                                onClick={() => onPaymentSuccess(course._id)}
                                className="btn btn-primary"
                                style={{ width: '100%', padding: '16px', fontSize: '1.1rem', marginTop: '10px' }}
                            >
                                Continue to Course <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CheckoutModal;
