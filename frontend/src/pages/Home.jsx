import React, { useEffect, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { ChevronRight, Play, Users, Star, GraduationCap, Code, TrendingUp, Heart, Award, ShieldCheck, ArrowRight, Briefcase, UserCheck, Rocket, Clock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import CheckoutModal from '../components/CheckoutModal';
import class1 from '../assets/class1.png';
import class2 from '../assets/class2.png';
import EnquiryModal from '../components/EnquiryModal';
import HeroSlider from '../components/HeroSlider';

const Home = () => {
    const [courses, setCourses] = useState([]);
    const [batches, setBatches] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [liveClasses, setLiveClasses] = useState([]);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
    const [enquirySubject, setEnquirySubject] = useState('');
    const { user, enrollInCourse, toggleFavorite } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                const [coursesRes, classesRes] = await Promise.all([
                    API.get('/courses'),
                    API.get('/content?type=class')
                ]);
                setCourses(coursesRes.data.filter(c => !c.isBatch).slice(0, 3));
                setBatches(coursesRes.data.filter(c => c.isBatch));
                setLiveClasses(classesRes.data.slice(0, 3));
            } catch (err) {
                console.error(err);
            }
        };
        fetchHomeData();
    }, []);

    const handleEnroll = (courseId) => {
        if (!user) {
            navigate('/login');
            return;
        }
        const course = batches.find(b => b._id === courseId);
        setSelectedCourse(course);
        setIsCheckoutOpen(true);
    };

    const handlePaymentComplete = async (courseId) => {
        setIsCheckoutOpen(false);
        await enrollInCourse(courseId);
        navigate('/profile');
    };

    const features = [
        { icon: <Code />, title: "Real Project Coding", desc: "Build industry-standard projects while you learn." },
        { icon: <Users />, title: "Expert Mentorship", desc: "Get feedback from experienced software engineers." },
        { icon: <Star />, title: "Verified Certificates", desc: "Industry-recognized certification upon completion." },
    ];

    return (
        <div className="bg-[var(--bg-primary)] min-h-screen fade-in">
            {/* Mesh background removed to show clean #F4F6F9 background */}

            
            <HeroSlider onEnquiryClick={() => setIsEnquiryOpen(true)} />

            {/* Features Section */}
            <section className="section-padding relative overflow-hidden">
                <div className="container">
                    <div className="grid-courses" style={{ textAlign: 'center' }}>
                        {features.map((f, i) => (
                            <div key={i} className="glass-card" style={{ padding: '40px' }}>
                                <div style={{ background: 'var(--accent-primary)', width: '60px', height: '60px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'white' }}>
                                    {f.icon}
                                </div>
                                <h3 style={{ marginBottom: '16px', fontSize: '1.5rem' }}>{f.title}</h3>
                                <p style={{ color: 'var(--text-secondary)' }}>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Platform Showcase Section */}
            <section className="section-padding">
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', position: 'relative' }}>
                            <div className="glass-card" style={{ padding: '0', overflow: 'hidden', borderRadius: '24px', transform: 'translateY(-20px)' }}>
                                <img src={class1} style={{ width: '100%', height: '350px', objectFit: 'cover' }} alt="Coding Study" />
                            </div>
                            <div className="glass-card" style={{ padding: '0', overflow: 'hidden', borderRadius: '24px', transform: 'translateY(20px)' }}>
                                <img src={class2} style={{ width: '100%', height: '350px', objectFit: 'cover' }} alt="Coding Discussion" />
                            </div>
                            {/* Accent blur */}
                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate( -50%, -50%)', width: '200px', height: '200px', background: 'var(--accent-primary)', filter: 'blur(100px)', opacity: 0.1, zIndex: -1 }}></div>
                        </div>
                        
                        <div>
                            <span className="badge badge-primary" style={{ marginBottom: '20px' }}>The Learning Experience</span>
                            <h2 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '24px', lineHeight: '1.2' }}>Immersive Study for <br/> Modern Engineers</h2>
                            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '30px', lineHeight: '1.8', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <img src="/logo_dark.png" style={{ width: '40px', height: '40px', borderRadius: '10px' }} alt="C-C" />
                                    <span>At <strong>Coding Classes</strong>, we don't just teach syntax—we build engineers. Our high-fidelity learning environment combines professional-grade tools with expert guidance.</span>
                                </span>
                                <br/><br/>
                                Experience live pair programming, interactive technical labs, and a curriculum designed by industry veterans from the world's leading tech hubs.
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '600' }}>
                                    <div style={{ color: 'var(--success)' }}><TrendingUp size={20}/></div>
                                    <span>High-Performance Learning Environment</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '600' }}>
                                    <div style={{ color: 'var(--success)' }}><TrendingUp size={20}/></div>
                                    <span>Interactive 1:1 Expert Feedback</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Popular Courses Preview */}
            <section className="section-padding">
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '50px' }}>
                        <div>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: '800' }}>Featured Courses</h2>
                            <p style={{ color: 'var(--text-secondary)' }}>Handpicked by our expert instructors</p>
                        </div>
                        <Link to="/courses" style={{ color: 'var(--accent-primary)', fontWeight: '700', textDecoration: 'none' }}>See all courses</Link>
                    </div>

                    <div className="grid-courses">
                        {courses.map((course) => (
                            <Link to={`/courses/${course._id}`} key={course._id} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div className="glass-card fade-in" style={{ overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <img src={course.thumbnail} style={{ width: '100%', height: '200px', objectFit: 'cover' }} alt={course.title} />
                                    <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                            <span className="badge badge-primary">{course.category}</span>
                                            <span style={{ fontWeight: '700', color: 'var(--accent-primary)' }}>₹{course.price}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <h3 style={{ marginBottom: '8px', flex: 1 }}>{course.title}</h3>
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{course.description}</p>
                                            <button 
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    toggleFavorite(course._id);
                                                }}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '5px' }}
                                            >
                                                <Heart 
                                                    size={18} 
                                                    color={user?.favorites?.some(f => (f._id || f) === course._id) ? '#ef4444' : 'var(--text-secondary)'} 
                                                    fill={user?.favorites?.some(f => (f._id || f) === course._id) ? '#ef4444' : 'none'}
                                                />
                                            </button>
                                        </div>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>{course.instructor}</p>
                                        <div style={{ marginTop: 'auto', display: 'flex', gap: '15px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Play size={14} /> {course.lessons.length} Lessons</span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Star size={14} fill="var(--accent-primary)" stroke="none" /> 4.9</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Exclusive Live Batches & Discounts */}
            <section id="batches" className="section-padding" style={{ borderTop: '1px solid var(--border)', background: 'rgba(255, 255, 255, 0.02)' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <h2 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '15px' }}>Upcoming Live Batches</h2>
                        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>Grab the limited-time early bird discounts on our most popular immersive bootcamps.</p>
                    </div>

                    <div className="grid-courses">
                        {batches.map((batch, i) => (
                            <div key={batch._id} className="glass-card fade-in" style={{ overflow: 'hidden', border: i === 0 ? '2px solid var(--accent-primary)' : 'none' }}>
                                <div style={{ position: 'relative' }}>
                                    <img src={batch.thumbnail} style={{ width: '100%', height: '240px', objectFit: 'cover' }} />
                                    {batch.originalPrice && (
                                        <>
                                            <div style={{ position: 'absolute', top: '20px', right: '20px', background: '#ef4444', color: 'white', padding: '5px 15px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: '800', zIndex: 10 }}>
                                                {Math.round((1 - batch.price / batch.originalPrice) * 100)}% OFF
                                            </div>
                                            <div style={{ position: 'absolute', top: '20px', left: '20px', background: 'var(--accent-primary)', color: 'white', padding: '5px 15px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: '900', zIndex: 10, letterSpacing: '1px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                                                LIMITED TIME OFFER ⏳
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div style={{ padding: '30px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                                        <h3 style={{ fontSize: '1.4rem', flex: 1 }}>{batch.title}</h3>
                                        <button 
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                toggleFavorite(batch._id);
                                            }}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '5px' }}
                                        >
                                            <Heart 
                                                size={22} 
                                                color={user?.favorites?.some(f => (f._id || f) === batch._id) ? '#ef4444' : 'var(--text-secondary)'} 
                                                fill={user?.favorites?.some(f => (f._id || f) === batch._id) ? '#ef4444' : 'none'}
                                            />
                                        </button>
                                    </div>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Clock size={16} color="var(--accent-primary)" />
                                        <span>Starts {new Date(batch.startDate).toLocaleDateString()} • {batch.accessDuration || 6} Months Full Access</span>
                                    </p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                            <span style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--accent-primary)' }}>₹{batch.price}</span>
                                            {batch.originalPrice && <span style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', textDecoration: 'line-through' }}>₹{batch.originalPrice}</span>}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <span style={{ fontSize: '0.75rem', fontWeight: '900', color: '#ef4444', textTransform: 'uppercase', letterSpacing: '1px' }}>🔥 Only {batch.maxStudents || 50} Slots Available</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        <button 
                                            onClick={() => {
                                                if (user?.enrolledCourses?.some(c => (c._id || c) === batch._id)) {
                                                    navigate(`/lessons/${batch._id}/0`);
                                                } else {
                                                    // Open enquiry modal with batch specific context
                                                    window.openEnquiryModal && window.openEnquiryModal(batch.title);
                                                }
                                            }} 
                                            className="btn btn-primary" 
                                            style={{ width: '100%', padding: '14px', background: user?.enrolledCourses?.some(c => (c._id || c) === batch._id) ? 'var(--success)' : 'var(--accent-primary)' }}
                                        >
                                            {user?.enrolledCourses?.some(c => (c._id || c) === batch._id) ? 'Access Batch' : 'Request Admission'}
                                        </button>
                                        {!user?.enrolledCourses?.some(c => (c._id || c) === batch._id) && (
                                            <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textAlign: 'center', fontWeight: '700' }}>
                                                Admin approval required after request
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: '100px' }}>
                        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-primary)' }}>Interactive Live Sessions</h2>
                            <p style={{ color: 'var(--text-secondary)' }}>Free masterclasses and workshop events live from our classroom.</p>
                        </div>
                        <div className="grid-courses">
                            {liveClasses.length === 0 ? (
                                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>No live sessions scheduled right now.</div>
                            ) : liveClasses.map(cls => {
                                const classDate = new Date(cls.classDate);
                                const now = new Date();
                                const isLive = classDate <= now && new Date(classDate.getTime() + 60*60*1000) >= now;
                                return (
                                    <div key={cls._id} className="glass-card fade-in" style={{ padding: '0', overflow: 'hidden', borderLeft: isLive ? '4px solid var(--success)' : 'none' }}>
                                        <div style={{ position: 'relative' }}>
                                            <img src={cls.thumbnail || class1} style={{ width: '100%', height: '180px', objectFit: 'cover' }} alt={cls.title} />
                                            {isLive && (
                                                <div style={{ position: 'absolute', top: '15px', left: '15px', background: '#ef4444', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <div style={{ width: '8px', height: '8px', background: 'white', borderRadius: '50%', boxShadow: '0 0 10px white' }} /> LIVE NOW
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ padding: '24px' }}>
                                            <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>{cls.title}</h3>
                                            <div style={{ display: 'flex', gap: '15px', color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '20px' }}>
                                                <span>📅 {classDate.toLocaleString()}</span>
                                                <span>⏱ {cls.classDuration}</span>
                                            </div>
                                            <button 
                                                onClick={() => navigate(`/classroom/${cls._id}`)}
                                                className="btn" 
                                                style={{ width: '100%', background: isLive ? 'var(--success)' : 'var(--bg-accent)', color: isLive ? 'white' : 'var(--text-primary)' }}
                                                disabled={!isLive && classDate > now}
                                            >
                                                {isLive ? 'Join Live Now' : 'Classroom Not Open'}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Certification Section */}
            <section className="section-padding" style={{ background: 'linear-gradient(to right, rgba(99, 102, 241, 0.03), rgba(67, 56, 202, 0.03))', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '80px', alignItems: 'center' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--accent-primary)', fontWeight: '800', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '20px' }}>
                                <Award size={20} /> Professional Recognition
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '25px', marginBottom: '35px' }}>
                                <img src="/logo_official.png" style={{ width: '80px', height: '80px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} alt="Official Logo" />
                                <h2 style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--text-primary)', lineHeight: 1.1 }}>Industry-Recognized <br/><span style={{ color: 'var(--accent-primary)' }}>Certification</span></h2>
                            </div>
                            <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '40px', lineHeight: 1.6 }}>
                                Upon successful completion of our immersive cohorts, you receive an official Certificate of Achievement. Our credentials are recognized by leading engineering teams and verify your mastery of industry-standard technologies and project building.
                            </p>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <div style={{ background: 'var(--success)15', color: 'var(--success)', padding: '8px', borderRadius: '10px' }}><Star size={20} /></div>
                                    <p style={{ fontWeight: '700', color: 'var(--text-primary)' }}>Personally Attested by Ravi Kumar</p>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <div style={{ background: 'var(--accent-primary)15', color: 'var(--accent-primary)', padding: '8px', borderRadius: '10px' }}><TrendingUp size={20} /></div>
                                    <p style={{ fontWeight: '700', color: 'var(--text-primary)' }}>Verifiable Digital Credentials</p>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card" style={{ padding: '30px', background: 'var(--bg-primary)', transform: 'rotate(2deg)', boxShadow: '0 40px 80px -20px rgba(0,0,0,0.15)', border: '10px solid #f8fafc' }}>
                            <div style={{ border: '4px double #e2e8f0', padding: '30px', textAlign: 'center', position: 'relative' }}>
                                <Award size={48} color="var(--accent-primary)" style={{ marginBottom: '20px' }} />
                                <h4 style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '3px', fontWeight: '900', color: 'var(--accent-primary)', marginBottom: '10px' }}>Certificate of Achievement</h4>
                                <p style={{ fontSize: '0.6rem', fontStyle: 'italic', color: '#64748b', marginBottom: '15px' }}>This is to certify that</p>
                                <h3 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#0f172a', marginBottom: '10px', fontFamily: 'serif' }}>STUDENT NAME</h3>
                                <div style={{ width: '40px', height: '1.5px', background: 'var(--accent-primary)', margin: '10px auto' }} />
                                <p style={{ fontSize: '0.55rem', color: '#64748b', margin: '0 auto 15px', maxWidth: '200px' }}>Successfully mastered Advanced Engineering & System Design in the Coding Classes Cohort.</p>
                                
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '20px' }}>
                                    <div style={{ textAlign: 'left' }}>
                                        <div style={{ borderBottom: '1px solid #e2e8f0', width: '60px', marginBottom: '4px', fontStyle: 'italic', fontSize: '0.65rem', fontWeight: '800' }}>Ravi Kumar</div>
                                        <p style={{ fontSize: '0.4rem', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.6 }}>Administrator</p>
                                    </div>
                                    <div style={{ color: 'var(--success)', opacity: 0.4 }}><ShieldCheck size={32} /></div>
                                </div>
                            </div>
                            <div style={{ position: 'absolute', top: -10, right: -10, background: 'var(--success)', color: 'white', padding: '10px 15px', borderRadius: '12px', transform: 'rotate(10deg)', fontSize: '0.75rem', fontWeight: '900', boxShadow: '0 10px 20px rgba(16, 185, 129, 0.3)' }}>VERIFIED ✅</div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Real Projects & Mentorship Section */}
            <section className="section-padding" style={{ padding: '120px 0', borderTop: '1px solid var(--border)', background: 'var(--bg-primary)' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'var(--accent-primary)10', padding: '10px 25px', borderRadius: '50px', color: 'var(--accent-primary)', fontWeight: '900', fontSize: '0.85rem', marginBottom: '20px', border: '1px solid var(--accent-primary)20' }}>
                            <Rocket size={18} /> Career-Ready Engineering
                        </div>
                        <h2 style={{ fontSize: '3.5rem', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '20px', lineHeight: '1.2' }}>Build <span className="text-gradient">Real-World</span> Enterprise Projects</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.3rem', maxWidth: '800px', margin: '0 auto' }}>Master industrial standards by building complex systems from scratch under elite mentorship.</p>
                    </div>

                    <div className="grid-courses" style={{ gap: '30px' }}>
                        {[
                            { title: 'Fintech Wallet Engine', desc: 'Secure transaction processing, ledger systems & API security.', icon: <Briefcase />, color: '#6366f1' },
                            { title: 'AI-SaaS Infrastructure', desc: 'Scalable LLM integration, prompt engineering & vector DBs.', icon: <Rocket />, color: '#ec4899' },
                            { title: 'E-commerce Microservices', desc: 'Distributing systems, high-concurrency handling & Redis caching.', icon: <Code />, color: '#f59e0b' },
                            { title: 'Real-time Analytics', desc: 'WebSocket integration, data pipelines & visual dashboards.', icon: <TrendingUp />, color: '#10b981' }
                        ].map((proj, i) => (
                            <div 
                                key={i} 
                                className="glass-card fade-in" 
                                style={{ 
                                    padding: '40px', 
                                    border: `1.5px solid ${proj.color}30`, 
                                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', 
                                    cursor: 'pointer',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.borderColor = proj.color;
                                    e.currentTarget.style.transform = 'translateY(-15px) scale(1.02)';
                                    e.currentTarget.style.boxShadow = `0 30px 60px -15px ${proj.color}25`;
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.borderColor = `${proj.color}30`;
                                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <div style={{ background: `${proj.color}15`, color: proj.color, width: '50px', height: '50px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '25px' }}>
                                    {proj.icon}
                                </div>
                                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '15px' }}>{proj.title}</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '25px' }}>{proj.desc}</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: proj.color, fontWeight: '800', fontSize: '0.9rem' }}>
                                    Explore Blueprint <ArrowRight size={16} />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: '120px', position: 'relative' }}>
                        <div className="glass-card" style={{ padding: '80px', background: 'var(--bg-accent)', border: '1px solid var(--border)', display: 'flex', flexWrap: 'wrap', gap: '60px', alignItems: 'center', borderRadius: '40px' }}>
                            <div style={{ flex: 1, minWidth: '300px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8b5cf6', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem', marginBottom: '20px' }}>
                                    <UserCheck size={20} /> Professional Mentorship
                                </div>
                                <h2 style={{ fontSize: '2.8rem', fontWeight: '900', marginBottom: '25px', lineHeight: '1.1' }}>Personalized <span style={{ color: '#8b5cf6' }}>1-on-1</span> Career Guidance</h2>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '40px' }}>
                                    Don't just watch videos. Work directly with industry veterans from Top Product Companies. Get your code reviewed, projects audited, and clear your doubts in real-time sessions.
                                </p>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
                                    {[
                                        'Code Review Sessions',
                                        'Architecture Audits',
                                        'Resume Overhaul',
                                        'Interview Preparation'
                                    ].map((item, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1rem', fontWeight: '700' }}>
                                            <div style={{ width: '8px', height: '8px', background: '#8b5cf6', borderRadius: '50%' }} /> {item}
                                        </div>
                                    ))}
                                </div>
                                <button onClick={() => { setEnquirySubject('Mentorship Call'); setIsEnquiryOpen(true); }} className="btn btn-primary" style={{ padding: '18px 40px', background: '#8b5cf6' }}>Book Your Free Mentor Call</button>
                            </div>
                            <div style={{ flex: 1, minWidth: '300px', position: 'relative', display: 'flex', justifyContent: 'center' }}>
                                <div style={{ position: 'relative' }}>
                                    <img 
                                        src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop" 
                                        style={{ width: '450px', height: '550px', objectFit: 'cover', borderRadius: '30px', boxShadow: '0 50px 100px -20px rgba(139, 92, 246, 0.3)' }} 
                                        alt="mentorship"
                                    />
                                    <div style={{ position: 'absolute', bottom: '-40px', left: '-30px', background: 'white', padding: '30px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '15px', color: '#0f172a' }}>
                                        <div style={{ background: '#10b981', color: 'white', padding: '10px', borderRadius: '12px' }}><ShieldCheck /></div>
                                        <div>
                                            <h4 style={{ fontSize: '1.2rem', fontWeight: '900' }}>4.9/5 Rating</h4>
                                            <p style={{ fontSize: '0.8rem', opacity: 0.6, fontWeight: '700' }}>Mentor Satisfaction Rate</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Student Feedback (Testimonials) Section */}
            <section className="section-padding" style={{ padding: '100px 0', background: 'var(--bg-accent)', borderBottom: '1px solid var(--border)' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--bg-primary)', padding: '6px 16px', borderRadius: '30px', color: '#f59e0b', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px', border: '1px solid var(--border)' }}>
                             <Star size={16} fill="#f59e0b" /> Student Reviews
                        </div>
                        <h2 style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '15px' }}>Trusted by <span style={{ color: 'var(--accent-primary)' }}>Engineers</span> Alike</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '750px', margin: '0 auto' }}>Hear from our alumni who have successfully transitioned into high-growth engineering roles.</p>
                    </div>

                    <div className="grid-courses">
                        {[
                            { name: 'Arjun Verma', feedback: 'The live mentorship sessions are a game changer. Building a real-world app from scratch gave me the confidence I needed for my interviews.', img: 'https://cdn-icons-png.flaticon.com/128/3177/3177440.png', role: 'SDE-1 @ TechFlow' },
                            { name: 'Sneha Kapur', feedback: 'Detailed, project-oriented, and extremely hands-on. The AI Assistant helped me debug my code even late at night! Highly recommended.', img: 'https://cdn-icons-png.flaticon.com/128/1995/1995539.png', role: 'Frontend Engineer' },
                            { name: 'Rahul Shinde', feedback: "Best investment in my career. The certification was recognized during my last technical round. Vipul Sir's way of teaching is unmatched.", img: 'https://cdn-icons-png.flaticon.com/128/1995/1995574.png', role: 'Full Stack Dev' }
                        ].map((review, i) => (
                            <div key={i} className="glass-card fade-in" style={{ padding: '40px', display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
                                <div style={{ display: 'flex', gap: '4px', color: '#f59e0b', marginBottom: '20px' }}>
                                    {[1, 2, 3, 4, 5].map(star => <Star key={star} size={18} fill="#f59e0b" />)}
                                </div>
                                <p style={{ fontSize: '1.2rem', color: 'var(--text-primary)', fontWeight: '600', lineHeight: '1.6', marginBottom: '30px', flex: 1, fontStyle: 'italic' }}>"{review.feedback}"</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <img src={review.img} style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--bg-accent)' }} alt="student" />
                                    <div>
                                        <h4 style={{ fontSize: '1rem', fontWeight: '800' }}>{review.name}</h4>
                                        <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{review.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '60px' }}>
                        <button 
                            className="btn btn-primary" 
                            style={{ padding: '16px 32px' }}
                            onClick={() => alert("Redirecting to all reviews...")}
                        >
                            Read all 480+ student reviews <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </section>
            <CheckoutModal 
                isOpen={isCheckoutOpen} 
                onClose={() => setIsCheckoutOpen(false)} 
                course={selectedCourse} 
                onPaymentSuccess={handlePaymentComplete} 
            />
            <EnquiryModal 
                isOpen={isEnquiryOpen} 
                onClose={() => { setIsEnquiryOpen(false); setEnquirySubject(''); }} 
                courseTitle={enquirySubject}
            />
        </div>
    );
};

export default Home;
