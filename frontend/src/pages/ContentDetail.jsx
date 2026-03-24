import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API, { ASSET_URL } from '../services/api';
import { Calendar, Clock, User, ArrowLeft, Tag, Megaphone, BookOpen, Video, Eye, Share2, Globe, Link2 } from 'lucide-react';

const ContentDetail = () => {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchItem = async () => {
            setLoading(true);
            try {
                const { data } = await API.get(`/content/${id}`);
                setItem(data);
            } catch (err) {
                setError(err.response?.data?.message || 'Content not found');
            } finally {
                setLoading(false);
            }
        };
        fetchItem();
    }, [id]);

    if (loading) return <div className="container section-padding" style={{ textAlign: 'center' }}><h2>Loading...</h2></div>;
    if (error) return <div className="container section-padding" style={{ textAlign: 'center' }}><h2 style={{ color: '#ef4444' }}>{error}</h2><Link to="/content" className="btn" style={{ margin: '20px auto' }}>Back to Content</Link></div>;
    if (!item) return null;

    const classDate = item.classDate ? new Date(item.classDate) : null;
    const isUpcoming = classDate && classDate > new Date();

    return (
        <div className="container section-padding fade-in">
            <button onClick={() => navigate(-1)} className="btn" style={{ marginBottom: '30px', background: 'var(--bg-accent)' }}>
                <ArrowLeft size={18} /> Back
            </button>

            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                {/* Header Section */}
                <div style={{ marginBottom: '40px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                        <span style={{ 
                            background: item.type === 'announcement' ? '#f59e0b22' : 
                                       item.type === 'class' ? '#3b82f622' : '#6366f122',
                            color: item.type === 'announcement' ? '#f59e0b' : 
                                   item.type === 'class' ? '#3b82f6' : '#6366f1',
                            padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase'
                        }}>
                            {item.type}
                        </span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            Published on {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Eye size={16} /> {item.views} views
                        </span>
                    </div>
                    <h1 style={{ fontSize: '3rem', fontWeight: '900', lineHeight: '1.1', marginBottom: '24px' }}>{item.title}</h1>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <img 
                            src={item.author?.avatar ? (item.author.avatar.startsWith('http') ? item.author.avatar : `${ASSET_URL}${item.author.avatar}`) : "https://cdn-icons-png.flaticon.com/128/3177/3177440.png"} 
                            style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-primary)' }} 
                            alt={item.authorName} 
                        />
                        <div>
                            <p style={{ fontWeight: '700', fontSize: '1rem' }}>{item.authorName || item.author?.name || 'Academic Admin'}</p>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Coding Faculty</p>
                        </div>
                    </div>
                </div>

                {/* Hero / Media Section */}
                <div style={{ marginBottom: '40px', borderRadius: '30px', overflow: 'hidden', boxShadow: '0 20px 50px -15px rgba(0,0,0,0.2)' }}>
                    {item.videoUrl ? (
                         <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                            <iframe 
                                src={item.videoUrl} 
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                                title={item.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    ) : item.videoFile ? (
                        <video 
                            src={`${ASSET_URL}${item.videoFile}`} 
                            controls 
                            style={{ width: '100%', display: 'block' }}
                        />
                    ) : item.thumbnail ? (
                        <img 
                            src={item.thumbnail?.startsWith('http') ? item.thumbnail : `${ASSET_URL}${item.thumbnail}`}
                            style={{ width: '100%', maxHeight: '500px', objectFit: 'cover' }}
                            alt="hero"
                        />
                    ) : (
                        <div style={{ height: '300px', background: 'linear-gradient(135deg, var(--bg-accent), #6366f122)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                           {item.type === 'announcement' ? <Megaphone size={80} color="#6366f1" opacity={0.2} /> : 
                            item.type === 'class' ? <Calendar size={80} color="#6366f1" opacity={0.2} /> : 
                            <BookOpen size={80} color="#6366f1" opacity={0.2} />}
                        </div>
                    )}
                </div>

                {/* Live Class Specific Info */}
                {item.type === 'class' && (
                    <div className="glass-card" style={{ padding: '30px', marginBottom: '40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px' }}>
                        <div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '700', marginBottom: '8px' }}>DATE & TIME</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Calendar color="var(--accent-primary)" />
                                <span style={{ fontWeight: '700' }}>{classDate?.toLocaleString()}</span>
                            </div>
                        </div>
                        <div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '700', marginBottom: '8px' }}>DURATION</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Clock color="var(--accent-primary)" />
                                <span style={{ fontWeight: '700' }}>{item.classDuration || 'Not specified'}</span>
                            </div>
                        </div>
                        {isUpcoming && (
                            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                                <Link to={`/classroom/${item._id}`} className="btn btn-primary" style={{ width: '100%', gap: '10px' }}>
                                    <Video size={18} /> Join Integrated Classroom
                                </Link>
                            </div>
                        )}
                        {!isUpcoming && (
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ background: 'var(--bg-accent)', padding: '10px 20px', borderRadius: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                                    Class Completed
                                </span>
                            </div>
                        )}
                    </div>
                )}

                {/* Content Body */}
                <div style={{ 
                    fontSize: '1.2rem', 
                    lineHeight: '1.8', 
                    color: 'var(--text-primary)',
                    whiteSpace: 'pre-wrap',
                    marginBottom: '40px'
                }}>
                    {item.body}
                </div>

                {/* Class Resources */}
                {item.pdfFile && (
                    <div className="glass-card" style={{ padding: '30px', marginBottom: '40px', background: 'rgba(99,102,241,0.05)', border: '1px solid #6366f122' }}>
                        <h4 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}><BookOpen size={20} color="#6366f1" /> Class Resources</h4>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '0.95rem' }}>Download the supplemental notes and materials for this session.</p>
                        <a href={`${ASSET_URL}${item.pdfFile}`} target="_blank" rel="noreferrer" className="btn" style={{ background: '#6366f1', color: 'white', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                             <Share2 size={16} /> Download Notes (PDF)
                        </a>
                    </div>
                )}

                {/* Tags Section */}
                {(item.tags || []).length > 0 && (
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', borderTop: '1px solid var(--border)', paddingTop: '30px' }}>
                        {item.tags.map(tag => (
                            <span key={tag} style={{ 
                                background: 'var(--bg-accent)', 
                                padding: '6px 15px', 
                                borderRadius: '25px', 
                                fontSize: '0.9rem', 
                                color: 'var(--text-secondary)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}>
                                <Tag size={14} /> #{tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Footer Engagement */}
                <div style={{ marginTop: '60px', padding: '40px', background: 'var(--bg-secondary)', borderRadius: '24px', textAlign: 'center' }}>
                    <h3 style={{ marginBottom: '15px' }}>Helpful content?</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '25px' }}>Share this with your fellow developers and help them grow.</p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                        <button className="btn" style={{ background: 'white', border: '1px solid var(--border)' }}><Share2 size={18} /> Share Link</button>
                        <button onClick={() => navigate('/content')} className="btn" style={{ background: 'white', border: '1px solid var(--border)' }}>View All Content</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContentDetail;
