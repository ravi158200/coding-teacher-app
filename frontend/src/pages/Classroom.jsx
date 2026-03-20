import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Video, MessageSquare, Download, Users, Send, Hand, X, Share2, Info } from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const Classroom = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [classData, setClassData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [chatMessages, setChatMessages] = useState([
        { id: 1, user: 'System', text: 'Welcome to the Live Classroom! Be respectful to everyone.', time: '10:00 AM' },
        { id: 2, user: 'Instructor', text: 'Hello everyone! We will start in 5 minutes.', time: '10:01 AM' }
    ]);
    const [newMessage, setNewMessage] = useState('');
    const [activeTab, setActiveTab] = useState('chat');
    const [isHandRaised, setIsHandRaised] = useState(false);
    const [participants, setParticipants] = useState(42);
    const [relatedContent, setRelatedContent] = useState([]);

    useEffect(() => {
        const fetchClassData = async () => {
            try {
                const { data } = await API.get(`/content/${id}`);
                setClassData(data);
                // Simulate real-time participants
                setParticipants(Math.floor(Math.random() * 50) + 20);

                if (data.course) {
                    const relatedRes = await API.get(`/content?course=${data.course}`);
                    setRelatedContent(relatedRes.data.filter(item => item._id !== id));
                }
            } catch (err) {
                console.error(err);
                navigate('/content');
            } finally {
                setLoading(false);
            }
        };
        fetchClassData();

        // Simulate random incoming messages
        const interval = setInterval(() => {
            const randomUser = ['Sumit', 'Rahul', 'Ananya', 'Sneha'][Math.floor(Math.random() * 4)];
            const randomMsg = ['Is this session being recorded?', 'Yes, the audio is clear.', 'Could you please repeat that?', 'Great explanation!'][Math.floor(Math.random() * 4)];
            setChatMessages(prev => [...prev.slice(-15), { 
                id: Date.now(), 
                user: randomUser, 
                text: randomMsg, 
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
            }]);
        }, 8000);

        return () => clearInterval(interval);
    }, [id, navigate]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        
        setChatMessages(prev => [...prev, {
            id: Date.now(),
            user: user?.name || 'Guest User',
            text: newMessage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        setNewMessage('');
    };

    if (loading) return <div className="container section-padding" style={{ textAlign: 'center' }}><h2>Joining Classroom...</h2></div>;
    if (!classData) return <div className="container section-padding">Class not found.</div>;

    const ASSET_URL = import.meta.env.VITE_ASSET_URL || 'http://localhost:5000/uploads/';

    return (
        <div style={{ background: '#0f172a', minHeight: '100vh', color: 'white', padding: '20px' }}>
            <div style={{ maxWidth: '1600px', margin: '0 auto', display: 'flex', gap: '20px', height: 'calc(100vh - 100px)' }}>
                
                {/* Left: Video Player Area */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ position: 'relative', width: '100%', background: 'black', borderRadius: '16px', overflow: 'hidden', flex: 1, border: '1px solid rgba(255,255,255,0.1)' }}>
                        {classData.videoUrl ? (
                            <iframe 
                                src={classData.videoUrl} 
                                style={{ width: '100%', height: '100%', border: 'none' }} 
                                title="Live stream"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(45deg, #1e293b, #0f172a)' }}>
                                <div style={{ textAlign: 'center', animation: 'pulse 2s infinite' }}>
                                    <div style={{ border: '3px solid #6366f1', borderRadius: '50%', width: '100px', height: '100px', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Video size={48} color="#6366f1" />
                                    </div>
                                    <h3>Class Connection Error</h3>
                                    <p style={{ opacity: 0.6 }}>The instructor hasn't started the stream yet.</p>
                                    {classData.classLink && (
                                        <a href={classData.classLink} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ marginTop: '20px' }}>
                                            Try External Link
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                        
                        {/* Stream Overlays */}
                        <div style={{ position: 'absolute', top: '20px', left: '20px', background: 'rgba(239, 68, 68, 0.9)', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{ width: '8px', height: '8px', background: 'white', borderRadius: '50%', animation: 'flash 1s infinite' }} /> LIVE
                        </div>
                        <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', gap: '10px' }}>
                            <div style={{ background: 'rgba(0,0,0,0.6)', padding: '6px 12px', borderRadius: '10px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Users size={16} /> {participants} Watching
                            </div>
                        </div>
                    </div>

                    {/* Bottom Info Bar */}
                    <div style={{ padding: '24px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h1 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '8px' }}>{classData.title}</h1>
                                <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>{classData.body}</p>
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                {classData.pdfFile && (
                                    <a href={`${ASSET_URL}${classData.pdfFile}`} target="_blank" rel="noreferrer" className="btn" style={{ background: '#3b82f6', color: 'white' }}>
                                        <Download size={18} /> Download Notes
                                    </a>
                                )}
                                <button 
                                    onClick={() => setIsHandRaised(!isHandRaised)} 
                                    className="btn" 
                                    style={{ background: isHandRaised ? '#f59e0b' : 'rgba(255,255,255,0.1)', color: 'white' }}
                                >
                                    <Hand size={18} /> {isHandRaised ? 'Hand Raised' : 'Raise Hand'}
                                </button>
                                <button className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'white' }}>
                                    <Share2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Interaction Panel (Chat/Resources) */}
                <div style={{ width: '400px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', display: 'flex', flexDirection: 'column', border: '1px solid rgba(255,255,255,0.1)' }}>
                    {/* Panel Header Tabs */}
                    <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        <button 
                            onClick={() => setActiveTab('chat')} 
                            style={{ flex: 1, padding: '15px', background: 'none', border: 'none', color: activeTab === 'chat' ? '#6366f1' : 'white', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer', borderBottom: activeTab === 'chat' ? '2px solid #6366f1' : 'none' }}
                        >
                            <MessageSquare size={16} /> Chat
                        </button>
                        <button 
                            onClick={() => setActiveTab('info')} 
                            style={{ flex: 1, padding: '15px', background: 'none', border: 'none', color: activeTab === 'info' ? '#6366f1' : 'white', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer', borderBottom: activeTab === 'info' ? '2px solid #6366f1' : 'none' }}
                        >
                            <Info size={16} /> Details
                        </button>
                        <button 
                            onClick={() => setActiveTab('resources')} 
                            style={{ flex: 1, padding: '15px', background: 'none', border: 'none', color: activeTab === 'resources' ? '#6366f1' : 'white', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer', borderBottom: activeTab === 'resources' ? '2px solid #6366f1' : 'none' }}
                        >
                            <Download size={16} /> Batch Hub
                        </button>
                    </div>

                    {/* Chat Messages */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {activeTab === 'chat' ? (
                            chatMessages.map(msg => (
                                <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontWeight: '800', fontSize: '0.85rem', color: msg.user === 'Instructor' ? '#6366f1' : '#10b981' }}>{msg.user}</span>
                                        <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>{msg.time}</span>
                                    </div>
                                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px 14px', borderRadius: '12px', fontSize: '0.9rem', width: 'fit-content', maxWidth: '100%' }}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))
                        ) : activeTab === 'info' ? (
                            <div style={{ padding: '0 10px' }}>
                                <h4 style={{ marginBottom: '15px' }}>Batch Details</h4>
                                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '12px', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <p><strong>Class ID:</strong> {classData._id}</p>
                                    <p><strong>Started At:</strong> {new Date(classData.classDate).toLocaleTimeString()}</p>
                                    <p><strong>Duration:</strong> {classData.classDuration}</p>
                                    <p><strong>Instructor:</strong> {classData.author?.name || 'Vipul Sir'}</p>
                                </div>
                                <h4 style={{ margin: '20px 0 15px' }}>Quick Resources</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <button className="btn" style={{ width: '100%', justifyContent: 'flex-start', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '0.85rem' }}><Download size={14} /> Official Documentation</button>
                                    <button className="btn" style={{ width: '100%', justifyContent: 'flex-start', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '0.85rem' }}><MessageSquare size={14} /> Join Discord Community</button>
                                </div>
                            </div>
                        ) : (
                            <div style={{ padding: '0 10px' }}>
                                <h4 style={{ marginBottom: '20px', color: '#6366f1' }}>🔐 Shared Batch Resources</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {relatedContent.length === 0 ? (
                                        <p style={{ opacity: 0.5, textAlign: 'center' }}>No other resources found for this batch.</p>
                                    ) : (
                                        relatedContent.map(item => (
                                            <div 
                                                key={item._id} 
                                                onClick={() => window.location.href = item.type === 'class' ? `/classroom/${item._id}` : `/content/${item._id}`}
                                                style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', cursor: 'pointer', border: '1px solid transparent', transition: 'all 0.2s' }}
                                                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)'}
                                                onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
                                            >
                                                <p style={{ fontSize: '0.85rem', fontWeight: '800', marginBottom: '4px' }}>{item.title}</p>
                                                <p style={{ fontSize: '0.65rem', textTransform: 'uppercase', opacity: 0.5 }}>{item.type}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                                {classData.pdfFile && (
                                    <>
                                        <h4 style={{ margin: '30px 0 15px' }}>Current Session Files</h4>
                                        <a href={`${ASSET_URL}${classData.pdfFile}`} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                                            <div style={{ padding: '15px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '12px', color: '#60a5fa', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <Download size={16} /> Session Notes.pdf
                                            </div>
                                        </a>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Chat Input */}
                    {activeTab === 'chat' && (
                        <form onSubmit={handleSendMessage} style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '10px' }}>
                            <input 
                                type="text" 
                                placeholder={user ? "Ask anything..." : "Login to chat"} 
                                disabled={!user}
                                value={newMessage}
                                onChange={e => setNewMessage(e.target.value)}
                                style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px 16px', color: 'white', fontSize: '0.9rem', outline: 'none' }}
                            />
                            <button type="submit" disabled={!user || !newMessage.trim()} style={{ background: '#6366f1', color: 'white', border: 'none', borderRadius: '12px', width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                <Send size={20} />
                            </button>
                        </form>
                    )}
                </div>
            </div>
            
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes flash {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.3; }
                }
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.05); opacity: 0.8; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}} />
        </div>
    );
};

export default Classroom;
