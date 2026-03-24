/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import API, { ASSET_URL } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, BookOpen, Clock, Heart, Award, ArrowRight, Video, User as UserIcon, Briefcase, Mail, Phone, Github, Linkedin, Twitter, Save, Edit3, X, CheckCircle, Star, Loader2, Image as ImageIcon, Lock, ShieldCheck, AlertCircle, TrendingUp, Code, Activity } from 'lucide-react';

const Profile = () => {
    const { user, token, updateProfile, toggleFavorite, changePassword, setUser } = useAuth();
    const location = useLocation();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});
    const [saveLoading, setSaveLoading] = useState(false);
    const [avatarLoading, setAvatarLoading] = useState(false);
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
    const [avatarUrlInput, setAvatarUrlInput] = useState('');
    const [upcomingClasses, setUpcomingClasses] = useState([]);
    const [feedback, setFeedback] = useState({ rating: 5, message: '' });
    const [feedbackSent, setFeedbackSent] = useState(false);
    const [allCourses, setAllCourses] = useState([]);
    const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
    const [passLoading, setPassLoading] = useState(false);
    const [passError, setPassError] = useState('');
    const [passSuccess, setPassSuccess] = useState(false);

    const presetAvatars = [
        "https://cdn-icons-png.flaticon.com/128/4140/4140048.png",
        "https://cdn-icons-png.flaticon.com/128/4140/4140047.png",
        "https://cdn-icons-png.flaticon.com/128/4140/4140051.png",
        "https://cdn-icons-png.flaticon.com/128/1154/1154416.png",
        "https://cdn-icons-png.flaticon.com/128/1154/1154446.png",
        "https://cdn-icons-png.flaticon.com/128/1154/1154457.png",
        "https://cdn-icons-png.flaticon.com/128/1154/1154471.png",
        "https://cdn-icons-png.flaticon.com/128/1154/1154483.png"
    ];

    const isSecurityView = location.hash === '#security';
    const isCoursesView = location.hash === '#my-courses';

    useEffect(() => {
        const fetchProfileData = async () => {
            setLoading(true);
            try {
                const profileRes = await API.get('/users/profile');
                const data = profileRes.data;
                setProfileData(data);
                setEditData({
                    name: data.name,
                    bio: data.bio || '',
                    occupation: data.occupation || '',
                    phoneNumber: data.phoneNumber || '',
                    skills: data.skills?.join(', ') || '',
                    socials: {
                        github: data.socials?.github || '',
                        linkedin: data.socials?.linkedin || '',
                        twitter: data.socials?.twitter || ''
                    }
                });
            } catch (error) {
                console.error('Error fetching profile data');
            } finally {
                setLoading(false);
            }
        };

        const fetchUpcomingClasses = async () => {
            try {
                const classesRes = await API.get('/content?type=class');
                setUpcomingClasses(classesRes.data.slice(0, 5));
            } catch (error) {
                console.error('Error fetching classes');
            }
        };

        const fetchAllCourses = async () => {
            try {
                const { data } = await API.get('/courses');
                setAllCourses(data);
            } catch (error) {
                console.error('Error fetching all courses');
            }
        };

        if (token) {
            fetchProfileData();
            fetchUpcomingClasses();
            fetchAllCourses();
        }
    }, [token]);

    const handleSave = async () => {
        setSaveLoading(true);
        try {
            const formattedData = {
                ...editData,
                skills: typeof editData.skills === 'string' ? editData.skills.split(',').map(s => s.trim()).filter(s => s !== '') : editData.skills
            };
            await updateProfile(formattedData);
            setProfileData(prev => ({ ...prev, ...formattedData }));
            setIsEditing(false);
        } catch (error) {
            alert(error);
        } finally {
            setSaveLoading(false);
        }
    };

    const handleAvatarSelect = async (url) => {
        setAvatarLoading(true);
        try {
            await API.put('/users/profile', { avatar: url });
            setProfileData(prev => ({ ...prev, avatar: url }));
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const updatedUserInfo = { ...userInfo, avatar: url };
            localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
            setUser(updatedUserInfo);
        } catch (error) {
            alert('Failed to update avatar');
        } finally {
            setAvatarLoading(false);
        }
    };

    // Password Policy Logic
    const validatePassword = (pwd) => {
        const hasSeq = /12345|23456|34567|45678|56789|abcde|bcdef/.test(pwd.toLowerCase());
        const isLen = pwd.length >= 8;
        const hasUpper = /[A-Z]/.test(pwd);
        const hasLower = /[a-z]/.test(pwd);
        const hasNum = /[0-9]/.test(pwd);
        const specCount = (pwd.match(/[^A-Za-z0-9]/g) || []).length;
        const hasTwoSpec = specCount >= 2;
        const hasIllegal = /[<>#;]/.test(pwd);
        const hasRepeats = /(.)\1\1/.test(pwd);
        const namePart = profileData?.name?.split(' ')[0]?.toLowerCase();
        const hasPersonal = namePart && pwd.toLowerCase().includes(namePart);
        const hasLPU = pwd.toLowerCase().includes('lpu@12345');

        return {
            seq: !hasSeq,
            len: isLen,
            upper: hasUpper,
            lower: hasLower,
            num: hasNum,
            twoSpec: hasTwoSpec,
            illegal: !hasIllegal,
            repeats: !hasRepeats,
            personal: !hasPersonal,
            lpu: !hasLPU,
            match: passwords.next === passwords.confirm && passwords.next !== '',
            unique: passwords.next !== passwords.current && passwords.current !== ''
        };
    };

    const policyResults = validatePassword(passwords.next);

    const handleSubmitPassword = async (e) => {
        e.preventDefault();
        setPassError('');
        setPassSuccess(false);

        const results = validatePassword(passwords.next);
        const allValid = Object.values(results).every(v => v === true);

        if (!allValid) {
            setPassError('Password does not meet all security guidelines');
            return;
        }

        setPassLoading(true);
        try {
            await changePassword({
                currentPassword: passwords.current,
                newPassword: passwords.next
            });
            setPassSuccess(true);
            setPasswords({ current: '', next: '', confirm: '' });
        } catch (error) {
            setPassError(error || 'Failed to update password');
        } finally {
            setPassLoading(false);
        }
    };

    const handleAvatarUpload = async (file) => {
        if (!file) return;
        setAvatarLoading(true);
        const formData = new FormData();
        formData.append('avatar', file);

        try {
            const { data } = await API.post('/users/upload-avatar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setProfileData(prev => ({ ...prev, avatar: data.avatar }));
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const updatedUserInfo = { ...userInfo, avatar: data.avatar };
            localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
            setUser(updatedUserInfo);
        } catch (error) {
            alert('Avatar upload failed');
        } finally {
            setAvatarLoading(false);
        }
    };

    if (loading) return <div className="container section-padding">Loading...</div>;
    if (!profileData) return <div className="container section-padding">Please Login</div>;

    const enrolledStandard = profileData.enrolledCourses?.filter(c => !c.isBatch) || [];
    const enrolledBatches = profileData.enrolledCourses?.filter(c => c.isBatch) || [];

    return (
        <div className="bg-[var(--bg-primary)] min-h-screen w-full">
            <div className="container section-padding fade-in">
                
                {isSecurityView ? (
                    <div style={{ maxWidth: '1100px', margin: '40px auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
                            <div style={{ background: '#f59e0b20', color: '#f59e0b', width: '60px', height: '60px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Lock size={32} />
                            </div>
                            <div>
                                <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-primary)' }}>Change Password</h1>
                                <p style={{ color: 'var(--text-secondary)' }}>Update your account's security credentials with enhanced policies.</p>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'start' }}>
                            <div className="glass-card" style={{ padding: '40px', background: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
                                <form onSubmit={handleSubmitPassword}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', marginBottom: '35px' }}>
                                        <div>
                                            <label style={{ display: 'block', fontWeight: '800', fontSize: '0.9rem', marginBottom: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Old Password</label>
                                            <input type="password" className="input-field" value={passwords.current} onChange={e => setPasswords({...passwords, current: e.target.value})} required placeholder="Enter current password" />
                                        </div>
                                        <hr style={{ border: 'none', height: '1px', background: 'var(--border)' }} />
                                        <div>
                                            <label style={{ display: 'block', fontWeight: '800', fontSize: '0.9rem', marginBottom: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>New Password</label>
                                            <input type="password" className="input-field" value={passwords.next} onChange={e => setPasswords({...passwords, next: e.target.value})} required placeholder="Enter new password" />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontWeight: '800', fontSize: '0.9rem', marginBottom: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Confirm New Password</label>
                                            <input type="password" className="input-field" value={passwords.confirm} onChange={e => setPasswords({...passwords, confirm: e.target.value})} required placeholder="Confirm new password" />
                                        </div>
                                    </div>

                                    {passError && <div style={{ color: '#ef4444', marginBottom: '20px', fontWeight: '600', background: '#fef2f2', padding: '15px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}><AlertCircle size={18} /> {passError}</div>}
                                    {passSuccess && <div style={{ color: '#10b981', marginBottom: '20px', fontWeight: '600', background: '#f0fdf4', padding: '15px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle size={18} /> Password updated successfully!</div>}

                                    <div style={{ display: 'flex', gap: '15px' }}>
                                        <button type="submit" disabled={passLoading} className="btn btn-primary" style={{ background: '#f59e0b', padding: '16px 40px', flex: 1 }}>
                                            {passLoading ? 'Updating...' : 'Update Password'}
                                        </button>
                                        <Link to="/profile" className="btn" style={{ padding: '16px 40px', background: 'var(--bg-accent)', flex: 1, textAlign: 'center', textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            Cancel
                                        </Link>
                                    </div>
                                </form>
                            </div>

                            <div className="glass-card" style={{ padding: '30px', background: 'var(--bg-primary)', border: '1px solid var(--border)', fontSize: '0.85rem' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: '900', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <ShieldCheck size={22} color="#f59e0b" /> Password Policies:
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {[
                                        { label: "Must be at least 8 characters long.", valid: policyResults.len },
                                        { label: "Password and Confirm Password must be the same.", valid: policyResults.match },
                                        { label: "At least one uppercase and one lowercase letter.", valid: policyResults.upper && policyResults.lower },
                                        { label: "At least one numeric digit and two special characters.", valid: policyResults.num && policyResults.twoSpec },
                                        { label: "Illegal characters <, >, # and ; are not allowed.", valid: policyResults.illegal },
                                        { label: "No sequences (e.g., 12345 or abcde).", valid: policyResults.seq },
                                        { label: "No repeated series (e.g., AAA).", valid: policyResults.repeats },
                                        { label: "No guessable patterns (NAME@12345, Coding@12345, etc).", valid: policyResults.personal && policyResults.lpu },
                                        { label: "New and Old Password should not be the same.", valid: policyResults.unique }
                                    ].map((policy, idx) => (
                                        <div key={idx} style={{ 
                                            display: 'flex', 
                                            gap: '12px', 
                                            color: policy.valid ? 'var(--success)' : 'var(--text-secondary)',
                                            background: policy.valid ? '#10b98110' : 'transparent',
                                            padding: '10px',
                                            borderRadius: '8px',
                                            fontWeight: policy.valid ? '700' : '500',
                                            transition: 'all 0.2s'
                                        }}>
                                            <div style={{ marginTop: '2px' }}>
                                                {policy.valid ? <CheckCircle size={16} fill="#10b981" color="white" /> : <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid var(--border)' }} />}
                                            </div>
                                            <span>{policy.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : isCoursesView ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '80px', padding: '20px 0' }}>
                        <div>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '10px' }}>Master Your Curriculum 🚀</h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>All your enrolled cohorts and ongoing engineering drafts in one place.</p>
                        </div>
                        <div>
                             <h2 style={{ fontSize: '2.2rem', fontWeight: '900', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <Video size={32} color="var(--accent-primary)" /> My Enrolled Batches
                             </h2>
                             {enrolledBatches.length > 0 ? (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '30px' }}>
                                    {enrolledBatches.map(batch => (
                                        <div key={batch._id} className="glass-card fade-in" style={{ padding: '25px', display: 'flex', gap: '20px', alignItems: 'center', borderLeft: '6px solid var(--accent-primary)', background: 'var(--bg-primary)' }}>
                                            <img src={batch.thumbnail} style={{ width: '110px', height: '110px', borderRadius: '18px', objectFit: 'cover', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }} />
                                            <div style={{ flex: 1 }}>
                                                <h3 style={{ fontSize: '1.3rem', marginBottom: '12px', fontWeight: '800' }}>{batch.title}</h3>
                                                <Link to={`/lessons/${batch._id}/0`}>
                                                    <button className="btn" style={{ background: 'var(--bg-accent)', fontSize: '0.9rem', padding: '12px 25px', borderRadius: '12px', fontWeight: '700' }}>Continue Working</button>
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                             ) : (
                                <div className="glass-card" style={{ padding: '80px 40px', textAlign: 'center', background: 'var(--bg-accent)', borderRadius: '32px' }}>
                                    <Activity size={48} color="var(--text-secondary)" style={{ marginBottom: '20px', opacity: 0.5 }} />
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>No Active Batches Yet</h3>
                                    <p style={{ color: 'var(--text-secondary)' }}>You haven't enrolled in any cohorts. Start your journey below!</p>
                                </div>
                             )}
                        </div>

                        {enrolledStandard.length > 0 && (
                            <div>
                                <h2 style={{ fontSize: '2.2rem', fontWeight: '900', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <BookOpen size={32} color="#10b981" /> Individual Courses
                                </h2>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '30px' }}>
                                    {enrolledStandard.map(course => (
                                        <div key={course._id} className="glass-card fade-in" style={{ padding: '25px', display: 'flex', gap: '20px', alignItems: 'center', borderLeft: '6px solid #10b981', background: 'var(--bg-primary)' }}>
                                            <img src={course.thumbnail} style={{ width: '110px', height: '110px', borderRadius: '18px', objectFit: 'cover', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }} />
                                            <div style={{ flex: 1 }}>
                                                <h3 style={{ fontSize: '1.3rem', marginBottom: '12px', fontWeight: '800' }}>{course.title}</h3>
                                                <Link to={`/courses/${course._id}`}>
                                                    <button className="btn" style={{ background: 'var(--bg-accent)', fontSize: '0.9rem', padding: '12px 25px', borderRadius: '12px', fontWeight: '700' }}>View Content</button>
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : isEditing ? (
                    /* Edit Profile Mode */
                    <div className="glass-card" style={{ padding: '40px' }}>
                        <h2 style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '12px' }}><Edit3 size={24} /> Edit Your Profile</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                             <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Full Name</label>
                                    <input type="text" className="input-field" value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} placeholder="e.g. Ravi Kumar" />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Occupation</label>
                                    <input type="text" className="input-field" value={editData.occupation} onChange={e => setEditData({...editData, occupation: e.target.value})} placeholder="e.g. Senior Software Engineer" />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Bio</label>
                                    <textarea className="input-field" style={{ minHeight: '120px' }} value={editData.bio} onChange={e => setEditData({...editData, bio: e.target.value})} placeholder="Tell us about your technical journey..." />
                                </div>
                            </div>
                             <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Skills (Comma Separated)</label>
                                    <input type="text" className="input-field" value={editData.skills} onChange={e => setEditData({...editData, skills: e.target.value})} placeholder="e.g. React, Node.js, Python" />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Phone Number</label>
                                    <input type="text" className="input-field" value={editData.phoneNumber} onChange={e => setEditData({...editData, phoneNumber: e.target.value})} placeholder="e.g. +91 9876543210" />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>GitHub</label>
                                        <input type="text" className="input-field" value={editData.socials?.github} onChange={e => setEditData({...editData, socials: {...editData.socials, github: e.target.value}})} placeholder="github.com/username" />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>LinkedIn</label>
                                        <input type="text" className="input-field" value={editData.socials?.linkedin} onChange={e => setEditData({...editData, socials: {...editData.socials, linkedin: e.target.value}})} placeholder="linkedin.com/in/username" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '15px', marginTop: '40px' }}>
                            <button disabled={saveLoading} onClick={handleSave} className="btn btn-primary" style={{ flex: 1, padding: '15px' }}>
                                {saveLoading ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button onClick={() => setIsEditing(false)} className="btn" style={{ flex: 1, padding: '15px', background: 'var(--bg-accent)' }}>
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Default Dashboard / Profile View */
                    <>
                        {/* Premium Full Profile Hero */}
                        <div style={{ position: 'relative', marginBottom: '60px' }}>
                            <div className="glass-card" style={{ padding: '60px 40px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(67, 56, 202, 0.1) 100%)', border: '1px solid var(--border)', borderRadius: '32px', textAlign: 'center', overflow: 'hidden' }}>
                                <div style={{ position: 'absolute', top: '30px', left: '40px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <img src="/logo_dark.png" style={{ width: '32px', height: '32px', borderRadius: '8px', opacity: 0.8 }} alt="C-C" />
                                    <span style={{ fontSize: '0.8rem', fontWeight: '900', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.8 }}>Coding Classes</span>
                                </div>
                                <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', background: 'var(--accent-primary)', opacity: 0.1, filter: 'blur(100px)', zIndex: -1 }}></div>
                                <div style={{ position: 'absolute', bottom: '-100px', left: '-100px', width: '300px', height: '300px', background: 'var(--success)', opacity: 0.1, filter: 'blur(100px)', zIndex: -1 }}></div>

                                <div 
                                    style={{ position: 'relative', width: '180px', height: '180px', margin: '0 auto 30px', cursor: 'pointer' }}
                                    onClick={() => setIsAvatarModalOpen(true)}
                                >
                                    <img 
                                        src={(() => {
                                            if (!profileData.avatar) return "https://cdn-icons-png.flaticon.com/128/3177/3177440.png";
                                            let url = profileData.avatar;
                                            // Transform Google Drive links to direct view
                                            if (url.includes('drive.google.com')) {
                                                const id = url.split('/d/')[1]?.split('/')[0] || url.split('id=')[1]?.split('&')[0];
                                                if (id) return `https://lh3.googleusercontent.com/d/${id}`;
                                            }
                                            if (url.startsWith('http')) return url;
                                            // Handle relative paths and avoid double uploads
                                            const cleanPath = url.replace(/^\/?uploads\/?/, '');
                                            return `${ASSET_URL}${cleanPath}`;
                                        })()} 
                                        style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '8px solid var(--bg-primary)', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.2)' }} 
                                        alt={profileData.name} 
                                    />
                                    <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'var(--accent-primary)', color: 'white', padding: '10px', borderRadius: '50%', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                                        <Edit3 size={20} />
                                    </div>
                                </div>

                                <h1 style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '10px' }}>{profileData.name}</h1>
                                <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '30px', fontWeight: '600' }}>{profileData.occupation || 'Platform Resident Engineer'}</p>

                                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
                                    <div style={{ background: 'var(--bg-primary)', padding: '12px 25px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid var(--border)' }}>
                                        <Award size={20} color="var(--accent-primary)" />
                                        <span style={{ fontWeight: '800' }}>#{profileData.registrationNumber || '2024'}</span>
                                    </div>
                                    <div style={{ background: 'var(--bg-primary)', padding: '12px 25px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid var(--border)' }}>
                                        <CheckCircle size={20} color="var(--success)" />
                                        <span style={{ fontWeight: '800' }}>Level {profileData.enrolledCourses?.length || 0}</span>
                                    </div>
                                    <div style={{ background: 'var(--bg-primary)', padding: '12px 25px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid var(--border)' }}>
                                        <TrendingUp size={20} color="#f59e0b" />
                                        <span style={{ fontWeight: '800' }}>{Object.keys(profileData.progress || {}).length} Actives</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Profile Details Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 1fr) 1.5fr', gap: '50px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                                <div className="glass-card" style={{ padding: '40px' }}>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <Mail size={24} color="var(--accent-primary)" /> Contact Details
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                        <div style={{ display: 'flex', gap: '15px' }}>
                                            <div style={{ width: '40px', height: '40px', background: 'var(--bg-accent)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}><Mail size={18}/></div>
                                            <div>
                                                <p style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Email Address</p>
                                                <p style={{ fontWeight: '700' }}>{profileData.email}</p>
                                            </div>
                                        </div>
                                        {profileData.phoneNumber && (
                                            <div style={{ display: 'flex', gap: '15px' }}>
                                                <div style={{ width: '40px', height: '40px', background: 'var(--bg-accent)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}><Phone size={18}/></div>
                                                <div>
                                                    <p style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Phone Number</p>
                                                    <p style={{ fontWeight: '700' }}>{profileData.phoneNumber}</p>
                                                </div>
                                            </div>
                                        )}
                                        <div style={{ display: 'flex', gap: '15px' }}>
                                            <div style={{ width: '40px', height: '40px', background: 'var(--bg-accent)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}><Clock size={18}/></div>
                                            <div>
                                                <p style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Member Since</p>
                                                <p style={{ fontWeight: '700' }}>March 2024</p>
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={() => setIsEditing(true)} className="btn btn-primary" style={{ width: '100%', marginTop: '40px', background: 'var(--accent-primary)', padding: '14px' }}>Update Profile Info</button>
                                </div>

                                <div className="glass-card" style={{ padding: '40px' }}>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <TrendingUp size={24} color="#10b981" /> Engineering Skills
                                    </h3>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                        {(profileData.skills || ['Full-Stack', 'Data Structures', 'System Design']).map(skill => (
                                            <span key={skill} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'var(--bg-accent)', borderRadius: '14px', fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                                                <Code size={16} color="var(--accent-primary)" /> {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="glass-card" style={{ padding: '40px' }}>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <BookOpen size={24} color="var(--accent-primary)" /> Professional Biography
                                </h3>
                                <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '40px' }}>
                                    {profileData.bio || "You haven't written a biography yet! Tell the platform about your technical background, specializations, and engineering goals."}
                                </p>
                                
                                <h3 style={{ fontSize: '1.3rem', fontWeight: '900', marginBottom: '20px' }}>Academic Progress</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    <div style={{ background: 'var(--bg-accent)', padding: '25px', borderRadius: '24px', border: '1px solid var(--border)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                            <span style={{ fontWeight: '800' }}>Overall Curriculum Mastery</span>
                                            <span style={{ color: 'var(--accent-primary)', fontWeight: '900' }}>{Math.min(100, (profileData.enrolledCourses?.length || 0) * 15)}%</span>
                                        </div>
                                        <div style={{ height: '12px', background: 'var(--bg-primary)', borderRadius: '6px', overflow: 'hidden' }}>
                                            <div style={{ height: '100%', background: 'linear-gradient(to right, var(--accent-primary), #4338ca)', width: `${Math.min(100, (profileData.enrolledCourses?.length || 0) * 15)}%`, borderRadius: '6px' }}></div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                        <div className="glass-card" style={{ padding: '20px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid #10b98130' }}>
                                            <p style={{ fontSize: '0.8rem', fontWeight: '900', color: '#059669', textTransform: 'uppercase', marginBottom: '5px' }}>Batch Status</p>
                                            <p style={{ fontSize: '1.2rem', fontWeight: '900' }}>Active Resident</p>
                                        </div>
                                        <div className="glass-card" style={{ padding: '20px', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid #f59e0b30' }}>
                                            <p style={{ fontSize: '0.8rem', fontWeight: '900', color: '#d97706', textTransform: 'uppercase', marginBottom: '5px' }}>Project Rank</p>
                                            <p style={{ fontSize: '1.2rem', fontWeight: '900' }}>Senior Builder</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Merged: My Enrolled Batches (ONLY FOR STUDENTS) */}
                        {profileData.role === 'student' && (
                            <div style={{ marginTop: '80px', display: 'flex', flexDirection: 'column', gap: '60px' }}>
                                 <div>
                                    <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '35px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <Video size={36} color="var(--accent-primary)" /> My Enrolled Batches
                                    </h2>
                                    {enrolledBatches.length > 0 ? (
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '30px' }}>
                                            {enrolledBatches.map(batch => (
                                                <div key={batch._id} className="glass-card fade-in" style={{ padding: '25px', display: 'flex', gap: '20px', alignItems: 'center', borderLeft: '6px solid var(--accent-primary)', background: 'var(--bg-primary)' }}>
                                                    <img src={batch.thumbnail} style={{ width: '110px', height: '110px', borderRadius: '18px', objectFit: 'cover', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }} />
                                                    <div style={{ flex: 1 }}>
                                                        <h3 style={{ fontSize: '1.3rem', marginBottom: '12px', fontWeight: '800' }}>{batch.title}</h3>
                                                        <Link to={`/lessons/${batch._id}/0`}>
                                                            <button className="btn" style={{ background: 'var(--bg-accent)', fontSize: '0.9rem', padding: '12px 25px', borderRadius: '12px', fontWeight: '700' }}>Continue Working</button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="glass-card" style={{ padding: '60px 40px', textAlign: 'center', background: 'var(--bg-accent)', borderRadius: '32px' }}>
                                            <Activity size={48} color="var(--text-secondary)" style={{ marginBottom: '20px', opacity: 0.5 }} />
                                            <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>No Active Batches</h3>
                                            <p style={{ color: 'var(--text-secondary)' }}>You are not currently enrolled in any cohorts.</p>
                                        </div>
                                    )}
                                 </div>

                                 {enrolledStandard.length > 0 && (
                                     <div>
                                        <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '35px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                            <BookOpen size={36} color="#10b981" /> Individual Courses
                                        </h2>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '30px' }}>
                                            {enrolledStandard.map(course => (
                                                <div key={course._id} className="glass-card fade-in" style={{ padding: '25px', display: 'flex', gap: '20px', alignItems: 'center', borderLeft: '6px solid #10b981', background: 'var(--bg-primary)' }}>
                                                    <img src={course.thumbnail} style={{ width: '110px', height: '110px', borderRadius: '18px', objectFit: 'cover', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }} />
                                                    <div style={{ flex: 1 }}>
                                                        <h3 style={{ fontSize: '1.3rem', marginBottom: '12px', fontWeight: '800' }}>{course.title}</h3>
                                                        <Link to={`/courses/${course._id}`}>
                                                            <button className="btn" style={{ background: 'var(--bg-accent)', fontSize: '0.9rem', padding: '12px 25px', borderRadius: '12px', fontWeight: '700' }}>View Content</button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                     </div>
                                 )}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Avatar Modal */}
            {isAvatarModalOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setIsAvatarModalOpen(false)}>
                    <div className="glass-card" style={{ maxWidth: '600px', width: '100%', padding: '40px', background: 'var(--bg-primary)', position: 'relative' }} onClick={e => e.stopPropagation()}>
                        <button style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setIsAvatarModalOpen(false)}><X /></button>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: '900', marginBottom: '10px' }}>Choose Profile Picture</h2>
                        {/* Live Preview */}
                        {avatarUrlInput.length > 5 && (
                            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                                <p style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '10px' }}>Preview</p>
                                <img 
                                    src={(() => {
                                        let url = avatarUrlInput;
                                        if (url.includes('drive.google.com')) {
                                            const id = url.split('/d/')[1]?.split('/')[0] || url.split('id=')[1]?.split('&')[0];
                                            if (id) return `https://lh3.googleusercontent.com/d/${id}`;
                                        }
                                        return url;
                                    })()}
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                    onLoad={(e) => { e.target.style.display = 'inline-block'; }}
                                    style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--accent-primary)', display: 'none' }}
                                    alt="preview"
                                />
                            </div>
                        )}

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Add via Drive/Cloud Link</label>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input 
                                    className="input-field" 
                                    placeholder="Paste your photo URL here..." 
                                    style={{ flex: 1 }}
                                    value={avatarUrlInput}
                                    onChange={(e) => setAvatarUrlInput(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter' && avatarUrlInput) {
                                            handleAvatarSelect(avatarUrlInput);
                                            setIsAvatarModalOpen(false);
                                            setAvatarUrlInput('');
                                        }
                                    }}
                                />
                                <button 
                                    onClick={() => {
                                        if (avatarUrlInput) {
                                            handleAvatarSelect(avatarUrlInput);
                                            setIsAvatarModalOpen(false);
                                            setAvatarUrlInput('');
                                        }
                                    }}
                                    className="btn btn-primary" 
                                    style={{ padding: '0 20px', opacity: avatarUrlInput ? 1 : 0.5 }}
                                    disabled={!avatarUrlInput}
                                >
                                    Apply
                                </button>
                            </div>
                            <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '8px' }}>Paste a direct link from Google Drive, Dropbox, or any web host.</p>
                        </div>

                        <div style={{ position: 'relative', textAlign: 'center', marginBottom: '10px' }}>
                            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'var(--border)', zIndex: 0 }} />
                            <span style={{ position: 'relative', background: 'var(--bg-primary)', padding: '0 15px', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: '700', zIndex: 1 }}>OR</span>
                        </div>

                        <label className="btn btn-primary" style={{ padding: '16px 24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: 'var(--bg-accent)', color: 'var(--text-primary)', border: '1px solid var(--border)', marginTop: '20px' }}>
                            <ImageIcon size={18} /> Choose File from Computer
                            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => { handleAvatarUpload(e.target.files[0]); setIsAvatarModalOpen(false); setAvatarUrlInput(''); }} />
                        </label>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
