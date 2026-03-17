import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { Play, ChevronLeft, ChevronRight, CheckCircle, FileText, HelpCircle, ArrowLeft, Download, Upload, MessageSquare, PlayCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Lesson = () => {
    const { courseId, lessonIdx } = useParams();
    const [course, setCourse] = useState(null);
    const idx = parseInt(lessonIdx);
    const { user, token, updateProgress } = useAuth();
    const navigate = useNavigate();

    // Submission states
    const [file, setFile] = useState(null);
    const [comment, setComment] = useState('');
    const [uploading, setUploading] = useState(false);

    // Progress calculation
    const courseProgressMap = user?.progress || {};
    const completedLessons = courseProgressMap[courseId] || [];
    const isCompleted = completedLessons.includes(idx);

    useEffect(() => {
        const fetchCourse = async () => {
            const { data } = await API.get(`/courses/${courseId}`);
            setCourse(data);
        };
        fetchCourse();
    }, [courseId]);

    const handleComplete = async () => {
        await updateProgress(courseId, idx);
    };

    const handleSubmission = async (e) => {
        e.preventDefault();
        if (!file) return alert('Please select a file');
        
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('lessonIdx', idx);
        formData.append('comment', comment);

        try {
            await API.post(`/courses/${courseId}/submissions`, formData, {
                headers: { 
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('Work submitted successfully!');
            setFile(null);
            setComment('');
        } catch (error) {
            alert('Submission failed');
        } finally {
            setUploading(false);
        }
    };

    if (!course) return <div className="container section-padding">Loading...</div>;
    const currentLesson = course.lessons[idx];

    if (!currentLesson) {
        return (
            <div className="container section-padding" style={{ textAlign: 'center' }}>
                <h1 style={{ marginBottom: '20px' }}>Lesson Not Found</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>This batch class might not be live yet or the orientation is being scheduled.</p>
                <Link to="/profile" className="btn btn-primary">Back to My Batches</Link>
            </div>
        );
    }

    // Video Source Logic: Prefer uploaded videoFile over videoUrl
    const videoSrc = currentLesson.videoFile 
        ? `${API.defaults.baseURL.replace('/api', '')}${currentLesson.videoFile}` 
        : currentLesson.videoUrl;

    const isYoutube = videoSrc?.includes('youtube.com') || videoSrc?.includes('youtu.be');

    return (
        <div style={{ background: 'var(--bg-secondary)', minHeight: '100vh', display: 'flex' }}>
            {/* Sidebar Curriculum */}
            <div className="glass-card" style={{ width: '350px', height: '100vh', position: 'sticky', top: 0, borderRadius: 0, borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '30px', borderBottom: '1px solid var(--border)' }}>
                   <Link to={`/courses/${courseId}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem', marginBottom: '15px' }}>
                        <ArrowLeft size={16} /> Back to Course
                   </Link>
                   <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>{course.title}</h3>
                   <div style={{ marginTop: '15px', background: 'var(--bg-accent)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: 'var(--success)', width: `${(completedLessons.length / course.lessons.length) * 100}%`, transition: 'width 0.4s ease' }} />
                   </div>
                   <p style={{ fontSize: '0.75rem', marginTop: '8px', color: 'var(--text-secondary)' }}>{Math.round((completedLessons.length / course.lessons.length) * 100)}% Complete</p>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: '15px' }}>
                    {course.lessons.map((l, i) => (
                        <Link 
                            to={`/lessons/${courseId}/${i}`} 
                            key={i} 
                            style={{ 
                                textDecoration: 'none', 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '15px', 
                                padding: '15px 20px', 
                                borderRadius: '12px', 
                                background: i === idx ? 'var(--accent-primary)' : 'transparent',
                                color: i === idx ? 'white' : 'var(--text-primary)',
                                marginBottom: '8px',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                opacity: completedLessons.includes(i) || i <= completedLessons.length ? 1 : 0.6
                            }}
                        >
                            <span style={{ opacity: 0.6 }}>{i + 1}</span>
                            <span>{l.title}</span>
                            {completedLessons.includes(i) && <CheckCircle size={16} style={{ marginLeft: 'auto', color: i === idx ? 'white' : 'var(--success)' }} />}
                        </Link>
                    ))}
                    <Link to={`/quiz/${courseId}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '15px', padding: '15px 20px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)', fontWeight: '700', marginTop: '20px' }}>
                        <HelpCircle size={20} /> Course Quiz
                    </Link>
                </div>
            </div>

            {/* Main Video/Content Area */}
            <div style={{ flex: 1, padding: '40px' }}>
                <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto' }}>
                    <div style={{ height: '560px', background: '#000', borderRadius: '24px', overflow: 'hidden', marginBottom: '40px', boxShadow: 'var(--shadow)' }}>
                        {isYoutube ? (
                            <iframe 
                                width="100%" 
                                height="100%" 
                                src={videoSrc} 
                                title="YouTube video player" 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                            ></iframe>
                        ) : videoSrc ? (
                            <video controls width="100%" height="100%" src={videoSrc}></video>
                        ) : (
                            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexDirection: 'column', gap: '20px' }}>
                                <PlayCircle size={80} opacity={0.3} />
                                <p>No video lecture available for this lesson yet.</p>
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                        <span className="badge badge-primary">{course.category}</span>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Instructor: <strong>{course.instructor}</strong></span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                        <div>
                            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '10px' }}>{currentLesson.title}</h1>
                            <button 
                                onClick={handleComplete} 
                                className="btn" 
                                style={{ 
                                    background: isCompleted ? 'var(--success)' : 'var(--bg-accent)', 
                                    color: isCompleted ? 'white' : 'var(--text-primary)',
                                    padding: '8px 20px',
                                    fontSize: '0.9rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                            >
                                {isCompleted ? <><CheckCircle size={16} /> Completed</> : "Mark as Complete"}
                            </button>
                        </div>
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <button 
                                disabled={idx === 0} 
                                onClick={() => navigate(`/lessons/${courseId}/${idx - 1}`)}
                                className="btn" 
                                style={{ background: 'var(--bg-accent)', opacity: idx === 0 ? 0.5 : 1 }}
                            >
                                <ChevronLeft /> Previous
                            </button>
                            <button 
                                disabled={idx === course.lessons.length - 1} 
                                onClick={() => navigate(`/lessons/${courseId}/${idx + 1}`)}
                                className="btn btn-primary"
                                style={{ opacity: idx === course.lessons.length - 1 ? 0.5 : 1 }}
                            >
                                Next Lesson <ChevronRight />
                            </button>
                        </div>
                    </div>

                    <div className="glass-card" style={{ padding: '30px', marginBottom: '40px' }}>
                        <h3 style={{ marginBottom: '15px', color: 'var(--accent-primary)', fontSize: '1.4rem' }}>Class Description</h3>
                        <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)', fontSize: '1.1rem', whiteSpace: 'pre-wrap' }}>
                            {currentLesson.content}
                        </p>
                    </div>

                    <div style={{ marginBottom: '40px', borderTop: '1px solid var(--border)', paddingTop: '40px' }}>
                        <h3 style={{ marginBottom: '15px', fontSize: '1.4rem' }}>Course Overview</h3>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>{course.description}</p>
                    </div>

                    <div className="grid-courses" style={{ gridTemplateColumns: '1fr 1fr', gap: '30px', alignItems: 'start' }}>
                        <div className="glass-card" style={{ padding: '40px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                                <h2 style={{ fontSize: '1.5rem' }}>Lesson Notes</h2>
                                {currentLesson.pdfFile && (
                                    <a href={`${API.defaults.baseURL.replace('/api', '')}${currentLesson.pdfFile}`} target="_blank" rel="noreferrer" className="btn" style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-accent)', textDecoration: 'none' }}>
                                        <Download size={16} /> Download PDF
                                    </a>
                                )}
                            </div>
                            <p style={{ whiteSpace: 'pre-wrap', color: 'var(--text-secondary)', lineHeight: '1.8' }}>{currentLesson.content}</p>
                        </div>

                        <div className="glass-card" style={{ padding: '40px', border: '2px dashed var(--border)' }}>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}><Upload /> Submit Your Work</h2>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '25px' }}>Upload your project video or technical report (PDF) for review.</p>
                            
                            <form onSubmit={handleSubmission}>
                                <div style={{ marginBottom: '20px' }}>
                                    <label className="btn" style={{ width: '100%', padding: '20px', border: '1px solid var(--border)', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer' }}>
                                        {file ? <CheckCircle color="var(--success)" /> : <FileText />}
                                        {file ? file.name : "Select File (Video/PDF)"}
                                        <input type="file" accept="video/*,.pdf" style={{ display: 'none' }} onChange={(e) => setFile(e.target.files[0])} />
                                    </label>
                                </div>
                                <div style={{ marginBottom: '25px' }}>
                                    <textarea 
                                        className="input-field" 
                                        placeholder="Add a comment for the instructor..." 
                                        style={{ minHeight: '100px' }} 
                                        value={comment} 
                                        onChange={(e) => setComment(e.target.value)}
                                    />
                                </div>
                                <button type="submit" disabled={uploading} className="btn btn-primary" style={{ width: '100%' }}>
                                    {uploading ? "Uploading..." : "Submit Assignment"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Lesson;
