
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
          padding: '15px', 
          background: 'linear-gradient(135deg, #fff 0%, #f1f5f9 100%)', 
          boxShadow: '0 60px 120px -30px rgba(0,0,0,0.4)', 
          borderRadius: '24px', 
          position: 'relative',
          aspectRatio: '1.414 / 1',
          overflow: 'hidden'
      }}>
          {/* Luminous corner accents */}
          <div style={{ position: 'absolute', top: -100, left: -100, width: 400, height: 400, background: 'radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%)', zIndex: 0 }} />
          <div style={{ position: 'absolute', bottom: -100, right: -100, width: 400, height: 400, background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)', zIndex: 0 }} />

          <div style={{ 
              border: '2px solid #e2e8f0', 
              height: '100%', 
              padding: '60px 90px', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              textAlign: 'center', 
              position: 'relative',
              borderRadius: '20px',
              background: 'white',
              boxShadow: 'inset 0 0 100px rgba(99, 102, 241, 0.03)'
          }}>
              {/* Background decorative elements */}
              <div style={{ position: 'absolute', opacity: 0.08, zIndex: 0, top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#6366f1' }}>
                  <Award size={650} />
              </div>

              <div style={{ zIndex: 1, position: 'relative', width: '100%' }}>
                  <div style={{ marginBottom: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                      <img 
                          src="/logo_dark.png" 
                          alt="Coding Classes Official Logo" 
                          style={{ width: '120px', height: '120px', borderRadius: '24px', boxShadow: '0 15px 40px rgba(0,0,0,0.1)', border: '2px solid white', padding: '10px', background: '#0f172a' }} 
                      />
                      <span style={{ 
                          fontSize: '3.5rem', 
                          fontWeight: '800', 
                          background: 'linear-gradient(to right, #0ea5e9, #4f46e5)', 
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          fontFamily: "'Dancing Script', cursive",
                          lineHeight: '1',
                          letterSpacing: '-1px'
                      }}>Coding Classes</span>
                  </div>
                  
                  <h4 style={{ 
                      color: '#4f46e5', 
                      letterSpacing: '5px', 
                      fontWeight: '800', 
                      fontSize: '1.4rem', 
                      marginBottom: '30px',
                      textTransform: 'uppercase'
                  }}>
                      Official Certificate of Achievement
                  </h4>
                  
                  <p style={{ fontSize: '1.8rem', color: '#64748b', marginBottom: '40px', fontWeight: '600', fontFamily: "'Dancing Script', cursive" }}>
                      This prestigious document is awarded to
                  </p>

                  <h1 style={{ 
                      fontSize: '6rem', 
                      fontWeight: '800', 
                      color: '#0f172a', 
                      marginBottom: '20px', 
                      fontFamily: "'Dancing Script', cursive",
                      background: 'linear-gradient(to bottom, #0f172a, #334155)',
                      WebkitBackgroundClip: 'text',
                  }}>
                      {userName}
                  </h1>

                  <div style={{ 
                      width: '320px', 
                      height: '2px', 
                      background: 'linear-gradient(to right, transparent, #6366f1, transparent)', 
                      margin: '10px auto 40px',
                  }} />

                  <p style={{ fontSize: '1.8rem', color: '#475569', maxWidth: '850px', margin: '0 auto 40px', lineHeight: 1.6, fontWeight: '700', fontFamily: "'Dancing Script', cursive" }}>
                      Having successfully met all rigorous academic requirements and demonstrated exceptional mastery in the specialized field of
                  </p>

                  <h2 style={{ 
                      fontSize: '4rem', 
                      fontWeight: '800', 
                      color: '#6366f1', 
                      marginBottom: '60px',
                      fontFamily: "'Dancing Script', cursive",
                  }}>
                      {courseName}
                  </h2>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%', marginTop: '40px' }}>
                      
                      {/* Left: QR & Date */}
                      <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-end', textAlign: 'center' }}>
                          <div style={{ border: '1px solid #e2e8f0', padding: '12px', borderRadius: '16px', background: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                              <QrCode size={80} color="#0f172a" strokeWidth={1.5} />
                              <div style={{ fontSize: '0.6rem', marginTop: '8px', fontWeight: '900', color: '#64748b', letterSpacing: '1px' }}>VERIFY CREDENTIAL</div>
                          </div>
                          <div style={{ paddingBottom: '5px' }}>
                              <div style={{ borderBottom: '2px solid #0f172a', paddingBottom: '8px', marginBottom: '12px', fontWeight: '950', color: '#0f172a', fontSize: '1.2rem' }}>
                                  {month} {day}, {year}
                              </div>
                              <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', letterSpacing: '2px', fontWeight: '800' }}>Date of Issue</p>
                          </div>
                      </div>

                      {/* Center: Official Stamp */}
                      <div style={{ position: 'relative', textAlign: 'center', transform: 'translateY(15px)' }}>
                          <div style={{ 
                              width: '140px', height: '140px', 
                              border: '4px double #ef4444', 
                              borderRadius: '50%', 
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: '#ef4444', fontWeight: '900', fontSize: '1rem',
                              textTransform: 'uppercase', letterSpacing: '1px',
                              transform: 'rotate(-15deg)',
                              opacity: 0.9,
                              margin: '0 auto',
                              boxShadow: '0 0 20px rgba(239, 68, 68, 0.1)'
                          }}>
                              <div style={{ textAlign: 'center', lineHeight: '1.2', border: '1.5px dashed rgba(239, 68, 68, 0.4)', borderRadius: '50%', width: '120px', height: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                  <span style={{ fontSize: '1.2rem', display: 'block', fontWeight: '900' }}>CODING</span>
                                  <span style={{ fontSize: '1.2rem', display: 'block', fontWeight: '900' }}>CLASSES</span>
                                  <span style={{ fontSize: '0.65rem', display: 'block', borderTop: '1px solid #ef4444', margin: '6px auto 0', paddingTop: '4px', width: '60%', fontWeight: '900' }}>OFFICIAL</span>
                              </div>
                          </div>
                      </div>

                      {/* Right: Signatures */}
                      <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-end', textAlign: 'center', paddingBottom: '5px' }}>
                          <div>
                              <div style={{ borderBottom: '2px solid #0f172a', paddingBottom: '8px', marginBottom: '12px', fontWeight: '700', color: '#0f172a', fontSize: '1.8rem', fontFamily: "'Dancing Script', cursive" }}>
                                  Prof. Instructor
                              </div>
                              <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', letterSpacing: '2px', fontWeight: '800' }}>Head Instructor</p>
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
