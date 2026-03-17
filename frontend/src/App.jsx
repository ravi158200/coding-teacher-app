import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Lesson from './pages/Lesson';
import Quiz from './pages/Quiz';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import { Code2 } from 'lucide-react';
import EnquiryModal from './components/EnquiryModal';

function App() {
  const [isEnquiryOpen, setIsEnquiryOpen] = React.useState(false);
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <main style={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/courses/:id" element={<CourseDetail />} />
                <Route path="/lessons/:courseId/:lessonIdx" element={<Lesson />} />
                <Route path="/quiz/:courseId" element={<Quiz />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </main>
            <footer style={{ padding: '80px 0 40px', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', marginTop: '80px' }}>
              <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '40px', marginBottom: '60px', textAlign: 'left' }}>
                  {/* Brand Column */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px' }}>
                      <div style={{ background: 'var(--accent-primary)', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                        <Code2 size={22} />
                      </div>
                      <span style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)' }}>Coding Classes</span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem' }}>
                      The world's most immersive engineering school. <br/> Building the future, one line of code at a time.
                    </p>
                    <div style={{ marginTop: '20px', color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      <p style={{ fontWeight: '700', color: 'var(--text-primary)' }}>Noida Head Office:</p>
                      <p>Sector-62, Noida Area,</p>
                      <p>Uttar Pradesh, India - 201309</p>
                    </div>
                  </div>

                  {/* Platform Column */}
                  <div>
                    <h4 style={{ color: 'var(--text-primary)', marginBottom: '25px' }}>Platform</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <Link to="/" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Home</Link>
                      <Link to="/courses" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>All Courses</Link>
                      <Link to="/#batches" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Live Batches</Link>
                    </div>
                  </div>

                  {/* Support Column */}
                  <div>
                    <h4 style={{ color: 'var(--text-primary)', marginBottom: '25px' }}>Student Life</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <Link to="/profile" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Dashboard</Link>
                      <Link to="/profile#favorites" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Watchlist</Link>
                      <button 
                        onClick={() => setIsEnquiryOpen(true)}
                        style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.95rem', textAlign: 'left', padding: 0, cursor: 'pointer' }}
                      >
                        Contact Admissions
                      </button>
                      <Link to="/admin" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Educator Portal</Link>
                    </div>
                  </div>

                  {/* Connect Column */}
                  <div>
                    <h4 style={{ color: 'var(--text-primary)', marginBottom: '25px' }}>Connect</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <a href="#" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Twitter</a>
                      <a href="#" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>GitHub</a>
                      <a href="#" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>LinkedIn</a>
                      <a href="#" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Discord</a>
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  <p>© 2026 Coding Classes Engineering School. All rights reserved.</p>
                  <div style={{ display: 'flex', gap: '30px' }}>
                    <span style={{ cursor: 'pointer' }}>Privacy Policy</span>
                    <span style={{ cursor: 'pointer' }}>Terms of Service</span>
                    <span style={{ cursor: 'pointer' }}>Cookie Policy</span>
                  </div>
                </div>
              </div>
            </footer>
            <EnquiryModal 
              isOpen={isEnquiryOpen} 
              onClose={() => setIsEnquiryOpen(false)} 
            />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
