import React, { useEffect, useState } from 'react';
import API, { ASSET_URL } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { GraduationCap, BookOpen, Clock, Heart, Award, ArrowRight, Video, User as UserIcon, Briefcase, Mail, Phone, Github, Linkedin, Twitter, Save, Edit3, X, CheckCircle, Star, Loader2 } from 'lucide-react';

const Profile = () => {
    const { user, token, updateProfile, toggleFavorite, setUser } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});
    const [saveLoading, setSaveLoading] = useState(false);
    const [avatarLoading, setAvatarLoading] = useState(false);
    const [feedback, setFeedback] = useState({ rating: 5, message: '' });
    const [feedbackSent, setFeedbackSent] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await API.get('/users/profile');
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
                setLoading(false);
            } catch (error) {
                console.error('Error fetching profile');
                setLoading(false);
            }
        };
        if (token) fetchProfile();
    }, [token]);

    useEffect(() => {
        if (!loading && window.location.hash === '#favorites') {
            setTimeout(() => {
                const el = document.getElementById('favorites');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }, [loading]);

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

    const handleFeedbackSubmit = (e) => {
        e.preventDefault();
        // Mock feedback submission
        setFeedbackSent(true);
        setTimeout(() => setFeedbackSent(false), 3000);
        setFeedback({ rating: 5, message: '' });
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
            // Update local state and AuthContext
            setProfileData(prev => ({ ...prev, avatar: data.avatar }));
            // We need to update userInfo in localStorage so other pages reflect the change
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const updatedUserInfo = { ...userInfo, avatar: data.avatar };
            localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
            // Trigger global state update
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
        <div className="container section-padding fade-in">
            {/* Header Section */}
            <div className="glass-card" style={{ padding: '50px', marginBottom: '40px', textAlign: 'center', position: 'relative' }}>
                <button 
                    onClick={() => setIsEditing(!isEditing)}
                    style={{ position: 'absolute', top: '20px', right: '20px', background: 'var(--bg-accent)', border: 'none', padding: '10px 20px', borderRadius: '12px', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}
                >
                    {isEditing ? <><X size={18} /> Cancel</> : <><Edit3 size={18} /> Edit Profile</>}
                </button>

                <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 20px', cursor: 'pointer' }} className="avatar-container">
                    <label style={{ cursor: 'pointer' }}>
                        <img 
                            src={profileData.avatar.startsWith('http') ? profileData.avatar : `${ASSET_URL}${profileData.avatar}`} 
                            style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid var(--accent-primary)', objectFit: 'cover', opacity: avatarLoading ? 0.5 : 1 }} 
                            alt="avatar" 
                        />
                        <div className="avatar-overlay" style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', opacity: 0, transition: 'opacity 0.3s' }}>
                            {avatarLoading ? <Loader2 className="spin" /> : <Edit3 size={20} />}
                        </div>
                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleAvatarUpload(e.target.files[0])} disabled={avatarLoading} />
                    </label>
                </div>

                <style>{`
                    .avatar-container:hover .avatar-overlay { opacity: 1 !important; }
                `}</style>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800' }}>{profileData.name}</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '15px' }}>Coding Classes Engineering Fellow • {profileData.role.toUpperCase()}</p>
                
                {profileData.occupation && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: 'var(--accent-primary)', fontWeight: '700' }}>
                        <Briefcase size={18} /> {profileData.occupation}
                    </div>
                )}
            </div>

            {/* Main Content Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: isEditing ? '1fr' : '1.2fr 0.8fr', gap: '40px' }}>
                
                {isEditing ? (
                    /* Edit Form */
                    <div className="glass-card" style={{ padding: '40px' }}>
                        <h2 style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '12px' }}><Edit3 size={24} /> Edit Your Profile</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Full Name</label>
                                    <input type="text" className="input-field" value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Occupation</label>
                                    <input type="text" className="input-field" placeholder="e.g. Student, Software Intern" value={editData.occupation} onChange={e => setEditData({...editData, occupation: e.target.value})} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Phone Number</label>
                                    <input type="text" className="input-field" value={editData.phoneNumber} onChange={e => setEditData({...editData, phoneNumber: e.target.value})} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Bio</label>
                                    <textarea className="input-field" style={{ minHeight: '120px', padding: '15px' }} value={editData.bio} onChange={e => setEditData({...editData, bio: e.target.value})} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Skills (comma separated)</label>
                                    <input type="text" className="input-field" placeholder="React, Node.js, Python" value={editData.skills} onChange={e => setEditData({...editData, skills: e.target.value})} />
                                </div>
                                <div style={{ background: 'var(--bg-accent)', padding: '20px', borderRadius: '15px' }}>
                                    <h4 style={{ marginBottom: '15px' }}>Social Profiles</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <Github size={18} />
                                            <input type="text" className="input-field" placeholder="GitHub URL" value={editData.socials.github} onChange={e => setEditData({...editData, socials: {...editData.socials, github: e.target.value}})} />
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <Linkedin size={18} />
                                            <input type="text" className="input-field" placeholder="LinkedIn URL" value={editData.socials.linkedin} onChange={e => setEditData({...editData, socials: {...editData.socials, linkedin: e.target.value}})} />
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <Twitter size={18} />
                                            <input type="text" className="input-field" placeholder="Twitter URL" value={editData.socials.twitter} onChange={e => setEditData({...editData, socials: {...editData.socials, twitter: e.target.value}})} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button 
                            disabled={saveLoading}
                            onClick={handleSave}
                            className="btn btn-primary" 
                            style={{ marginTop: '40px', width: '200px', padding: '15px' }}
                        >
                            {saveLoading ? 'Saving...' : <><Save size={18}/> Save Profile</>}
                        </button>
                    </div>
                ) : (
                    /* View Mode */
                    <>
                        {/* Summary / Stats Column */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                            {/* Personal Details */}
                            <div className="glass-card" style={{ padding: '30px' }}>
                                <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}><UserIcon size={20} /> About Me</h3>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '25px', lineHeight: '1.6' }}>
                                    {profileData.bio || "No bio added yet. Tell us about your coding journey!"}
                                </p>
                                
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    {profileData.phoneNumber && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem' }}>
                                            <Phone size={16} color="var(--text-secondary)" /> {profileData.phoneNumber}
                                        </div>
                                    )}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem' }}>
                                        <Mail size={16} color="var(--text-secondary)" /> {profileData.email}
                                    </div>
                                </div>

                                {profileData.socials && (
                                    <div style={{ display: 'flex', gap: '15px', marginTop: '25px' }}>
                                        {profileData.socials.github && <a href={profileData.socials.github} target="_blank" rel="noreferrer" style={{ color: 'var(--text-primary)' }}><Github size={20} /></a>}
                                        {profileData.socials.linkedin && <a href={profileData.socials.linkedin} target="_blank" rel="noreferrer" style={{ color: 'var(--text-primary)' }}><Linkedin size={20} /></a>}
                                        {profileData.socials.twitter && <a href={profileData.socials.twitter} target="_blank" rel="noreferrer" style={{ color: 'var(--text-primary)' }}><Twitter size={20} /></a>}
                                    </div>
                                )}
                            </div>

                            {/* Skills */}
                            <div className="glass-card" style={{ padding: '30px' }}>
                                <h3 style={{ marginBottom: '20px' }}>Technical Skills</h3>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                    {profileData.skills?.length > 0 ? (
                                        profileData.skills.map((skill, idx) => (
                                            <span key={idx} style={{ background: 'var(--bg-accent)', padding: '6px 15px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600' }}>{skill}</span>
                                        ))
                                    ) : (
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Add your skills to show off your expertise!</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Learning Activities Column */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                            <div className="glass-card" style={{ padding: '30px' }}>
                                <h3 style={{ marginBottom: '20px', fontSize: '1.2rem' }}>Learning Stats</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                    <div style={{ background: 'var(--bg-accent)', padding: '15px', borderRadius: '15px', textAlign: 'center' }}>
                                        <h4 style={{ fontSize: '1.5rem', color: 'var(--accent-primary)' }}>{profileData.enrolledCourses?.length || 0}</h4>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Courses</p>
                                    </div>
                                    <div style={{ background: 'var(--bg-accent)', padding: '15px', borderRadius: '15px', textAlign: 'center' }}>
                                        <h4 style={{ fontSize: '1.5rem', color: 'var(--success)' }}>{Object.keys(profileData.progress || {}).length}</h4>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Active</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Feedback Form */}
                            <div className="glass-card" style={{ padding: '30px' }}>
                                <h3 style={{ marginBottom: '15px' }}>App Feedback</h3>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>Help us improve your learning experience.</p>
                                <form onSubmit={handleFeedbackSubmit}>
                                    <div style={{ display: 'flex', gap: '5px', marginBottom: '15px' }}>
                                        {[1,2,3,4,5].map(star => (
                                            <Star 
                                                key={star} 
                                                size={20} 
                                                style={{ cursor: 'pointer' }} 
                                                fill={feedback.rating >= star ? 'var(--accent-primary)' : 'none'} 
                                                color={feedback.rating >= star ? 'var(--accent-primary)' : 'var(--text-secondary)'}
                                                onClick={() => setFeedback({...feedback, rating: star})}
                                            />
                                        ))}
                                    </div>
                                    <textarea 
                                        className="input-field" 
                                        placeholder="Tell us what you think..." 
                                        style={{ minHeight: '80px', fontSize: '0.9rem', marginBottom: '15px', padding: '10px' }}
                                        value={feedback.message}
                                        onChange={e => setFeedback({...feedback, message: e.target.value})}
                                        required
                                    />
                                    <button className="btn" style={{ width: '100%', background: feedbackSent ? 'var(--success)' : 'var(--bg-accent)', color: feedbackSent ? 'white' : 'var(--text-primary)' }}>
                                        {feedbackSent ? <><CheckCircle size={18}/> Sent! Thank You</> : "Submit Feedback"}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {!isEditing && (
                <>
                    <hr style={{ border: 'none', height: '1px', background: 'var(--border)', margin: '60px 0' }} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                        {/* Column 1: Live Batches */}
                        <div>
                            <h2 style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}><Video size={24} /> My Live Batches</h2>
                            {enrolledBatches.length === 0 ? (
                                <div className="glass-card" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                    No active live batches. <Link to="/" style={{ color: 'var(--accent-primary)' }}>Find your batch</Link>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    {enrolledBatches.map(batch => (
                                        <div key={batch._id} className="glass-card" style={{ padding: '25px', display: 'flex', gap: '20px', alignItems: 'center' }}>
                                            <img src={batch.thumbnail} style={{ width: '100px', height: '100px', borderRadius: '12px', objectFit: 'cover' }} />
                                            <div style={{ flex: 1 }}>
                                                <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{batch.title}</h3>
                                                <p style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: '700', marginBottom: '10px' }}>
                                                    Live Startup: {new Date(batch.startDate).toLocaleDateString()}
                                                </p>
                                                <Link to={`/lessons/${batch._id}/0`} style={{ textDecoration: 'none' }}>
                                                    <button className="btn" style={{ background: 'var(--bg-accent)', fontSize: '0.85rem', padding: '8px 15px' }}>
                                                        Join Batch Class <ArrowRight size={16} />
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Column 2: Self-Paced Courses */}
                        <div>
                            <h2 style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}><GraduationCap size={24} /> Standard Courses</h2>
                            {enrolledStandard.length === 0 ? (
                                <div className="glass-card" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                    No active courses. <Link to="/courses" style={{ color: 'var(--accent-primary)' }}>Browse library</Link>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    {enrolledStandard.map(course => {
                                        const progressList = profileData.progress?.[course._id] || [];
                                        const totalLessons = course.lessons?.length || 1;
                                        const progress = Math.round((progressList.length / totalLessons) * 100);
                                        
                                        return (
                                            <div key={course._id} className="glass-card" style={{ padding: '25px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                                    <h3 style={{ fontSize: '1.1rem' }}>{course.title}</h3>
                                                    <span style={{ fontWeight: '700', color: 'var(--accent-primary)' }}>{progress}%</span>
                                                </div>
                                                <div style={{ background: 'var(--bg-accent)', height: '10px', borderRadius: '5px', overflow: 'hidden', marginBottom: '20px' }}>
                                                    <div style={{ height: '100%', background: 'var(--accent-primary)', width: `${progress}%`, transition: 'width 0.5s ease' }} />
                                                </div>
                                                <Link to={`/lessons/${course._id}/0`} style={{ textDecoration: 'none' }}>
                                                    <button className="btn btn-primary" style={{ width: '100%', padding: '10px' }}>
                                                        Resume Learning
                                                    </button>
                                                </Link>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Favorites Section */}
                    <div id="favorites" style={{ marginTop: '60px' }}>
                        <h2 style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}><Heart size={24} color="#ef4444" fill="#ef4444" /> Favorite Courses</h2>
                        {profileData.favorites?.length === 0 ? (
                            <p style={{ color: 'var(--text-secondary)' }}>Your watchlist is empty.</p>
                        ) : (
                            <div className="grid-courses">
                                {profileData.favorites.map(course => (
                                    <Link to={`/courses/${course._id}`} key={course._id} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <div className="glass-card" style={{ padding: '20px', position: 'relative' }}>
                                            <button 
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    toggleFavorite(course._id);
                                                    setProfileData(prev => ({
                                                        ...prev,
                                                        favorites: prev.favorites.filter(f => f._id !== course._id)
                                                    }));
                                                }}
                                                style={{ position: 'absolute', top: '15px', right: '15px', background: 'white', border: 'none', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                                            >
                                                <Heart size={16} color="#ef4444" fill="#ef4444" />
                                            </button>
                                            <img src={course.thumbnail} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '10px', marginBottom: '15px' }} />
                                            <h4 style={{ fontWeight: '700' }}>{course.title}</h4>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '5px' }}>{course.instructor}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default Profile;
