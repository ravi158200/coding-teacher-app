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
import Content from './pages/Content';
import ContentDetail from './pages/ContentDetail';
import Classroom from './pages/Classroom';
import FloatingAdminBtn from './components/FloatingAdminBtn';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import ProtectedRoute from './components/ProtectedRoute';
import Certificate from './certificate/Certificate';
import { Code2, Github, Twitter, Linkedin, MessageCircle, MapPin, Phone, Mail as MailIcon } from 'lucide-react';
import EnquiryModal from './components/EnquiryModal';
import ComponentsDemo from './pages/ComponentsDemo';

function App() {
  const [isEnquiryOpen, setIsEnquiryOpen] = React.useState(false);
  
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-500">
            <Navbar />
            
            <main className="flex-grow pt-32 pb-32">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/courses/:id" element={<CourseDetail />} />
                <Route path="/lessons/:courseId/:lessonIdx" element={<Lesson />} />
                <Route path="/quiz/:courseId" element={<Quiz />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin" element={<ProtectedRoute roles={['admin', 'teacher']}><AdminDashboard /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/content" element={<Content />} />
                <Route path="/content/:id" element={<ContentDetail />} />
                <Route path="/classroom/:id" element={<Classroom />} />
                <Route path="/certificate/:courseId" element={<Certificate />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/components" element={<ComponentsDemo />} />
              </Routes>
              <FloatingAdminBtn />
            </main>

            <footer className="bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-40 pb-30 transition-colors duration-600">
              <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 mb-16">
                  {/* Brand Column */}
                  <div className="space-y-6">
                    <Link to="/" className="flex items-center gap-3">
                      <div className="bg-indigo-600 p-2 rounded-xl text-white">
                        <Code2 size={24} />
                      </div>
                      <span className="text-2xl font-black tracking-[0.1em] text-slate-800 dark:text-white flex items-center gap-2">
                        Coding<span className="text-indigo-600">Classes</span>
                      </span>
                    </Link>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                      Building the future of software engineering through immersive education and practical mentorship.
                    </p>
                    <div className="flex gap-4">
                      <a href="#" className="p-2 bg-white dark:bg-slate-800 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors shadow-sm"><Twitter size={18} /></a>
                      <a href="#" className="p-2 bg-white dark:bg-slate-800 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors shadow-sm"><Github size={18} /></a>
                      <a href="#" className="p-2 bg-white dark:bg-slate-800 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors shadow-sm"><Linkedin size={18} /></a>
                    </div>
                  </div>

                  {/* Platform Column */}
                  <div>
                    <h4 className="text-slate-800 dark:text-white font-bold mb-6">Platform</h4>
                    <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
                      <li><Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link></li>
                      <li><Link to="/courses" className="hover:text-indigo-600 transition-colors">Academy</Link></li>
                      <li><Link to="/content" className="hover:text-indigo-600 transition-colors">Insights</Link></li>
                    </ul>
                  </div>

                  {/* Support Column */}
                  <div>
                    <h4 className="text-slate-800 dark:text-white font-bold mb-6">Support</h4>
                    <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
                      <li><Link to="/privacy" className="hover:text-indigo-600 transition-colors">Privacy Policy</Link></li>
                      <li><Link to="/terms" className="hover:text-indigo-600 transition-colors">Terms of Service</Link></li>
                      <li><button onClick={() => setIsEnquiryOpen(true)} className="hover:text-indigo-600 transition-colors">Help Center</button></li>
                      <li><Link to="/courses" className="hover:text-indigo-600 transition-colors">FAQ</Link></li>
                    </ul>
                  </div>

                  {/* Contact Column */}
                  <div>
                    <h4 className="text-slate-800 dark:text-white font-bold mb-6">Contact</h4>
                    <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
                      <li className="flex items-start gap-3">
                        <MapPin size={18} className="text-indigo-600 shrink-0 mt-0.5" />
                        <span>Tower A, Sector 62, Noida,<br/>Uttar Pradesh, 201309</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Phone size={18} className="text-indigo-600 shrink-0" />
                        <span>+91 8651840976</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <MailIcon size={18} className="text-indigo-600 shrink-0" />
                        <button onClick={() => setIsEnquiryOpen(true)} className="hover:text-indigo-600 transition-colors">raviraj7301325@gmail.com</button>
                      </li>
                    </ul>
                  </div>

                </div>

                <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-6 text-xs font-medium text-slate-400 text-center">
                  <p>© 2026 Coding Classes Academy. All rights reserved.</p>
                  <div className="flex gap-8">
                    <Link to="/privacy" className="hover:text-indigo-600 transition-colors">Privacy Policy</Link>
                    <Link to="/terms" className="hover:text-indigo-600 transition-colors">Terms of Service</Link>
                  </div>
                </div>
              </div>
            </footer>

            <EnquiryModal isOpen={isEnquiryOpen} onClose={() => setIsEnquiryOpen(false)} />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
