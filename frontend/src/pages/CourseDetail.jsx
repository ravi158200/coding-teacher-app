import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { Play, Clock, BookOpen, Heart, Award, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import CheckoutModal from '../components/CheckoutModal';

const CourseDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const { user, toggleFavorite, enrollInCourse } = useAuth();
    const [relatedContent, setRelatedContent] = useState([]);
    
    const isFavorite = user?.favorites?.some(f => (f._id || f) === id);
    const isEnrolled = user?.enrolledCourses?.some(e => (e._id || e) === id);
    const isAdmin = user?.role === 'admin' || user?.role === 'teacher';

    useEffect(() => {
        const fetchCourse = async () => {
            const { data } = await API.get(`/courses/${id}`);
            setCourse(data);
        };
        const fetchRelatedContent = async () => {
            try {
                const { data } = await API.get(`/content?course=${id}`);
                setRelatedContent(data);
            } catch (err) { console.error(err); }
        };
        fetchCourse();
        fetchRelatedContent();
    }, [id]);

    const handleEnroll = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        setIsCheckoutOpen(true);
    };

    const handlePaymentComplete = async (courseId) => {
        setIsCheckoutOpen(false);
        await enrollInCourse(courseId);
        navigate('/profile');
    };

    if (!course) return <div className="container section-padding">Loading...</div>;

    return (
        <div className="container section-padding fade-in">
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '50px' }}>
                {/* Left Column */}
                <div>
                    <span className="badge badge-primary">{course.category}</span>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: '800', margin: '20px 0' }}>{course.title}</h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '40px' }}>{course.description}</p>
                    
                    <div style={{ display: 'flex', gap: '40px', marginBottom: '60px' }}>
                        <div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Instructor</p>
                            <p style={{ fontWeight: '700' }}>{course.instructor}</p>
                        </div>
                        <div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Rating</p>
                            <p style={{ fontWeight: '700', display: 'flex', alignItems: 'center', gap: '5px' }}>4.9 Excellent</p>
                        </div>
                    </div>

                    <div className="glass-card" style={{ padding: '30px', marginBottom: '50px' }}>
                        <h2 style={{ marginBottom: '25px', fontSize: '1.5rem' }}>Course Content</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {course.lessons.map((lesson, idx) => (
                                <div key={idx} style={{ padding: '15px 20px', background: 'var(--bg-accent)', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <div style={{ background: 'var(--bg-primary)', padding: '8px', borderRadius: '10px' }}>
                                            <Play size={18} color="var(--accent-primary)" />
                                        </div>
                                        <span style={{ fontWeight: '600' }}>{idx + 1}. {lesson.title}</span>
                                    </div>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{lesson.duration}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {(isEnrolled || isAdmin) && relatedContent.length > 0 && (
                        <div className="glass-card fade-in" style={{ padding: '30px', marginBottom: '50px', borderLeft: '5px solid var(--accent-primary)', background: 'linear-gradient(to right, rgba(99, 102, 241, 0.05), transparent)' }}>
                            <h2 style={{ marginBottom: '25px', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>🔐 Batch Assets & Sessions</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {relatedContent.map(item => (
                                    <Link key={item._id} to={item.type === 'class' ? `/classroom/${item._id}` : `/content/${item._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <div style={{ padding: '16px 20px', background: 'var(--bg-accent)', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--border)', transition: 'all 0.2s ease' }} onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-primary)'} onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                <div style={{ background: item.type === 'class' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(99, 102, 241, 0.1)', padding: '10px', borderRadius: '12px', color: item.type === 'class' ? '#f59e0b' : '#6366f1' }}>
                                                    {item.type === 'class' ? <Clock size={20} /> : item.type === 'video' ? <Play size={20} /> : <BookOpen size={20} />}
                                                </div>
                                                <div>
                                                    <p style={{ fontWeight: '700', fontSize: '1rem' }}>{item.title}</p>
                                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '2px' }}>{item.type === 'class' ? 'Scheduled Live Class' : item.type === 'video' ? 'Batch Video Resource' : 'Private Announcement'}</p>
                                                </div>
                                            </div>
                                            <ArrowRight size={18} color="var(--text-secondary)" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column (Fixed Card) */}
                <div style={{ position: 'sticky', top: '120px', height: 'fit-content' }}>
                    <div className="glass-card" style={{ overflow: 'hidden' }}>
                        <img src={course.thumbnail} style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
                        <div style={{ padding: '30px' }}>
                            {!isAdmin && (
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                                      <h1 style={{ fontSize: '2.2rem', fontWeight: '800' }}>₹{course.price}</h1>
                                      <span style={{ color: 'var(--text-secondary)', textDecoration: 'line-through' }}>₹{(course.price * 2.5).toFixed(2)}</span>
                                  </div>
                                  <button onClick={() => toggleFavorite(course._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: isFavorite ? '#ef4444' : 'var(--text-secondary)' }}>
                                      <Heart fill={isFavorite ? 'currentColor' : 'none'} size={28} />
                                  </button>
                              </div>
                            )}

                            {isAdmin && (
                                <div style={{ marginBottom: '25px', padding: '15px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px', border: '1px solid var(--accent-primary)', textAlign: 'center' }}>
                                    <p style={{ fontWeight: '800', color: 'var(--accent-primary)', fontSize: '0.9rem' }}>🛡️ ADMIN ACCESS ENABLED</p>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>You have full permission to view all resources.</p>
                                </div>
                            )}

                            {isEnrolled || isAdmin ? (
                                <Link to={`/lessons/${course._id}/0`} style={{ textDecoration: 'none' }}>
                                    <button className="btn btn-primary" style={{ width: '100%', padding: '16px', marginBottom: '15px', background: isAdmin ? 'var(--accent-primary)' : 'var(--success)' }}>
                                        {isAdmin ? 'View Curriculum' : (course.isBatch ? 'Joined Batch Class' : 'Continue Learning')} <ArrowRight size={20} />
                                    </button>
                                </Link>
                            ) : (
                                <button onClick={handleEnroll} className="btn btn-primary" style={{ width: '100%', padding: '16px', marginBottom: '15px' }}>
                                    {course.isBatch ? `Pre-Enroll in Batch (₹{course.price})` : `Enroll Now (₹{course.price})`} <ArrowRight size={20} />
                                </button>
                            )}

                            {course.isBatch && course.startDate && (
                                <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#10b981', fontWeight: '700', marginBottom: '20px' }}>
                                    BATCH STARTS: {new Date(course.startDate).toLocaleDateString()}
                                </p>
                            )}
                            
                            <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                                <ShieldCheck size={16} color="var(--success)" /> SECURE PAYMENT GUARANTEED
                            </p>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <p style={{ fontWeight: '700', fontSize: '0.9rem' }}>This course includes:</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                    <Clock size={18} /> Lifetime Access
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                    <BookOpen size={18} /> {course.lessons.length} downloadable resources
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                    <Award size={18} /> Certificate of completion
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <CheckoutModal 
                isOpen={isCheckoutOpen} 
                onClose={() => setIsCheckoutOpen(false)} 
                course={course} 
                onPaymentSuccess={handlePaymentComplete} 
            />
        </div>
    );
};

export default CourseDetail;
