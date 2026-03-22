
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Award, Download, ArrowLeft, Code2, QrCode } from 'lucide-react';

const Certificate = () => {
    const { courseId } = useParams();
    const { user } = useAuth();
    const course = user?.enrolledCourses?.find(c => (c._id || c) === courseId);
    
    // Fallback for demo if course is only an ID
    const courseName = typeof course === 'object' ? course.title : 'Official Batch Course';
    const userName = user?.name || 'Academic Scholar';
    
    const today = new Date();
    const month = today.toLocaleString('default', { month: 'long' });
    const year = today.getFullYear();
    const day = today.getDate();

    const [downloadMsg, setDownloadMsg] = React.useState('');

    const handlePrint = () => {
        window.print();
        setDownloadMsg("🎉 Congratulations on completing the course! Your certificate has been successfully processed/downloaded.");
        setTimeout(() => setDownloadMsg(''), 6000);
    };
    return (
        <div className="container section-padding fade-in" style={{ padding: '60px 20px' }}>
            <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: '700' }}>
                    <ArrowLeft size={20} /> Dashboard
                </Link>
                <button onClick={handlePrint} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 24px' }}>
                    <Download size={20} /> Download PDF / Print
                </button>
            </div>
            {downloadMsg && (
                <div className="no-print fade-in" style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10b981', padding: '15px 20px', borderRadius: '12px', textAlign: 'center', marginBottom: '30px', fontWeight: 'bold' }}>
                    {downloadMsg}
                </div>
            )}
            {!downloadMsg && <div className="no-print" style={{ marginBottom: '40px' }}></div>}

      <div id="certificate-container" style={{ 
          maxWidth: '1100px', 
          margin: '0 auto', 
          padding: '12px', 
          background: 'linear-gradient(135deg, #fff 0%, #f8fafc 100%)', 
          boxShadow: '0 50px 100px -20px rgba(0,0,0,0.3)', 
          borderRadius: '24px', 
          position: 'relative',
          aspectRatio: '1.414 / 1',
          overflow: 'hidden'
      }}>
          {/* Luminous corner accents */}
          <div style={{ position: 'absolute', top: -100, left: -100, width: 300, height: 300, background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)', zIndex: 0 }} />
          <div style={{ position: 'absolute', bottom: -100, right: -100, width: 300, height: 300, background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)', zIndex: 0 }} />

          <div style={{ 
              border: '25px double #e2e8f0', 
              height: '100%', 
              padding: '60px 80px', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              textAlign: 'center', 
              position: 'relative',
              borderRadius: '16px'
          }}>
              {/* Background decorative elements */}
              <div style={{ position: 'absolute', opacity: 0.12, zIndex: 0, top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#6366f1' }}>
                  <Award size={650} />
              </div>

              <div style={{ zIndex: 1, position: 'relative', width: '100%' }}>
                  <div style={{ marginBottom: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                      <div style={{ 
                          background: 'linear-gradient(to bottom right, #6366f1, #22d3ee)', 
                          width: '50px', 
                          height: '50px', 
                          borderRadius: '14px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          color: 'white',
                          boxShadow: '0 10px 20px rgba(99, 102, 241, 0.2)'
                      }}>
                          <Code2 size={26} />
                      </div>
                      <span style={{ 
                          fontSize: '3.5rem', 
                          fontWeight: '700', 
                          background: 'linear-gradient(to right, #0ea5e9, #4f46e5)', 
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          fontFamily: "'Dancing Script', cursive",
                          lineHeight: '1',
                          paddingBottom: '8px'
                      }}>Coding Classes</span>
                  </div>
                  
                  <h4 style={{ 
                      color: '#4f46e5', 
                      letterSpacing: '4px', 
                      fontWeight: '700', 
                      fontSize: '1.8rem', 
                      marginBottom: '25px',
                      textShadow: '0 2px 4px rgba(79, 70, 229, 0.1)',
                      fontFamily: "'Dancing Script', cursive"
                  }}>
                      Official Certificate of Achievement
                  </h4>
                  
                  <p style={{ fontSize: '2rem', color: '#64748b', marginBottom: '40px', fontWeight: '600', fontFamily: "'Dancing Script', cursive" }}>
                      This prestigious document is awarded to
                  </p>

                  <h1 style={{ 
                      fontSize: '6.5rem', 
                      fontWeight: '700', 
                      color: '#0f172a', 
                      marginBottom: '20px', 
                      fontFamily: "'Dancing Script', cursive",
                      background: 'linear-gradient(to bottom, #0f172a, #334155)',
                      WebkitBackgroundClip: 'text',
                      textShadow: '0 10px 20px rgba(0,0,0,0.1)'
                  }}>
                      {userName}
                  </h1>

                  <div style={{ 
                      width: '280px', 
                      height: '3px', 
                      background: 'linear-gradient(to right, transparent, #6366f1, transparent)', 
                      margin: '10px auto 40px',
                      boxShadow: '0 0 15px rgba(99, 102, 241, 0.5)' 
                  }} />

                  <p style={{ fontSize: '2rem', color: '#475569', maxWidth: '850px', margin: '0 auto 40px', lineHeight: 1.5, fontWeight: '700', fontFamily: "'Dancing Script', cursive" }}>
                      Having successfully met all rigorous academic requirements and demonstrated exceptional mastery in the specialized field of
                  </p>

                  <h2 style={{ 
                      fontSize: '4.5rem', 
                      fontWeight: '700', 
                      color: '#6366f1', 
                      marginBottom: '60px',
                      fontFamily: "'Dancing Script', cursive",
                      textShadow: '0 0 20px rgba(99, 102, 241, 0.2)' 
                  }}>
                      {courseName}
                  </h2>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%', marginTop: '60px' }}>
                      
                      {/* Left: QR & Date */}
                      <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-end', textAlign: 'center' }}>
                          <div style={{ border: '2px solid #e2e8f0', padding: '10px', borderRadius: '12px', background: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                              <QrCode size={70} color="#0f172a" strokeWidth={1.5} />
                              <div style={{ fontSize: '0.6rem', marginTop: '8px', fontWeight: '900', color: '#64748b', letterSpacing: '1px' }}>SCAN TO VERIFY</div>
                          </div>
                          <div style={{ paddingBottom: '5px' }}>
                              <div style={{ borderBottom: '3px solid #0f172a', paddingBottom: '8px', marginBottom: '12px', fontWeight: '950', color: '#0f172a', fontSize: '1.2rem' }}>
                                  {month} {day}, {year}
                              </div>
                              <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', letterSpacing: '2px', fontWeight: '800' }}>Date of Issue</p>
                          </div>
                      </div>

                      {/* Center: Official Stamp */}
                      <div style={{ position: 'relative', textAlign: 'center', transform: 'translateY(15px)' }}>
                          <div style={{ 
                              width: '130px', height: '130px', 
                              border: '5px double #ef4444', 
                              borderRadius: '50%', 
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: '#ef4444', fontWeight: '900', fontSize: '1rem',
                              textTransform: 'uppercase', letterSpacing: '1px',
                              transform: 'rotate(-15deg)',
                              opacity: 0.85,
                              margin: '0 auto',
                              boxShadow: '0 0 20px rgba(239, 68, 68, 0.15)'
                          }}>
                              <div style={{ textAlign: 'center', lineHeight: '1.2', border: '2px dashed rgba(239, 68, 68, 0.4)', borderRadius: '50%', width: '110px', height: '110px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                  <span style={{ fontSize: '1.1rem', display: 'block', fontWeight: '900' }}>CODING</span>
                                  <span style={{ fontSize: '1.1rem', display: 'block', fontWeight: '900' }}>CLASSES</span>
                                  <span style={{ fontSize: '0.65rem', display: 'block', borderTop: '2px solid #ef4444', margin: '6px auto 0', paddingTop: '4px', width: '60%', fontWeight: '900' }}>OFFICIAL</span>
                              </div>
                          </div>
                      </div>

                      {/* Right: Signatures */}
                      <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-end', textAlign: 'center', paddingBottom: '5px' }}>
                          <div>
                              <div style={{ borderBottom: '3px solid #0f172a', paddingBottom: '8px', marginBottom: '12px', fontWeight: '700', color: '#0f172a', fontSize: '1.8rem', fontFamily: "'Dancing Script', cursive" }}>
                                  Prof. Instructor
                              </div>
                              <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', letterSpacing: '2px', fontWeight: '800' }}>Head Instructor</p>
                          </div>
                          <div>
                              <div style={{ borderBottom: '3px solid #0f172a', paddingBottom: '8px', marginBottom: '12px', fontWeight: '700', color: '#0f172a', fontSize: '1.8rem', fontFamily: "'Dancing Script', cursive" }}>
                                  Ravi Kumar
                              </div>
                              <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', letterSpacing: '2px', fontWeight: '800' }}>Authorized Admin</p>
                          </div>
                      </div>

                  </div>
              </div>
          </div>
      </div>

            <style>{`
                @media print {
                    .no-print, nav, footer { display: none !important; }
                    body { background: white !important; padding: 0 !important; margin: 0 !important; }
                    .container { max-width: 100% !important; padding: 0 !important; margin: 0 !important; }
                    #certificate-container { 
                        box-shadow: none !important; 
                        margin: 0 !important; 
                        width: 100% !important; 
                        height: 100vh !important; 
                    }
                }
            `}</style>
        </div>
    );
};

export default Certificate;
