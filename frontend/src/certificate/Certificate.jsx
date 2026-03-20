
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Award, Download, ArrowLeft, Code2 } from 'lucide-react';

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

    const handlePrint = () => {
        window.print();
    };

    if (!course && user?.role !== 'admin') {
        return (
            <div className="container section-padding text-center">
                <h2>Certificate Not Available</h2>
                <p>Please complete the course requirements to unlock your official certification.</p>
                <Link to="/profile" className="btn btn-primary mt-4">Back to Dashboard</Link>
            </div>
        );
    }

    return (
        <div className="container section-padding fade-in" style={{ padding: '60px 20px' }}>
            <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: '700' }}>
                    <ArrowLeft size={20} /> Dashboard
                </Link>
                <button onClick={handlePrint} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 24px' }}>
                    <Download size={20} /> Download PDF / Print
                </button>
            </div>

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
              <div style={{ position: 'absolute', opacity: 0.04, zIndex: 0, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                  <Award size={600} />
              </div>

              <div style={{ zIndex: 1, position: 'relative', width: '100%' }}>
                  <div style={{ marginBottom: '50px', display: 'flex', itemsCenter: 'center', justifyContent: 'center', gap: '16px' }}>
                      <div style={{ 
                          background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)', 
                          width: '60px', 
                          height: '60px', 
                          borderRadius: '18px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          color: 'white',
                          boxShadow: '0 15px 30px rgba(99, 102, 241, 0.3)'
                      }}>
                          <Code2 size={32} />
                      </div>
                      <span style={{ fontSize: '1.5rem', fontWeight: '950', color: '#0f172a', letterSpacing: '-1px', display: 'flex', alignItems: 'center' }}>Coding Classes</span>
                  </div>
                  
                  <h4 style={{ 
                      color: '#4f46e5', 
                      textTransform: 'uppercase', 
                      letterSpacing: '8px', 
                      fontWeight: '950', 
                      fontSize: '1.1rem', 
                      marginBottom: '25px',
                      textShadow: '0 2px 4px rgba(79, 70, 229, 0.1)'
                  }}>
                      Official Certificate of Achievement
                  </h4>
                  
                  <p style={{ fontStyle: 'italic', fontSize: '1.3rem', color: '#64748b', marginBottom: '45px', fontWeight: '600' }}>
                      This prestigious document is awarded to
                  </p>

                  <h1 style={{ 
                      fontSize: '5.5rem', 
                      fontWeight: '950', 
                      color: '#0f172a', 
                      marginBottom: '30px', 
                      letterSpacing: '-3px', 
                      fontFamily: 'serif',
                      background: 'linear-gradient(to bottom, #0f172a, #334155)',
                      WebkitBackgroundClip: 'text',
                      textShadow: '0 10px 20px rgba(0,0,0,0.1)'
                  }}>
                      {userName}
                  </h1>

                  <div style={{ 
                      width: '180px', 
                      height: '4px', 
                      background: 'linear-gradient(to right, transparent, #6366f1, transparent)', 
                      margin: '20px auto 45px',
                      boxShadow: '0 0 15px rgba(99, 102, 241, 0.5)' 
                  }} />

                  <p style={{ fontSize: '1.5rem', color: '#475569', maxWidth: '750px', margin: '0 auto 40px', lineHeight: 1.6, fontWeight: '700' }}>
                      Having successfully met all rigorous academic requirements and demonstrated exceptional mastery in the specialized field of
                  </p>

                  <h2 style={{ 
                      fontSize: '3rem', 
                      fontWeight: '950', 
                      color: '#6366f1', 
                      marginBottom: '60px',
                      textShadow: '0 0 20px rgba(99, 102, 241, 0.2)' 
                  }}>
                      {courseName}
                  </h2>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', width: '100%', alignItems: 'flex-end', marginTop: '50px' }}>
                      <div style={{ textAlign: 'center' }}>
                          <div style={{ borderBottom: '3px solid #0f172a', paddingBottom: '12px', marginBottom: '12px', fontWeight: '950', color: '#0f172a', fontSize: '1.3rem' }}>
                              {month} {day}, {year}
                          </div>
                          <p style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: '#64748b', letterSpacing: '2px', fontWeight: '800' }}>Completion Date</p>
                      </div>

                      <div style={{ textAlign: 'center', position: 'relative' }}>
                          <ShieldCheck size={100} color="#10b981" style={{ filter: 'drop-shadow(0 10px 15px rgba(16, 185, 129, 0.3))' }} />
                          <p style={{ fontSize: '0.75rem', color: '#1e293b', marginTop: '15px', fontWeight: '900', letterSpacing: '1px' }}>VERIFIED SECURE</p>
                      </div>

                      <div style={{ textAlign: 'center' }}>
                          <div style={{ borderBottom: '3px solid #0f172a', paddingBottom: '12px', marginBottom: '12px', fontWeight: '950', color: '#0f172a', fontSize: '1.5rem', fontFamily: 'cursive' }}>
                              Ravi Kumar
                          </div>
                          <p style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: '#64748b', letterSpacing: '2px', fontWeight: '800' }}>Ravi Kumar (Admin)</p>
                      </div>
                  </div>
              </div>
          </div>
      </div>

            <style>{`
                @media print {
                    .no-print { display: none !important; }
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
