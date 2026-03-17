/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Layout, Plus, Trash2, Video, FileText, HelpCircle, Save, Check, Upload, Users, List, PlayCircle, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    
    // Redirect if not teacher or admin
    useEffect(() => {
        if (!user || (user.role !== 'admin' && user.role !== 'teacher')) {
            navigate('/');
        }
    }, [user, navigate]);

    if (!user || (user.role !== 'admin' && user.role !== 'teacher')) return null;

    const [view, setView] = useState('create'); // 'create', 'manage', 'submissions', 'enquiries'
    const [courses, setCourses] = useState([]);
    const [enquiries, setEnquiries] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    
    const [courseForm, setCourseForm] = useState({
        title: '',
        description: '',
        instructor: user?.name || '',
        thumbnail: '',
        category: 'Web Development',
        price: '',
        originalPrice: '',
        isBatch: false,
        startDate: '',
        lessons: [{ title: '', content: '', videoUrl: '', duration: '' }],
        quizzes: [{ question: '', options: ['', '', '', ''], correctAnswer: 0 }]
    });

    const [msg, setMsg] = useState('');
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (view === 'manage' || view === 'submissions') {
            fetchMyCourses();
        }
        if (view === 'enquiries' && user.role === 'admin') {
            fetchEnquiries();
        }
    }, [view]);

    const fetchEnquiries = async () => {
        try {
            const { data } = await API.get('/enquiries');
            setEnquiries(data);
        } catch (error) {
            console.error('Error fetching enquiries');
        }
    };

    const fetchMyCourses = async () => {
        try {
            const { data } = await API.get('/courses');
            // Filter by teacher if not admin
            const myCourses = user.role === 'admin' ? data : data.filter(c => c.teacher === user._id);
            setCourses(myCourses);
        } catch (error) {
            console.error(error);
        }
    };

    const handleLessonChange = (idx, field, val) => {
        const newLessons = [...courseForm.lessons];
        newLessons[idx][field] = val;
        setCourseForm({ ...courseForm, lessons: newLessons });
    };

    const addLesson = () => {
        setCourseForm({ ...courseForm, lessons: [...courseForm.lessons, { title: '', content: '', videoUrl: '', duration: '' }] });
    };

    const handleFileUpload = async (courseId, lessonIdx, type, file) => {
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            await API.post(`/courses/${courseId}/lessons/${lessonIdx}/upload`, formData, {
                headers: { 
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert(`${type} uploaded successfully!`);
            fetchMyCourses();
        } catch (error) {
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmitCourse = async (e) => {
        e.preventDefault();
        try {
            await API.post('/courses', courseForm);
            setMsg('Course created successfully! Now you can upload files in the Manage tab.');
            setTimeout(() => setMsg(''), 5000);
            setCourseForm({
                title: '',
                description: '',
                instructor: user?.name || '',
                thumbnail: '',
                category: 'Web Development',
                price: '',
                originalPrice: '',
                isBatch: false,
                startDate: '',
                lessons: [{ title: '', content: '', videoUrl: '', duration: '' }],
                quizzes: [{ question: '', options: ['', '', '', ''], correctAnswer: 0 }]
            });
        } catch (error) {
            alert(error.response?.data?.message || 'Error creating course');
        }
    };

    const handleUpdateStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'pending' ? 'resolved' : 'pending';
        try {
            await API.put(`/enquiries/${id}`, { status: newStatus });
            fetchEnquiries();
        } catch (error) {
            console.error('Status update failed');
        }
    };

    return (
        <div className="container section-padding fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800' }}>{user?.role === 'admin' ? 'Admin Dashboard' : 'Creator Hub'}</h1>
                <div className="glass-card" style={{ display: 'flex', padding: '10px', gap: '10px' }}>
                    <button onClick={() => setView('create')} className={`btn ${view === 'create' ? 'btn-primary' : ''}`} style={{ padding: '10px 20px' }}><Plus size={18} /> Create</button>
                    <button onClick={() => setView('manage')} className={`btn ${view === 'manage' ? 'btn-primary' : ''}`} style={{ padding: '10px 20px' }}><List size={18} /> Courses</button>
                    <button onClick={() => setView('submissions')} className={`btn ${view === 'submissions' ? 'btn-primary' : ''}`} style={{ padding: '10px 20px' }}><Users size={18} /> Students</button>
                    {user.role === 'admin' && (
                        <button onClick={() => setView('enquiries')} className={`btn ${view === 'enquiries' ? 'btn-primary' : ''}`} style={{ padding: '10px 20px' }}><HelpCircle size={18} /> Enquiries</button>
                    )}
                </div>
            </div>

            {view === 'create' && (
                <form onSubmit={handleSubmitCourse} className="glass-card" style={{ padding: '40px' }}>
                    <h2 style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px' }}><Plus /> New Course Metadata</h2>
                    {msg && <div style={{ background: 'var(--success)', color: 'white', padding: '15px', borderRadius: '10px', marginBottom: '20px' }}>{msg}</div>}
                    <div className="grid-courses" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '30px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '10px', fontWeight: '700' }}>Course Title</label>
                            <input className="input-field" placeholder="Course Title" value={courseForm.title} onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })} required />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '10px', fontWeight: '700' }}>Price ($)</label>
                            <input className="input-field" type="number" placeholder="Price" value={courseForm.price} onChange={(e) => setCourseForm({ ...courseForm, price: e.target.value })} required />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '10px', fontWeight: '700' }}>Course Category</label>
                            <select className="input-field" value={courseForm.category} onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}>
                                <option>Web Development</option>
                                <option>Data Science</option>
                                <option>AI & Machine Learning</option>
                                <option>Cyber Security</option>
                                <option>Cloud Computing</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '10px', fontWeight: '700' }}>Thumbnail URL</label>
                            <input className="input-field" placeholder="Image URL" value={courseForm.thumbnail} onChange={(e) => setCourseForm({ ...courseForm, thumbnail: e.target.value })} required />
                        </div>
                    </div>
                    <div style={{ marginBottom: '30px' }}>
                        <label style={{ display: 'block', marginBottom: '10px', fontWeight: '700' }}>Course Description</label>
                        <textarea 
                            className="input-field" 
                            style={{ minHeight: '120px', resize: 'vertical' }} 
                            placeholder="Describe what students will learn in this course..." 
                            value={courseForm.description} 
                            onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })} 
                            required 
                        />
                    </div>
                    <div className="grid-courses" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '30px' }}>
                        <div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', fontWeight: '700', cursor: 'pointer' }}>
                                <input type="checkbox" checked={courseForm.isBatch} onChange={(e) => setCourseForm({ ...courseForm, isBatch: e.target.checked })} />
                                Is this a Live Batch?
                            </label>
                            {courseForm.isBatch && (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '5px' }}>Start Date</label>
                                        <input type="date" className="input-field" value={courseForm.startDate} onChange={(e) => setCourseForm({ ...courseForm, startDate: e.target.value })} required />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '5px' }}>Old Price ($)</label>
                                        <input type="number" className="input-field" placeholder="Original Price" value={courseForm.originalPrice} onChange={(e) => setCourseForm({ ...courseForm, originalPrice: e.target.value })} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div style={{ marginBottom: '40px' }}>
                        <h3 style={{ marginBottom: '20px' }}><Video size={20} /> Lessons Structure</h3>
                        {courseForm.lessons.map((lesson, idx) => (
                            <div key={idx} style={{ background: 'var(--bg-secondary)', padding: '20px', borderRadius: '15px', marginBottom: '15px' }}>
                                <input className="input-field" style={{ marginBottom: '10px' }} placeholder="Lesson Title" value={lesson.title} onChange={(e) => handleLessonChange(idx, 'title', e.target.value)} required />
                                <textarea className="input-field" placeholder="Short description/notes summary" value={lesson.content} onChange={(e) => handleLessonChange(idx, 'content', e.target.value)} required />
                            </div>
                        ))}
                        <button type="button" onClick={addLesson} className="btn" style={{ background: 'var(--bg-accent)' }}>+ Add Lesson Slot</button>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '18px' }}><Save /> Create Course Structure</button>
                </form>
            )}

            {view === 'manage' && (
                <div className="grid-courses">
                    {courses.map(c => (
                        <div key={c._id} className="glass-card" style={{ padding: '20px' }}>
                            <img src={c.thumbnail} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '10px', marginBottom: '15px' }} />
                            <h3 style={{ marginBottom: '10px' }}>{c.title}</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px', minHeight: '40px' }}>{c.description?.substring(0, 60)}...</p>
                            
                            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '15px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                    <span style={{ fontWeight: '700', fontSize: '0.8rem' }}>MANAGE LESSONS:</span>
                                    {user.role === 'admin' && (
                                        <button 
                                            onClick={async () => {
                                                if (window.confirm('Delete this course permanently?')) {
                                                    await API.delete(`/courses/${c._id}`);
                                                    fetchMyCourses();
                                                }
                                            }}
                                            style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                                {c.lessons.map((l, lIdx) => (
                                    <div key={lIdx} style={{ fontSize: '0.85rem', padding: '10px', background: 'var(--bg-accent)', borderRadius: '8px', marginBottom: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span>{lIdx + 1}. {l.title}</span>
                                            {l.videoFile && <Check color="var(--success)" size={16} />}
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <label className="btn" style={{ fontSize: '0.7rem', flex: 1, padding: '5px', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                                <Video size={14} /> Video
                                                <input type="file" accept="video/*" style={{ display: 'none' }} onChange={(e) => handleFileUpload(c._id, lIdx, 'Video', e.target.files[0])} />
                                            </label>
                                            <label className="btn" style={{ fontSize: '0.7rem', flex: 1, padding: '5px', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                                <FileText size={14} /> PDF
                                                <input type="file" accept=".pdf" style={{ display: 'none' }} onChange={(e) => handleFileUpload(c._id, lIdx, 'PDF', e.target.files[0])} />
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {view === 'submissions' && (
                <div className="glass-card" style={{ padding: '30px' }}>
                    <h2 style={{ marginBottom: '30px' }}><Users /> Student Submissions</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {courses.flatMap(c => c.submissions.map(s => ({ ...s, courseTitle: c.title }))).length === 0 ? (
                            <p style={{ color: 'var(--text-secondary)' }}>No student submissions yet.</p>
                        ) : (
                            courses.flatMap(c => c.submissions.map(s => (
                                <div key={s._id} style={{ padding: '20px', background: 'var(--bg-secondary)', borderRadius: '15px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <p style={{ fontWeight: '700' }}>Student: {s.student?.name || 'Inquisitive Minds'}</p>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Course: {s.courseTitle} | Lesson: {s.lessonIdx + 1}</p>
                                        <p style={{ fontStyle: 'italic', marginTop: '10px' }}>"{s.comment}"</p>
                                    </div>
                                    <a href={`http://localhost:5003${s.fileUrl}`} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ padding: '10px 20px' }}>
                                        View Work <PlayCircle size={18} />
                                    </a>
                                </div>
                            )))
                        )}
                    </div>
                </div>
            )}

            {view === 'enquiries' && (
                <div className="glass-card" style={{ padding: '30px' }}>
                    <h2 style={{ marginBottom: '30px' }}><HelpCircle /> Student Enquiries</h2>
                    {enquiries.length === 0 ? (
                        <p style={{ color: 'var(--text-secondary)' }}>No enquiries found.</p>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                        <th style={{ padding: '15px' }}>Date</th>
                                        <th style={{ padding: '15px' }}>Student</th>
                                        <th style={{ padding: '15px' }}>Course</th>
                                        <th style={{ padding: '15px' }}>Message</th>
                                        <th style={{ padding: '15px' }}>Status</th>
                                        <th style={{ padding: '15px' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {enquiries.map(e => (
                                        <tr key={e._id} style={{ borderBottom: '1px solid var(--border)' }}>
                                            <td style={{ padding: '15px', fontSize: '0.85rem' }}>{new Date(e.createdAt).toLocaleDateString()}</td>
                                            <td style={{ padding: '15px' }}>
                                                <div style={{ fontWeight: '700' }}>{e.name}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{e.email}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{e.phone}</div>
                                            </td>
                                            <td style={{ padding: '15px' }}>{e.course}</td>
                                            <td style={{ padding: '15px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{e.message}</td>
                                            <td style={{ padding: '15px' }}>
                                                <span style={{ padding: '5px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '800', background: e.status === 'pending' ? '#f59e0b' : '#10b981', color: 'white' }}>
                                                    {e.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td style={{ padding: '15px' }}>
                                                <button 
                                                    onClick={() => handleUpdateStatus(e._id, e.status)}
                                                    className="btn" 
                                                    style={{ fontSize: '0.75rem', padding: '5px 10px', background: 'var(--bg-accent)' }}
                                                >
                                                    Mark as {e.status === 'pending' ? 'Resolved' : 'Pending'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
