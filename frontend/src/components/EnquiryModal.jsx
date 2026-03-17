import React, { useState } from 'react';
import { X, Send, CheckCircle, MessageSquare, User, Mail, Phone, BookOpen } from 'lucide-react';
import API from '../services/api';

const EnquiryModal = ({ isOpen, onClose, courseTitle }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        course: courseTitle || '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await API.post('/enquiries', formData);
            setSubmitted(true);
            setTimeout(() => {
                setSubmitted(false);
                onClose();
            }, 3000);
        } catch (error) {
            console.error('Enquiry failed', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
            <div className="glass-card fade-in" style={{ width: '90%', maxWidth: '500px', padding: '40px', position: 'relative' }}>
                <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    <X size={24} />
                </button>

                {submitted ? (
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                        <div style={{ color: 'var(--success)', marginBottom: '20px' }}><CheckCircle size={60} /></div>
                        <h2>Enquiry Sent!</h2>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '10px' }}>Our admissions team will contact you shortly.</p>
                    </div>
                ) : (
                    <>
                        <h2 style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <MessageSquare size={28} color="var(--accent-primary)" /> Admissions Enquiry
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>Ready to start your journey? Fill out the form below.</p>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ position: 'relative' }}>
                                <User size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                <input 
                                    type="text" 
                                    placeholder="Full Name" 
                                    className="input-field" 
                                    style={{ paddingLeft: '45px' }} 
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                    required 
                                />
                            </div>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                <input 
                                    type="email" 
                                    placeholder="Email Address" 
                                    className="input-field" 
                                    style={{ paddingLeft: '45px' }} 
                                    value={formData.email}
                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                    required 
                                />
                            </div>
                            <div style={{ position: 'relative' }}>
                                <Phone size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                <input 
                                    type="text" 
                                    placeholder="Phone Number" 
                                    className="input-field" 
                                    style={{ paddingLeft: '45px' }} 
                                    value={formData.phone}
                                    onChange={e => setFormData({...formData, phone: e.target.value})}
                                />
                            </div>
                            <div style={{ position: 'relative' }}>
                                <BookOpen size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                <input 
                                    type="text" 
                                    placeholder="Course of Interest" 
                                    className="input-field" 
                                    style={{ paddingLeft: '45px' }} 
                                    value={formData.course}
                                    onChange={e => setFormData({...formData, course: e.target.value})}
                                />
                            </div>
                            <div>
                                <textarea 
                                    placeholder="Your Message / Questions" 
                                    className="input-field" 
                                    style={{ minHeight: '100px', padding: '15px' }} 
                                    value={formData.message}
                                    onChange={e => setFormData({...formData, message: e.target.value})}
                                    required
                                />
                            </div>

                            <button type="submit" className="btn btn-primary" style={{ padding: '16px', display: 'flex', justifyContent: 'center', gap: '10px' }} disabled={loading}>
                                {loading ? 'Sending...' : <><Send size={18} /> Submit Enquiry</>}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default EnquiryModal;
