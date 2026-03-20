import React from 'react';
import { Shield, Book, CreditCard, HelpCircle, CheckSquare } from 'lucide-react';

const TermsOfService = () => {
    return (
        <div className="container section-padding fade-in">
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <div style={{ display: 'inline-flex', background: 'var(--accent-primary)', color: 'white', padding: '15px', borderRadius: '20px', marginBottom: '20px' }}>
                        <Book size={40} />
                    </div>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: '900', marginBottom: '15px' }}>Terms of Service</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>Effective Date: March 19, 2026</p>
                </div>

                <div className="glass-card" style={{ padding: '40px', lineHeight: '1.8' }}>
                    <section style={{ marginBottom: '40px' }}>
                        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', color: 'var(--accent-primary)' }}>
                            <HelpCircle size={24} /> 1. Acceptance of Terms
                        </h2>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            By accessing or using the Coding Classes platform, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.
                        </p>
                    </section>

                    <section style={{ marginBottom: '40px' }}>
                        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', color: 'var(--accent-primary)' }}>
                            <Shield size={24} /> 2. User Accounts
                        </h2>
                        <ul style={{ marginLeft: '25px', color: 'var(--text-secondary)' }}>
                            <li>You are responsible for maintaining the confidentiality of your credentials.</li>
                            <li>You must be at least 13 years old to create an account.</li>
                            <li>You agree to provide accurate and complete information during registration.</li>
                            <li>Unauthorized use of another user's account is strictly prohibited.</li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: '40px' }}>
                        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', color: 'var(--accent-primary)' }}>
                            <Book size={24} /> 3. Course Access & Content
                        </h2>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            All course materials, videos, and articles are provided for your personal learning. You may not distribute, sell, or copy the content without explicit permission from Coding Classes.
                        </p>
                    </section>

                    <section style={{ marginBottom: '40px' }}>
                        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', color: 'var(--accent-primary)' }}>
                            <CreditCard size={24} /> 4. Payments and Refunds
                        </h2>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            Fees for paid courses and sessions are clearly stated before enrollment. Refunds are typically handled within 7 days of request if you haven't accessed more than 20% of the content.
                        </p>
                    </section>

                    <section>
                        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', color: 'var(--accent-primary)' }}>
                            <CheckSquare size={24} /> 5. Code of Conduct
                        </h2>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            Respectful behavior within our community, forums, and live classes is mandatory. Any harassment, spamming, or sharing of toxic content will result in immediate account termination.
                        </p>
                    </section>
                </div>

                <div style={{ marginTop: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    <p>© 2026 Coding Classes Engineering School. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
