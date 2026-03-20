import React from 'react';
import { Shield, Lock, Eye, FileText, CheckCircle } from 'lucide-react';

const PrivacyPolicy = () => {
    return (
        <div className="container section-padding fade-in">
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <div style={{ display: 'inline-flex', background: 'var(--accent-primary)', color: 'white', padding: '15px', borderRadius: '20px', marginBottom: '20px' }}>
                        <Shield size={40} />
                    </div>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: '900', marginBottom: '15px' }}>Privacy Policy</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>Last Updated: March 19, 2026</p>
                </div>

                <div className="glass-card" style={{ padding: '40px', lineHeight: '1.8' }}>
                    <section style={{ marginBottom: '40px' }}>
                        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', color: 'var(--accent-primary)' }}>
                            <Lock size={24} /> 1. Information We Collect
                        </h2>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            We collect information you provide directly to us when you create an account, enroll in courses, or communicate with us. This include:
                        </p>
                        <ul style={{ marginLeft: '25px', marginTop: '10px', color: 'var(--text-secondary)' }}>
                            <li>Name, email address, and password</li>
                            <li>Profile information (avatar, bio, skills)</li>
                            <li>Course progress and quiz submissions</li>
                            <li>Communication records with instructors</li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: '40px' }}>
                        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', color: 'var(--accent-primary)' }}>
                            <Eye size={24} /> 2. How We Use Your Data
                        </h2>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            Your information is used to provide the best possible learning experience:
                        </p>
                        <ul style={{ marginLeft: '25px', marginTop: '10px', color: 'var(--text-secondary)' }}>
                            <li>Personalizing your learning dashboard</li>
                            <li>Tracking course completion and certifications</li>
                            <li>Notifying you about new content or live classes</li>
                            <li>Improving platform performance and security</li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: '40px' }}>
                        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', color: 'var(--accent-primary)' }}>
                            <FileText size={24} /> 3. Data Protection
                        </h2>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            We implement industry-standard security measures to protect your personal data. All sensitive information (like passwords) is encrypted using advanced hashing algorithms. We do not sell your personal information to third parties.
                        </p>
                    </section>

                    <section>
                        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', color: 'var(--accent-primary)' }}>
                            <CheckCircle size={24} /> 4. Your Rights
                        </h2>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            You have the right to access, update, or delete your account information at any time through your profile settings. For any data-related inquiries, please contact our support team.
                        </p>
                    </section>
                </div>

                <div style={{ marginTop: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    <p>Contact us at <a href="mailto:privacy@codingclasses.com" style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>privacy@codingclasses.com</a> for any questions.</p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
