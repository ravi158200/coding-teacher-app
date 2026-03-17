import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { Link } from 'react-router-dom';
import { Search, Play, Star, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const { user, toggleFavorite } = useAuth();

    useEffect(() => {
        const fetchCourses = async () => {
            const { data } = await API.get('/courses');
            setCourses(data);
        };
        fetchCourses();
    }, []);

    const filteredCourses = courses.filter(c => 
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container section-padding fade-in">
            <div style={{ marginBottom: '60px', textAlign: 'center' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '20px' }}>Explore Courses</h1>
                <div style={{ display: 'flex', maxWidth: '600px', margin: '0 auto', gap: '15px' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <Search style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={20} />
                        <input 
                            type="text" 
                            className="input-field" 
                            style={{ paddingLeft: '50px' }} 
                            placeholder="Search by title, category or instructor..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="grid-courses">
                {filteredCourses.map((course) => (
                    <Link to={`/courses/${course._id}`} key={course._id} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className="glass-card" style={{ overflow: 'hidden', transition: 'all 0.3s' }}>
                            <img src={course.thumbnail} style={{ width: '100%', height: '220px', objectFit: 'cover' }} alt={course.title} />
                            <div style={{ padding: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                    <span className="badge badge-primary">{course.category}</span>
                                    <span style={{ fontWeight: '800', color: 'var(--accent-primary)', fontSize: '1.2rem' }}>${course.price}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <h3 style={{ marginBottom: '10px', fontSize: '1.3rem', fontWeight: '700', flex: 1 }}>{course.title}</h3>
                                    <button 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            toggleFavorite(course._id);
                                        }}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '5px' }}
                                    >
                                        <Heart 
                                            size={22} 
                                            color={user?.favorites?.some(f => (f._id || f) === course._id) ? '#ef4444' : 'var(--text-secondary)'} 
                                            fill={user?.favorites?.some(f => (f._id || f) === course._id) ? '#ef4444' : 'none'}
                                        />
                                    </button>
                                </div>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '0.9rem' }}>{course.instructor}</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '15px', borderTop: '1px solid var(--border)' }}>
                                    <div style={{ display: 'flex', gap: '15px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Play size={14} /> {course.lessons.length} Lessons</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: '700' }}>
                                        <Star size={16} fill="#f59e0b" stroke="none" /> 4.9
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Courses;
