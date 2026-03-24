/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import API, { ASSET_URL } from '../services/api';
import { useNavigate } from 'react-router-dom';
import {
  Layout, Plus, Trash2, Video, FileText, HelpCircle, Save, Check,
  Upload, Users, List, PlayCircle, Lock, Shield, Eye, EyeOff,
  Megaphone, BookOpen, Pin, BarChart2, Edit3, X, Globe, Calendar,
  Link2, Tag
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// ─── Attractive Dashboard Styles ──────────────────────────────────────────────
const DashboardStyles = () => (
  <style>{`
    .admin-dashboard-container {
      background: var(--bg-primary);
      color: var(--text-primary);
    }
    .admin-tab-btn:hover {
      background: var(--bg-accent) !important;
      transform: translateY(-2px);
    }
    .admin-table-row:hover {
      background: var(--bg-accent) !important;
      cursor: pointer;
    }
    .admin-card-glow:hover {
      box-shadow: 0 20px 40px -20px var(--accent-primary) !important;
      transform: scale(1.02);
    }
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      border-radius: 100px;
      font-weight: 700;
      font-size: 0.7rem;
      letter-spacing: 0.5px;
    }
  `}</style>
);
const Badge = ({ color, children }) => (
  <span style={{
    padding: '3px 10px', borderRadius: '20px', fontSize: '0.7rem',
    fontWeight: '800', background: color, color: 'white', display: 'inline-block'
  }}>{children}</span>
);

const roleColor = { student: '#6366f1', teacher: '#f59e0b', admin: '#ef4444' };
const themeColors = {
  primary: 'linear-gradient(135deg, #6366f1, #818cf8)',
  danger: 'linear-gradient(135deg, #ef4444, #f87171)',
  success: 'linear-gradient(135deg, #10b981, #34d399)',
  warning: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
  card: 'rgba(255, 255, 255, 0.7)',
  cardDark: 'rgba(15, 23, 42, 0.7)',
};

// ─── Main Component ────────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const isAdmin = user?.role === 'admin';

  const TABS = [
    { id: 'create', label: 'Create Course', icon: <Plus size={16} /> },
    { id: 'manage', label: 'Courses', icon: <List size={16} /> },
    { id: 'submissions', label: 'Students', icon: <Users size={16} /> },
    ...(isAdmin ? [{ id: 'users', label: 'All Users', icon: <Shield size={16} /> }] : []),
    { id: 'content', label: 'Content', icon: <Megaphone size={16} /> },
    { id: 'videos', label: 'Free Videos', icon: <Video size={16} /> },
    { id: 'classes', label: 'Live Classes', icon: <Calendar size={16} /> },
    ...(isAdmin ? [{ id: 'enquiries', label: 'Enquiries', icon: <HelpCircle size={16} /> }] : []),
  ];

  const [view, setView] = useState('create');
  const [courses, setCourses] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [contentList, setContentList] = useState([]);
  const [msg, setMsg] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingFile, setUploadingFile] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const [courseForm, setCourseForm] = useState({
    title: '', description: '', instructor: user?.name || '',
    thumbnail: '', category: 'Web Development', price: '', originalPrice: '',
    isBatch: false, startDate: '', accessDuration: 6, maxStudents: 50,
    lessons: [{ title: '', content: '', videoUrl: '', duration: '' }],
    quizzes: [{ question: '', options: ['', '', '', ''], correctAnswer: 0 }]
  });

  const [contentForm, setContentForm] = useState({
    title: '', type: 'article', body: '', thumbnail: '', videoUrl: '',
    tags: '', isPinned: false, isPublished: true,
    classDate: '', classDuration: '', classLink: '', maxStudents: ''
  });
  const [editingContent, setEditingContent] = useState(null);
  const [showContentForm, setShowContentForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [userEditForm, setUserEditForm] = useState({ name: '', email: '', bio: '', occupation: '', phoneNumber: '', role: '' });

  useEffect(() => {
    if (view === 'manage' || view === 'submissions') fetchMyCourses();
    if (view === 'enquiries' && isAdmin) fetchEnquiries();
    if (view === 'users' && isAdmin) fetchAllUsers();
    if (view === 'content') fetchContent('article');
    if (view === 'videos') fetchContent('video');
    if (view === 'classes') fetchContent('class');
  }, [view]);

  const fetchAllUsers = async () => {
    try {
      const [usersRes, statsRes] = await Promise.all([
        API.get('/users/admin/all'),
        API.get('/users/admin/stats')
      ]);
      setAllUsers(usersRes.data);
      setStats(statsRes.data);
    } catch (e) { console.error(e); }
  };

  const fetchContent = async (type) => {
    try {
      const { data } = await API.get(`/content/admin/all?type=${type}`);
      setContentList(data);
    } catch (e) { console.error(e); }
  };

  const fetchEnquiries = async () => {
    try { const { data } = await API.get('/enquiries'); setEnquiries(data); }
    catch (e) { console.error(e); }
  };

  const fetchMyCourses = async () => {
    try {
      const { data } = await API.get('/courses');
      setCourses(isAdmin ? data : data.filter(c => c.teacher === user._id));
    } catch (e) { console.error(e); }
  };

  // ── Course Helpers ──
  const handleLessonChange = (idx, field, val) => {
    const ls = [...courseForm.lessons]; ls[idx][field] = val;
    setCourseForm({ ...courseForm, lessons: ls });
  };
  const addLesson = () => setCourseForm({ ...courseForm, lessons: [...courseForm.lessons, { title: '', content: '', videoUrl: '', duration: '' }] });
  const removeLesson = (idx) => { if (courseForm.lessons.length <= 1) return; setCourseForm({ ...courseForm, lessons: courseForm.lessons.filter((_, i) => i !== idx) }); };
  const handleQuizChange = (idx, field, val) => { const q = [...courseForm.quizzes]; q[idx][field] = val; setCourseForm({ ...courseForm, quizzes: q }); };
  const handleQuizOptionChange = (qIdx, oIdx, val) => { const q = [...courseForm.quizzes]; q[qIdx].options[oIdx] = val; setCourseForm({ ...courseForm, quizzes: q }); };
  const addQuiz = () => setCourseForm({ ...courseForm, quizzes: [...courseForm.quizzes, { question: '', options: ['', '', '', ''], correctAnswer: 0 }] });

  const handleFileUpload = async (courseId, lessonIdx, type, file) => {
    if (!file) return;
    setUploading(true); setUploadingFile(`${courseId}-${lessonIdx}-${type}`); setUploadProgress(0);
    try {
      const fd = new FormData(); fd.append('file', file);
      await API.post(`/courses/${courseId}/lessons/${lessonIdx}/upload`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: e => setUploadProgress(Math.round(e.loaded * 100 / e.total))
      });
      alert(`${type} uploaded!`); fetchMyCourses();
    } catch { alert('Upload failed'); }
    finally { setUploading(false); setUploadingFile(''); setUploadProgress(0); }
  };

  const handleThumbnailUpload = async (courseId, file) => {
    if (!file) return;
    setUploading(true); setUploadingFile(`thumb-${courseId}`); setUploadProgress(0);
    try {
      const fd = new FormData(); fd.append('file', file);
      await API.post(`/courses/${courseId}/thumbnail`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: e => setUploadProgress(Math.round(e.loaded * 100 / e.total))
      });
      alert('Thumbnail uploaded!'); fetchMyCourses();
    } catch { alert('Thumbnail upload failed'); }
    finally { setUploading(false); setUploadingFile(''); setUploadProgress(0); }
  };

  const handleSubmitCourse = async (e) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        await API.put(`/courses/${editingCourse._id}`, courseForm);
        setMsg('Course updated successfully!');
      } else {
        await API.post('/courses', courseForm);
        setMsg('Course created! Upload videos in the Courses tab.');
      }
      setTimeout(() => setMsg(''), 5000);
      setCourseForm({ title: '', description: '', instructor: user?.name || '', thumbnail: '', category: 'Web Development', price: '', originalPrice: '', isBatch: false, startDate: '', accessDuration: 6, lessons: [{ title: '', content: '', videoUrl: '', duration: '' }], quizzes: [{ question: '', options: ['', '', '', ''], correctAnswer: 0 }] });
      setEditingCourse(null);
      setView('manage');
      fetchMyCourses();
    } catch (err) { alert(err.response?.data?.message || 'Error saving course'); }
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setCourseForm({
      title: course.title,
      description: course.description,
      instructor: course.instructor || '',
      category: course.category,
      price: course.price,
      originalPrice: course.originalPrice || '',
      thumbnail: course.thumbnail || '',
      isBatch: course.isBatch || false,
      startDate: course.startDate ? course.startDate.split('T')[0] : '',
      accessDuration: course.accessDuration || 6,
      maxStudents: course.maxStudents || 50,
      lessons: course.lessons.length > 0 ? course.lessons : [{ title: '', content: '', videoUrl: '', duration: '' }],
      quizzes: course.quizzes.length > 0 ? course.quizzes : [{ question: '', options: ['', '', '', ''], correctAnswer: 0 }]
    });
    setView('create'); // Redirect to form
  };

  const handleUpdateEnquiryStatus = async (id, status) => {
    await API.put(`/enquiries/${id}`, { status: status === 'pending' ? 'resolved' : 'pending' });
    fetchEnquiries();
  };

  // ── Content Helpers ──
  const openContentForm = (type, item = null) => {
    setEditingContent(item);
    setContentForm(item
      ? { ...item, tags: (item.tags || []).join(', '), classDate: item.classDate ? item.classDate.slice(0, 16) : '' }
      : { title: '', type, body: '', thumbnail: '', videoUrl: '', tags: '', isPinned: false, isPublished: true, classDate: '', classDuration: '', classLink: '', maxStudents: '' }
    );
    setShowContentForm(true);
  };

  const handleContentSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...contentForm, tags: contentForm.tags.split(',').map(t => t.trim()).filter(Boolean) };
    try {
      if (editingContent) {
        await API.put(`/content/${editingContent._id}`, payload);
        setMsg('Content updated!');
      } else {
        await API.post('/content', payload);
        setMsg('Content created!');
      }
      setTimeout(() => setMsg(''), 3000);
      setShowContentForm(false);
      setEditingContent(null);
      fetchContent(contentForm.type);
    } catch (err) { alert(err.response?.data?.message || 'Error saving content'); }
  };

  const handleDeleteContent = async (id) => {
    if (!window.confirm('Delete this content permanently?')) return;
    await API.delete(`/content/${id}`);
    fetchContent(view === 'videos' ? 'video' : view === 'classes' ? 'class' : 'article');
  };

  const handleContentVideoUpload = async (contentId, file) => {
    if (!file) return;
    setUploading(true); setUploadProgress(0);
    const fd = new FormData(); fd.append('file', file);
    try {
      await API.post(`/content/${contentId}/upload-video`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: e => setUploadProgress(Math.round(e.loaded * 100 / e.total))
      });
      alert('Video uploaded!');
      fetchContent(view === 'videos' ? 'video' : 'class');
    } catch { alert('Upload failed'); }
    finally { setUploading(false); setUploadProgress(0); }
  };

  const handleUpdateUserRole = async (userId, role) => {
    try {
      await API.put(`/users/admin/${userId}/role`, { role });
      fetchAllUsers();
    } catch { alert('Failed to update role'); }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Delete this user permanently?')) return;
    await API.delete(`/users/admin/${userId}`);
    fetchAllUsers();
  };

  const handleEditUser = (u) => {
    setEditingUser(u);
    setUserEditForm({ name: u.name, email: u.email, bio: u.bio || '', occupation: u.occupation || '', phoneNumber: u.phoneNumber || '', role: u.role });
  };

  const handleUserUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/users/admin/edit/${editingUser._id}`, userEditForm);
      setMsg('User details updated!');
      setEditingUser(null);
      fetchAllUsers();
      setTimeout(() => setMsg(''), 3000);
    } catch { alert('Failed to update user'); }
  };

  const handleBlockUser = async (userId) => {
    try {
      const { data } = await API.put(`/users/admin/${userId}/block`, {});
      setMsg(data.message);
      fetchAllUsers();
      setTimeout(() => setMsg(''), 3000);
    } catch (err) { 
      alert(err.response?.data?.message || 'Failed to toggle block status'); 
    }
  };

  // ─── STYLES ────────────────────────────────────────────────────────────────
  const inputStyle = { width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-accent)', color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' };
  const sectionTitle = { fontSize: '1.4rem', fontWeight: '800', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' };

  // ── Content/Video/Class shared form ──
  const ContentForm = ({ type }) => (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto', padding: '36px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontWeight: '800' }}>{editingContent ? 'Edit' : 'New'} {type === 'video' ? 'Free Video' : type === 'class' ? 'Live Class' : type === 'announcement' ? 'Announcement' : 'Content'}</h2>
          <button onClick={() => { setShowContentForm(false); setEditingContent(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}><X size={22} /></button>
        </div>
        <form onSubmit={handleContentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '700', fontSize: '0.85rem' }}>Title *</label>
            <input style={inputStyle} placeholder="Enter title..." value={contentForm.title} onChange={e => setContentForm({ ...contentForm, title: e.target.value })} required />
          </div>
          {(type === 'article' || type === 'announcement') && (
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '700', fontSize: '0.85rem' }}>Body / Description</label>
              <textarea style={{ ...inputStyle, minHeight: '140px', resize: 'vertical' }} placeholder="Write your content here..." value={contentForm.body} onChange={e => setContentForm({ ...contentForm, body: e.target.value })} />
            </div>
          )}
          {(type === 'video' || type === 'class') && (
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '700', fontSize: '0.85rem' }}>Description</label>
              <textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} value={contentForm.body} onChange={e => setContentForm({ ...contentForm, body: e.target.value })} />
            </div>
          )}
          {(type === 'video') && (
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '700', fontSize: '0.85rem' }}>YouTube / Video Embed URL</label>
              <input style={inputStyle} placeholder="https://youtube.com/embed/..." value={contentForm.videoUrl} onChange={e => setContentForm({ ...contentForm, videoUrl: e.target.value })} />
            </div>
          )}
          {type === 'class' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '700', fontSize: '0.85rem' }}>Class Date & Time</label>
                  <input type="datetime-local" style={inputStyle} value={contentForm.classDate} onChange={e => setContentForm({ ...contentForm, classDate: e.target.value })} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '700', fontSize: '0.85rem' }}>Duration (e.g. 90 min)</label>
                  <input style={inputStyle} placeholder="90 min" value={contentForm.classDuration} onChange={e => setContentForm({ ...contentForm, classDuration: e.target.value })} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '700', fontSize: '0.85rem' }}>Class Link (Zoom/Meet)</label>
                <input style={inputStyle} placeholder="https://zoom.us/j/..." value={contentForm.classLink} onChange={e => setContentForm({ ...contentForm, classLink: e.target.value })} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '700', fontSize: '0.85rem' }}>Max Students (0 = unlimited)</label>
                <input type="number" style={inputStyle} value={contentForm.maxStudents} onChange={e => setContentForm({ ...contentForm, maxStudents: e.target.value })} />
              </div>
            </>
          )}
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '700', fontSize: '0.85rem' }}>Thumbnail URL</label>
            <input style={inputStyle} placeholder="https://..." value={contentForm.thumbnail} onChange={e => setContentForm({ ...contentForm, thumbnail: e.target.value })} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '700', fontSize: '0.85rem' }}>Tags (comma separated)</label>
            <input style={inputStyle} placeholder="react, javascript, beginner" value={contentForm.tags} onChange={e => setContentForm({ ...contentForm, tags: e.target.value })} />
          </div>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' }}>
              <input type="checkbox" checked={contentForm.isPinned} onChange={e => setContentForm({ ...contentForm, isPinned: e.target.checked })} />
              📌 Pin to top
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' }}>
              <input type="checkbox" checked={contentForm.isPublished} onChange={e => setContentForm({ ...contentForm, isPublished: e.target.checked })} />
              🌐 Published
            </label>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', marginTop: '8px' }}>
            <Save size={16} /> {editingContent ? 'Update' : 'Create'}
          </button>
        </form>
      </div>
    </div>
  );

  // ─── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div className="bg-[var(--bg-primary)]" style={{ position: 'relative', minHeight: '100vh' }}>
      <DashboardStyles />

      <div className="container section-padding fade-in" style={{ paddingTop: '40px' }}>
        {showContentForm && <ContentForm type={contentForm.type} />}

        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '30px', 
          marginBottom: '50px' 
        }}>
          <div style={{ 
            background: 'linear-gradient(135deg, var(--accent-primary) 0%, #4338ca 100%)',
            padding: '50px 40px',
            borderRadius: '30px',
            color: 'white',
            boxShadow: '0 20px 40px -10px rgba(67, 56, 202, 0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Decorative background circle */}
            <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', filter: 'blur(30px)' }} />
            
            <h1 style={{ fontSize: '2.8rem', fontWeight: '900', letterSpacing: '-1px' }}>
              {isAdmin ? '⚡ Admin Control Center' : '🎓 Creator Studio'}
            </h1>
            <p style={{ opacity: 0.9, fontSize: '1.1rem', marginTop: '10px', maxWidth: '600px' }}>
              Manage your educational ecosystem with precision and power.
            </p>
          </div>

          <div className="glass-card" style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            padding: '12px', 
            gap: '8px', 
            width: '100%',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            border: '1px solid var(--glass-border)'
          }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setView(t.id)} 
                className={`btn ${view === t.id ? 'btn-primary' : ''}`}
                style={{ 
                  padding: '12px 20px', 
                  fontSize: '0.85rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  background: view === t.id ? undefined : 'transparent',
                  color: view === t.id ? 'white' : 'var(--text-secondary)',
                  flexShrink: 0
                }}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>

      {msg && <div style={{ background: 'var(--success)', color: 'white', padding: '14px 20px', borderRadius: '12px', marginBottom: '24px', fontWeight: '700' }}>✅ {msg}</div>}

      {/* ── CREATE COURSE ── */}
      {view === 'create' && (
        <form onSubmit={handleSubmitCourse} className="glass-card fade-in" style={{ padding: '50px', border: '1px solid var(--glass-border)' }}>
          <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '30px', marginBottom: '40px' }}>
             <h2 style={{ fontSize: '1.8rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '15px' }}><Plus size={32} /> {editingCourse ? 'Update Curriculum' : 'Draft New Course'}</h2>
             <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Define your course metadata and curriculum structure.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '24px' }}>
            <div><label style={{ display: 'block', marginBottom: '8px', fontWeight: '700' }}>Course Title</label><input className="input-field" placeholder="Course Title" value={courseForm.title} onChange={e => setCourseForm({ ...courseForm, title: e.target.value })} required /></div>
            <div><label style={{ display: 'block', marginBottom: '8px', fontWeight: '700' }}>Price (₹)</label><input className="input-field" type="number" placeholder="Price" value={courseForm.price} onChange={e => setCourseForm({ ...courseForm, price: e.target.value })} required /></div>
            <div><label style={{ display: 'block', marginBottom: '8px', fontWeight: '700' }}>Category</label>
              <select className="input-field" value={courseForm.category} onChange={e => setCourseForm({ ...courseForm, category: e.target.value })}>
                {['Web Development', 'Data Science', 'AI & Machine Learning', 'Cyber Security', 'Cloud Computing', 'Mobile Development', 'DevOps','Python', 'Full-Stack Developer', ''].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div><label style={{ display: 'block', marginBottom: '8px', fontWeight: '700' }}>Thumbnail URL</label><input className="input-field" placeholder="Image URL" value={courseForm.thumbnail} onChange={e => setCourseForm({ ...courseForm, thumbnail: e.target.value })} required /></div>
          </div>
          <div style={{ marginBottom: '24px' }}><label style={{ display: 'block', marginBottom: '8px', fontWeight: '700' }}>Description</label><textarea className="input-field" style={{ minHeight: '120px', resize: 'vertical' }} placeholder="Describe what students will learn..." value={courseForm.description} onChange={e => setCourseForm({ ...courseForm, description: e.target.value })} required /></div>
          <div style={{ marginBottom: '28px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '700', cursor: 'pointer', marginBottom: '10px' }}>
              <input type="checkbox" checked={courseForm.isBatch} onChange={e => setCourseForm({ ...courseForm, isBatch: e.target.checked })} />
              Is this a Live Batch?
            </label>
            {courseForm.isBatch && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr) repeat(2, 1fr)', gap: '14px' }}>
                <div><label style={{ display: 'block', fontSize: '0.82rem', marginBottom: '5px' }}>Start Date</label><input type="date" className="input-field" value={courseForm.startDate} onChange={e => setCourseForm({ ...courseForm, startDate: e.target.value })} required /></div>
                <div><label style={{ display: 'block', fontSize: '0.82rem', marginBottom: '5px' }}>Access Duration (Mos)</label><input type="number" className="input-field" value={courseForm.accessDuration} onChange={e => setCourseForm({ ...courseForm, accessDuration: e.target.value })} required /></div>
                <div><label style={{ display: 'block', fontSize: '0.82rem', marginBottom: '5px' }}>Batch Size (Max Seats)</label><input type="number" className="input-field" value={courseForm.maxStudents} onChange={e => setCourseForm({ ...courseForm, maxStudents: e.target.value })} required /></div>
                <div><label style={{ display: 'block', fontSize: '0.82rem', marginBottom: '5px' }}>Old Price (₹)</label><input type="number" className="input-field" value={courseForm.originalPrice} onChange={e => setCourseForm({ ...courseForm, originalPrice: e.target.value })} /></div>
              </div>
            )}
          </div>
          {/* Lessons */}
          <div style={{ marginBottom: '36px' }}>
            <h3 style={{ marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}><Video size={18} /> Lessons</h3>
            {courseForm.lessons.map((l, idx) => (
              <div key={idx} style={{ background: 'var(--bg-secondary)', padding: '20px', borderRadius: '14px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontWeight: '700', fontSize: '0.82rem', color: 'var(--accent-primary)' }}>Lesson {idx + 1}</span>
                  {courseForm.lessons.length > 1 && <button type="button" onClick={() => removeLesson(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}><Trash2 size={14} /> Remove</button>}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px', marginBottom: '10px' }}>
                  <input className="input-field" placeholder="Lesson Title" value={l.title} onChange={e => handleLessonChange(idx, 'title', e.target.value)} required />
                  <input className="input-field" placeholder="Duration (e.g. 45 min)" value={l.duration} onChange={e => handleLessonChange(idx, 'duration', e.target.value)} />
                </div>
                <textarea className="input-field" placeholder="Lesson description/notes" value={l.content} onChange={e => handleLessonChange(idx, 'content', e.target.value)} required />
              </div>
            ))}
            <button type="button" onClick={addLesson} className="btn" style={{ background: 'var(--bg-accent)' }}>+ Add Lesson</button>
          </div>
          {/* Quizzes */}
          <div style={{ marginBottom: '36px' }}>
            <h3 style={{ marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}><HelpCircle size={18} /> Quiz Questions</h3>
            {courseForm.quizzes.map((q, qIdx) => (
              <div key={qIdx} style={{ background: 'var(--bg-secondary)', padding: '20px', borderRadius: '14px', marginBottom: '12px' }}>
                <span style={{ fontWeight: '700', fontSize: '0.82rem', color: 'var(--accent-primary)', display: 'block', marginBottom: '10px' }}>Question {qIdx + 1}</span>
                <input className="input-field" style={{ marginBottom: '14px' }} placeholder="Enter question..." value={q.question} onChange={e => handleQuizChange(qIdx, 'question', e.target.value)} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '8px' }}>
                  {q.options.map((opt, oIdx) => (
                    <div key={oIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input type="radio" name={`correct-${qIdx}`} checked={q.correctAnswer === oIdx} onChange={() => handleQuizChange(qIdx, 'correctAnswer', oIdx)} />
                      <input className="input-field" placeholder={`Option ${oIdx + 1}`} value={opt} onChange={e => handleQuizOptionChange(qIdx, oIdx, e.target.value)} />
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Select radio button next to the correct answer</p>
              </div>
            ))}
            <button type="button" onClick={addQuiz} className="btn" style={{ background: 'var(--bg-accent)' }}>+ Add Question</button>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '18px' }}><Save /> {editingCourse ? 'Update Curriculum' : 'Create Course Structure'}</button>
        </form>
      )}

      {/* ── MANAGE COURSES ── */}
      {view === 'manage' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
          {courses.length === 0 && (
            <div className="glass-card" style={{ padding: '80px 40px', textAlign: 'center', gridColumn: '1/-1' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--bg-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'var(--text-secondary)' }}>
                <BookOpen size={40} />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '800' }}>No Courses Yet</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>Your library is empty. Start by creating your first course structure.</p>
              <button onClick={() => setView('create')} className="btn btn-primary" style={{ margin: '0 auto' }}><Plus size={16} /> New Course</button>
            </div>
          )}
          {courses.map(c => (
            <div key={c._id} className="glass-card admin-card-glow" style={{ padding: '24px', transition: 'all 0.3s ease' }}>
              <div onClick={() => navigate(`/courses/${c._id}`)} style={{ cursor: 'pointer', position: 'relative', width: '100%', height: '180px', borderRadius: '16px', overflow: 'hidden', marginBottom: '20px', boxShadow: '0 8px 16px -4px rgba(0,0,0,0.1)' }}>
                <img src={c.thumbnail?.startsWith('http') ? c.thumbnail : `${ASSET_URL}${c.thumbnail}`} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} alt={c.title} />
                <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                   <Badge color={c.isBatch ? '#f59e0b' : '#10b981'}>{c.isBatch ? 'BATCH' : 'VOD'}</Badge>
                </div>
                <label onClick={e => e.stopPropagation()} style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', color: 'white', padding: '6px 12px', borderRadius: '10px', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Upload size={14} /> Update Cover
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleThumbnailUpload(c._id, e.target.files[0])} />
                </label>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h3 onClick={() => navigate(`/courses/${c._id}`)} style={{ cursor: 'pointer', fontSize: '1.25rem', fontWeight: '900', color: 'var(--text-primary)', lineHeight: 1.2 }}>{c.title}</h3>
                  {isAdmin && (
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button title="Edit Details" onClick={() => handleEditCourse(c)} style={{ color: 'var(--accent-primary)', background: 'rgba(99,102,241,0.1)', border: 'none', cursor: 'pointer', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Edit3 size={16} /></button>
                      <button title="Delete Course" onClick={async () => { if (window.confirm('Delete this course?')) { await API.delete(`/courses/${c._id}`); fetchMyCourses(); } }} style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)', border: 'none', cursor: 'pointer', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Trash2 size={16} /></button>
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <span className="status-badge" style={{ background: 'var(--bg-accent)', color: 'var(--text-secondary)' }}>{c.category}</span>
                  <span className="status-badge" style={{ background: 'var(--bg-accent)', color: 'var(--text-secondary)' }}>₹{c.price}</span>
                  <span className="status-badge" style={{ background: 'var(--bg-accent)', color: 'var(--text-secondary)' }}>{c.lessons.length} Modules</span>
                </div>
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '15px' }}>
                <p style={{ fontWeight: '800', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Curriculum Management</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {c.lessons.map((l, lIdx) => (
                    <div key={lIdx} style={{ fontSize: '0.85rem', padding: '12px', background: 'var(--bg-accent)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{lIdx + 1}. {l.title}</span>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <label className="btn" style={{ fontSize: '0.65rem', padding: '4px 8px', borderRadius: '6px', background: l.videoFile ? 'var(--success)' : 'transparent', color: l.videoFile ? 'white' : 'var(--text-secondary)', border: l.videoFile ? 'none' : '1px solid var(--border)', cursor: 'pointer' }}>
                          <Video size={12} /> {l.videoFile ? 'Video' : 'Add'}
                          <input type="file" accept="video/*" style={{ display: 'none' }} onChange={e => handleFileUpload(c._id, lIdx, 'Video', e.target.files[0])} disabled={uploading} />
                        </label>
                        <label className="btn" style={{ fontSize: '0.65rem', padding: '4px 8px', borderRadius: '6px', background: l.pdfFile ? '#3b82f6' : 'transparent', color: l.pdfFile ? 'white' : 'var(--text-secondary)', border: l.pdfFile ? 'none' : '1px solid var(--border)', cursor: 'pointer' }}>
                          <FileText size={12} /> {l.pdfFile ? 'PDF' : 'Add'}
                          <input type="file" accept=".pdf" style={{ display: 'none' }} onChange={e => handleFileUpload(c._id, lIdx, 'PDF', e.target.files[0])} disabled={uploading} />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── STUDENTS / SUBMISSIONS ── */}
      {view === 'submissions' && (
        <div className="glass-card" style={{ padding: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
             <h2 style={sectionTitle}><Users /> Learner Submissions</h2>
             <div style={{ padding: '8px 16px', background: 'var(--bg-accent)', borderRadius: '10px', fontSize: '0.85rem', fontWeight: '700' }}>
               Total: {courses.reduce((acc, c) => acc + c.submissions.length, 0)}
             </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '20px' }}>
            {courses.flatMap(c => c.submissions.map(s => ({ ...s, courseTitle: c.title }))).length === 0
              ? <div style={{ textAlign: 'center', padding: '40px', gridColumn: '1/-1' }}>No student submissions yet.</div>
              : courses.flatMap(c => c.submissions.map(s => (
                <div key={s._id} className="glass-card admin-card-glow" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '15px', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>{s.student?.name?.[0] || '?'}</div>
                      <div>
                        <p style={{ fontWeight: '800', lineHeight: 1.2 }}>{s.student?.name || 'Unknown'}</p>
                        <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Course Enrollment</p>
                      </div>
                    </div>
                    <Badge color="#6366f1">{s.courseTitle}</Badge>
                  </div>
                  <div style={{ padding: '15px', background: 'rgba(255,255,255,0.4)', borderRadius: '12px', border: '1px solid var(--border)', fontSize: '0.9rem' }}>
                    <p style={{ fontWeight: '700', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}><Video size={14} /> LESSON {s.lessonIdx + 1}</p>
                    {s.comment ? <p style={{ fontStyle: 'italic', color: 'var(--text-primary)' }}>"{s.comment}"</p> : <p style={{ color: 'var(--text-secondary)' }}>No comments provided.</p>}
                  </div>
                  <a href={`${ASSET_URL}${s.fileUrl}`} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ width: '100%' }}>View Deliverable <PlayCircle size={16} /></a>
                </div>
              )))
            }
          </div>
        </div>
      )}

      {/* ── ALL USERS (Admin only) ── */}
      {view === 'users' && isAdmin && (
        <div>
          {stats && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
              {[
                { label: 'Total Base', value: stats.totalUsers, color: '#6366f1', icon: <Users size={28} /> },
                { label: 'Learners', value: stats.totalStudents, color: '#10b981', icon: <BookOpen size={28} /> },
                { label: 'Instructors', value: stats.totalTeachers, color: '#f59e0b', icon: <Layout size={28} /> },
                { label: 'Guardians', value: stats.totalAdmins, color: '#ef4444', icon: <Shield size={28} /> },
              ].map(s => (
                <div key={s.label} className="glass-card" style={{ 
                  padding: '30px', 
                  display: 'flex', 
                  flexDirection: 'column',
                  gap: '20px',
                  background: 'var(--glass-bg)',
                  border: '1px solid var(--glass-border)',
                  boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)',
                  transition: 'transform 0.3s ease'
                }} 
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div style={{ 
                    background: s.color + '15', 
                    padding: '16px', 
                    borderRadius: '16px', 
                    color: s.color, 
                    width: 'fit-content',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>{s.icon}</div>
                  <div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>{s.label}</p>
                    <p style={{ fontSize: '2.4rem', fontWeight: '900', color: 'var(--text-primary)', letterSpacing: '-1px' }}>{s.value}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="glass-card" style={{ padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ ...sectionTitle, marginBottom: 0 }}><Shield /> User Management</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Filter by Role:</span>
                <select 
                  className="input-field" 
                  style={{ width: '140px', padding: '8px 12px' }}
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="all">All Users</option>
                  <option value="student">Students</option>
                  <option value="teacher">Teachers</option>
                  <option value="admin">Admins</option>
                </select>
              </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)' }}>
                    {['User', 'Email', 'Role', 'Status', 'Actions'].map(h => <th key={h} style={{ padding: '14px', fontWeight: '800', fontSize: '0.82rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {allUsers
                    .filter(u => roleFilter === 'all' || u.role === roleFilter)
                    .map(u => (
                    <tr key={u._id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img 
                            src={u.avatar ? (u.avatar.startsWith('http') ? u.avatar : `${ASSET_URL}${u.avatar}`) : "https://cdn-icons-png.flaticon.com/128/3177/3177440.png"} 
                            style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border)' }} 
                            alt={u.name} 
                          />
                          <span style={{ fontWeight: '700' }}>{u.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '14px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{u.email}</td>
                      <td style={{ padding: '14px' }}>
                        <select value={u.role} onChange={e => handleUpdateUserRole(u._id, e.target.value)}
                          style={{ ...inputStyle, padding: '6px 10px', width: 'auto', border: `1px solid ${roleColor[u.role]}`, color: roleColor[u.role], fontWeight: '700', background: roleColor[u.role] + '18' }}>
                          <option value="student">Student</option>
                          <option value="teacher">Teacher</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td style={{ padding: '14px' }}>
                        <Badge color={u.isBlocked ? '#ef4444' : '#10b981'}>{u.isBlocked ? 'BLOCKED' : 'ACTIVE'}</Badge>
                      </td>
                      <td style={{ padding: '14px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => handleEditUser(u)} style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid #6366f1', color: '#6366f1', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.78rem' }}>Edit</button>
                          {u._id !== user._id && (
                            <>
                              <button onClick={() => handleBlockUser(u._id)} style={{ border: `1px solid ${u.isBlocked ? '#10b981' : '#f59e0b'}`, color: u.isBlocked ? '#10b981' : '#f59e0b', background: 'none', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.78rem' }}>
                                {u.isBlocked ? 'Unblock' : 'Block'}
                              </button>
                              <button onClick={() => handleDeleteUser(u._id)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem' }}>
                                <Trash2 size={14} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── CONTENT (Articles/Announcements) ── */}
      {view === 'content' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '14px' }}>
            <h2 style={sectionTitle}><Megaphone /> Content Manager</h2>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => openContentForm('article')} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><BookOpen size={16} /> New Article</button>
              <button onClick={() => openContentForm('announcement')} className="btn" style={{ background: '#f59e0b', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}><Megaphone size={16} /> Announcement</button>
            </div>
          </div>
          {contentList.length === 0
            ? <div className="glass-card" style={{ padding: '50px', textAlign: 'center' }}><BookOpen size={48} style={{ color: 'var(--text-secondary)', marginBottom: '16px' }} /><h3>No content yet</h3><p style={{ color: 'var(--text-secondary)' }}>Create your first article or announcement</p></div>
            : <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {contentList.map(item => (
                <div key={item._id} className="glass-card" style={{ padding: '22px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                      {item.isPinned && <span style={{ fontSize: '0.75rem' }}>📌</span>}
                      <Badge color={item.type === 'announcement' ? '#f59e0b' : '#6366f1'}>{item.type.toUpperCase()}</Badge>
                      <Badge color={item.isPublished ? '#10b981' : '#6b7280'}>{item.isPublished ? 'PUBLISHED' : 'DRAFT'}</Badge>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{new Date(item.createdAt).toLocaleDateString()}</span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>👁 {item.views}</span>
                    </div>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '6px' }}>{item.title}</h3>
                    {item.body && <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: '1.5' }}>{item.body.slice(0, 160)}{item.body.length > 160 ? '...' : ''}</p>}
                    {(item.tags || []).length > 0 && <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>{item.tags.map(tag => <span key={tag} style={{ background: 'var(--bg-accent)', padding: '2px 10px', borderRadius: '20px', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>#{tag}</span>)}</div>}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                    <button onClick={() => openContentForm(item.type, item)} style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid #6366f1', color: '#6366f1', padding: '7px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem' }}><Edit3 size={14} /> Edit</button>
                    {isAdmin && <button onClick={() => handleDeleteContent(item._id)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '7px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem' }}><Trash2 size={14} /></button>}
                  </div>
                </div>
              ))}
            </div>
          }
        </div>
      )}

      {/* ── FREE VIDEOS ── */}
      {view === 'videos' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '14px' }}>
            <h2 style={sectionTitle}><Video /> Free Video Library</h2>
            <button onClick={() => openContentForm('video')} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Plus size={16} /> Add Free Video</button>
          </div>
          {contentList.length === 0
            ? <div className="glass-card" style={{ padding: '50px', textAlign: 'center' }}><Video size={48} style={{ color: 'var(--text-secondary)', marginBottom: '16px' }} /><h3>No free videos yet</h3><p style={{ color: 'var(--text-secondary)' }}>Add YouTube links or upload videos</p></div>
            : <div className="grid-courses">
              {contentList.map(item => (
                <div key={item._id} className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                  <div style={{ position: 'relative' }}>
                    {item.videoUrl
                      ? <iframe src={item.videoUrl} style={{ width: '100%', height: '180px', border: 'none', display: 'block' }} title={item.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                      : item.thumbnail
                        ? <img src={item.thumbnail?.startsWith('http') ? item.thumbnail : `${ASSET_URL}${item.thumbnail}`} style={{ width: '100%', height: '180px', objectFit: 'cover' }} alt={item.title} />
                        : <div style={{ width: '100%', height: '180px', background: 'var(--bg-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Video size={48} style={{ color: 'var(--text-secondary)' }} /></div>
                    }
                    <div style={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', gap: '6px' }}>
                      <Badge color={item.isPublished ? '#10b981' : '#6b7280'}>{item.isPublished ? 'LIVE' : 'DRAFT'}</Badge>
                    </div>
                  </div>
                  <div style={{ padding: '16px' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '6px' }}>{item.title}</h3>
                    {item.body && <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>{item.body.slice(0, 80)}...</p>}
                    {!item.videoFile && !item.videoUrl && (
                      <label className="btn" style={{ fontSize: '0.72rem', width: '100%', justifyContent: 'center', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-accent)', marginBottom: '10px' }}>
                        <Upload size={12} /> Upload Video File
                        <input type="file" accept="video/*" style={{ display: 'none' }} onChange={e => handleContentVideoUpload(item._id, e.target.files[0])} />
                      </label>
                    )}
                    {item.videoFile && (
                      <div style={{ marginBottom: '10px' }}>
                        <video src={`${ASSET_URL}${item.videoFile}`} controls style={{ width: '100%', borderRadius: '8px', maxHeight: '120px' }} />
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => openContentForm(item.type, item)} style={{ flex: 1, background: 'rgba(99,102,241,0.1)', border: '1px solid #6366f1', color: '#6366f1', padding: '7px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', fontSize: '0.76rem' }}><Edit3 size={14} /> Edit</button>
                      {isAdmin && <button onClick={() => handleDeleteContent(item._id)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '7px 10px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.76rem' }}><Trash2 size={14} /></button>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          }
        </div>
      )}

      {/* ── LIVE CLASSES ── */}
      {view === 'classes' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '14px' }}>
            <h2 style={sectionTitle}><Calendar /> Live Classes</h2>
            <button onClick={() => openContentForm('class')} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Plus size={16} /> Schedule Class</button>
          </div>
          {contentList.length === 0
            ? <div className="glass-card" style={{ padding: '50px', textAlign: 'center' }}><Calendar size={48} style={{ color: 'var(--text-secondary)', marginBottom: '16px' }} /><h3>No live classes scheduled</h3><p style={{ color: 'var(--text-secondary)' }}>Schedule your first live class</p></div>
            : <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {contentList.map(item => {
                const classDate = item.classDate ? new Date(item.classDate) : null;
                const isUpcoming = classDate && classDate > new Date();
                return (
                  <div key={item._id} className="glass-card" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', borderLeft: `4px solid ${isUpcoming ? '#10b981' : '#6b7280'}` }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                        <Badge color={isUpcoming ? '#10b981' : '#6b7280'}>{isUpcoming ? 'UPCOMING' : 'PAST'}</Badge>
                        <Badge color={item.isPublished ? '#6366f1' : '#6b7280'}>{item.isPublished ? 'PUBLISHED' : 'DRAFT'}</Badge>
                        {(item.enrolledStudents || []).length > 0 && <Badge color="#f59e0b">{item.enrolledStudents.length} enrolled</Badge>}
                      </div>
                      <h3 style={{ fontSize: '1.15rem', marginBottom: '6px' }}>{item.title}</h3>
                      {item.body && <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>{item.body}</p>}
                      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '0.83rem', color: 'var(--text-secondary)' }}>
                        {classDate && <span>📅 {classDate.toLocaleString()}</span>}
                        {item.classDuration && <span>⏱ {item.classDuration}</span>}
                        {item.maxStudents > 0 && <span>👥 Max {item.maxStudents} students</span>}
                        {item.classLink && <a href={item.classLink} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}><Link2 size={14} /> Join Link</a>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                      <button onClick={() => openContentForm(item.type, item)} style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid #6366f1', color: '#6366f1', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem' }}><Edit3 size={14} /> Edit</button>
                      {isAdmin && <button onClick={() => handleDeleteContent(item._id)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}><Trash2 size={14} /></button>}
                    </div>
                  </div>
                );
              })}
            </div>
          }
        </div>
      )}

      {/* ── ENQUIRIES ── */}
      {view === 'enquiries' && isAdmin && (
        <div className="glass-card" style={{ padding: '30px' }}>
          <h2 style={sectionTitle}><HelpCircle /> Student Enquiries</h2>
          {enquiries.length === 0
            ? <p style={{ color: 'var(--text-secondary)' }}>No enquiries found.</p>
            : <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)' }}>
                    {['Date', 'Student', 'Course', 'Message', 'Status', 'Action'].map(h => <th key={h} style={{ padding: '14px', fontWeight: '800', fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {enquiries.map(e => (
                    <tr key={e._id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '14px', fontSize: '0.82rem' }}>{new Date(e.createdAt).toLocaleDateString()}</td>
                      <td style={{ padding: '14px' }}><div style={{ fontWeight: '700' }}>{e.name}</div><div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{e.email}</div><div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{e.phone}</div></td>
                      <td style={{ padding: '14px', fontSize: '0.88rem' }}>{e.course}</td>
                      <td style={{ padding: '14px', color: 'var(--text-secondary)', fontSize: '0.85rem', maxWidth: '200px' }}>{e.message}</td>
                      <td style={{ padding: '14px' }}><Badge color={e.status === 'pending' ? '#f59e0b' : '#10b981'}>{e.status.toUpperCase()}</Badge></td>
                      <td style={{ padding: '14px' }}>
                        <button onClick={() => handleUpdateEnquiryStatus(e._id, e.status)} className="btn" style={{ fontSize: '0.75rem', padding: '6px 12px', background: 'var(--bg-accent)' }}>
                          {e.status === 'pending' ? '✓ Resolve' : '↩ Reopen'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          }
        </div>
      )}
      {/* ── USER EDIT MODAL ── */}
      {editingUser && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '500px', padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontWeight: '800' }}>Edit User: {editingUser.name}</h3>
              <button onClick={() => setEditingUser(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleUserUpdateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div><label style={{ fontSize: '0.8rem', fontWeight: '700' }}>Name</label><input style={inputStyle} value={userEditForm.name} onChange={e => setUserEditForm({...userEditForm, name: e.target.value})} required /></div>
              <div><label style={{ fontSize: '0.8rem', fontWeight: '700' }}>Email</label><input style={inputStyle} value={userEditForm.email} onChange={e => setUserEditForm({...userEditForm, email: e.target.value})} required /></div>
              <div><label style={{ fontSize: '0.8rem', fontWeight: '700' }}>Occupation</label><input style={inputStyle} value={userEditForm.occupation} onChange={e => setUserEditForm({...userEditForm, occupation: e.target.value})} /></div>
              <div><label style={{ fontSize: '0.8rem', fontWeight: '700' }}>Phone Number</label><input style={inputStyle} value={userEditForm.phoneNumber} onChange={e => setUserEditForm({...userEditForm, phoneNumber: e.target.value})} /></div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '700' }}>Role</label>
                <select style={inputStyle} value={userEditForm.role} onChange={e => setUserEditForm({...userEditForm, role: e.target.value})}>
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary" style={{ marginTop: '10px', padding: '12px' }}>Save Changes</button>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default AdminDashboard;
