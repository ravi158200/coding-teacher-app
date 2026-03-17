import React, { useEffect, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { ChevronRight, Play, Users, Star, GraduationCap, Code, TrendingUp, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import CheckoutModal from '../components/CheckoutModal';
import class1 from '../assets/class1.png';
import class2 from '../assets/class2.png';
import EnquiryModal from '../components/EnquiryModal';

const Home = () => {
    const [courses, setCourses] = useState([]);
    const [batches, setBatches] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
    const { user, enrollInCourse, toggleFavorite } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const { data } = await API.get('/courses');
                setCourses(data.filter(c => !c.isBatch).slice(0, 3));
                setBatches(data.filter(c => c.isBatch));
            } catch (err) {
                console.error(err);
            }
        };
        fetchCourses();
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
        <div className="fade-in">
            <div className="mesh-bg" />

            {/* Batch Announcements Marquee */}
            <div className="marquee-container" style={{ marginBottom: '20px' }}>
                <div className="marquee-content">
                    🔥 NEXT FULL-STACK WEB DEVELOPMENT BATCH STARTS ON APRIL 1ST • 🚀 MASTER DATA SCIENCE WITH PYTHON BEGINS IN 2 WEEKS • 💻 REGISTER NOW FOR ADVANCED REACT & NEXT.JS WORKSHOP • 🎓 EARLY BIRD DISCOUNTS AVAILABLE FOR ALL APRIL BATCHES • 🔥 LIMITED SEATS LEFT FOR GEN-AI & MLOPS MASTERCLASS
                </div>
            </div>
            
            {/* Hero Section */}
            <section className="section-padding" style={{ paddingBottom: '100px' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 1fr', gap: '60px', alignItems: 'center' }}>
                        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                            <span className="badge badge-primary" style={{ marginBottom: '20px', display: 'inline-block' }}>New: Next.js 14 Course just launched!</span>
                            <h1 style={{ fontSize: '4rem', fontWeight: '800', lineHeight: '1.1', marginBottom: '30px', background: 'linear-gradient(135deg, var(--text-primary), var(--accent-primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textAlign: 'left' }}>
                                Master the Art of <br /> Engineering
                            </h1>
                            <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '600px', marginBottom: '40px', textAlign: 'left', lineHeight: '1.6' }}>
                                Unlock your potential with our immersive coding courses. Designed for high-performance engineers who want to build the future.
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '20px' }}>
                                <Link to="/courses" style={{ textDecoration: 'none' }}>
                                    <button className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
                                        Start Learning Now <ChevronRight size={20} />
                                    </button>
                                </Link>
                                    <button 
                                        onClick={() => setIsEnquiryOpen(true)}
                                        className="btn" 
                                        style={{ background: 'var(--bg-accent)', color: 'var(--text-primary)', padding: '16px 32px' }}
                                    >
                                        <Play size={20} /> Admissions Enquiry
                                    </button>
                            </div>
                        </motion.div>

                        {/* Hero Image / Illustration */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }} 
                            animate={{ opacity: 1, scale: 1 }} 
                            transition={{ duration: 0.8, delay: 0.2 }}
                            style={{ position: 'relative' }}
                        >
                            <div className="glass-card" style={{ padding: '10px', borderRadius: '32px', position: 'relative', zIndex: 1 }}>
                                <img 
                                    src="/batch1.png" 
                                    style={{ width: '100%', height: 'auto', borderRadius: '24px', boxShadow: '0 30px 60px -12px rgba(0,0,0,0.5)' }} 
                                    alt="Global Coding Community" 
                                />
                            </div>
                            {/* Decorative background blocks */}
                            <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100%', height: '100%', border: '2px solid var(--accent-primary)', borderRadius: '32px', opacity: 0.2, zIndex: 0 }}></div>
                            <div style={{ position: 'absolute', bottom: '-40px', left: '20px', width: '150px', height: '150px', background: 'var(--accent-primary)', filter: 'blur(80px)', opacity: 0.2, zIndex: 0 }}></div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
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
                            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '30px', lineHeight: '1.8' }}>
                                At Coding Classes, we don't just teach syntax—we build engineers. Our high-fidelity learning environment combines professional-grade tools with expert guidance.
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
                                            <span style={{ fontWeight: '700', color: 'var(--accent-primary)' }}>${course.price}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <h3 style={{ marginBottom: '12px', flex: 1 }}>{course.title}</h3>
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
            <section id="batches" className="section-padding" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
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
                                        <div style={{ position: 'absolute', top: '20px', right: '20px', background: '#ef4444', color: 'white', padding: '5px 15px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: '800' }}>
                                            {Math.round((1 - batch.price / batch.originalPrice) * 100)}% OFF
                                        </div>
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
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
                                        Starts {new Date(batch.startDate).toLocaleDateString()} • Live 1-on-1 Mentorship
                                    </p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                                        <span style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--accent-primary)' }}>${batch.price}</span>
                                        {batch.originalPrice && <span style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', textDecoration: 'line-through' }}>${batch.originalPrice}</span>}
                                    </div>
                                    <button 
                                        onClick={() => handleEnroll(batch._id)} 
                                        className="btn btn-primary" 
                                        style={{ width: '100%', padding: '14px', background: user?.enrolledCourses?.some(c => (c._id || c) === batch._id) ? 'var(--success)' : 'var(--accent-primary)' }}
                                    >
                                        {user?.enrolledCourses?.some(c => (c._id || c) === batch._id) ? 'Enrolled' : 'Enroll Now'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: '60px', textAlign: 'center' }}>
                        <Link to="/courses">
                            <button className="btn" style={{ background: 'var(--bg-accent)', color: 'var(--text-primary)', padding: '16px 40px', fontSize: '1.1rem', border: '1px solid var(--border)' }}>
                                <TrendingUp size={20} /> Join More Exclusive Classes
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Community Section */}
            <section className="section-padding">
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '16px' }}>Join a Global Community</h2>
                        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>Connect with passionate developers from around the world. Our cohorts are more than just classes—they are lifelong networks.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                        <div className="glass-card" style={{ padding: '0', overflow: 'hidden', borderRadius: '32px', position: 'relative' }}>
                            <img src="/batch2.png" style={{ width: '100%', height: '400px', objectFit: 'cover' }} alt="Batch 2 Preview" />
                            <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', padding: '40px', background: 'linear-gradient(to top, rgba(0,0,0,0.95), transparent)', color: 'white' }}>
                                <h4 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '5px' }}>Cloud Architecture Labs</h4>
                                <p style={{ opacity: 0.8, fontSize: '1.1rem' }}>Next Session May 2026 • Live Project Building</p>
                            </div>
                        </div>
                        <div className="glass-card" style={{ padding: '0', overflow: 'hidden', borderRadius: '32px', position: 'relative' }}>
                            <img src="/batch3.png" style={{ width: '100%', height: '400px', objectFit: 'cover' }} alt="Batch 3 Preview" />
                            <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', padding: '40px', background: 'linear-gradient(to top, rgba(0,0,0,0.95), transparent)', color: 'white' }}>
                                <h4 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '5px' }}>AI & ML Research Group</h4>
                                <p style={{ opacity: 0.8, fontSize: '1.1rem' }}>Summer 2026 Residency • Elite Mentorship</p>
                            </div>
                        </div>
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
                onClose={() => setIsEnquiryOpen(false)} 
            />
        </div>
    );
};

export default Home;
