import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ArrowLeft, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';

const Quiz = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);

    useEffect(() => {
        const fetchCourse = async () => {
            const { data } = await axios.get(`http://localhost:5003/api/courses/${courseId}`);
            setCourse(data);
        };
        fetchCourse();
    }, [courseId]);

    const handleAnswer = (idx) => {
        setSelectedOption(idx);
        if (idx === course.quizzes[currentQuestion].correctAnswer) {
            setScore(score + 1);
        }

        setTimeout(() => {
            if (currentQuestion + 1 < course.quizzes.length) {
                setCurrentQuestion(currentQuestion + 1);
                setSelectedOption(null);
            } else {
                setShowResult(true);
            }
        }, 1000);
    };

    if (!course) return <div className="container section-padding">Loading...</div>;

    return (
        <div className="container section-padding fade-in" style={{ maxWidth: '800px' }}>
            <AnimatePresence mode="wait">
                {!showResult ? (
                    <motion.div 
                        key="quiz"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="glass-card" 
                        style={{ padding: '50px' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', alignItems: 'center' }}>
                            <span style={{ fontWeight: '700', color: 'var(--accent-primary)' }}>Question {currentQuestion + 1}/{course.quizzes.length}</span>
                            <div style={{ background: 'var(--bg-accent)', height: '10px', width: '200px', borderRadius: '5px', overflow: 'hidden' }}>
                                <div style={{ background: 'var(--accent-primary)', height: '100%', width: `${((currentQuestion + 1) / course.quizzes.length) * 100}%`, transition: 'width 0.3s ease' }} />
                            </div>
                        </div>

                        <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '40px' }}>{course.quizzes[currentQuestion].question}</h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {course.quizzes[currentQuestion].options.map((option, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => handleAnswer(idx)}
                                    className="btn"
                                    style={{ 
                                        padding: '20px', 
                                        justifyContent: 'flex-start',
                                        background: selectedOption === idx 
                                            ? (idx === course.quizzes[currentQuestion].correctAnswer ? 'var(--success)' : '#ef4444') 
                                            : 'var(--bg-accent)',
                                        color: selectedOption === idx ? 'white' : 'var(--text-primary)',
                                        border: '1px solid var(--border)',
                                        fontSize: '1.1rem'
                                    }}
                                >
                                    <span style={{ marginRight: '15px', padding: '5px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.2)', fontWeight: '800' }}>{String.fromCharCode(65 + idx)}</span>
                                    {option}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="result"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-card" 
                        style={{ padding: '60px', textAlign: 'center' }}
                    >
                        <div style={{ background: 'var(--accent-primary)', width: '100px', height: '100px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 30px', color: 'white' }}>
                            <Trophy size={50} />
                        </div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '15px' }}>Quiz Completed!</h1>
                        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '40px' }}>You scored {score} out of {course.quizzes.length}</p>
                        
                        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                            <button onClick={() => { setShowResult(false); setCurrentQuestion(0); setScore(0); }} className="btn" style={{ background: 'var(--bg-accent)', color: 'var(--text-primary)', padding: '16px 32px' }}>
                                <RefreshCw size={20} /> Retake Quiz
                            </button>
                            <button onClick={() => navigate(`/courses/${courseId}`)} className="btn btn-primary" style={{ padding: '16px 32px' }}>
                                <ArrowLeft size={20} /> Back to Course
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Quiz;
