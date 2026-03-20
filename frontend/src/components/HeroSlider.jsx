import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const slides = [
  {
    image: '/assets/hero1.png',
    title: 'Master the Art of Modern Engineering',
    description: 'Join the world\'s most immersive coding academy and build the software of tomorrow.',
    cta: 'Explore Academy',
    link: '/courses'
  },
  {
    image: '/assets/hero2.png',
    title: 'Learn from Industry Experts',
    description: 'Get direct mentorship from senior engineers at top tech companies around the globe.',
    cta: 'Meet Instructors',
    link: '/courses'
  },
  {
    image: '/assets/hero3.png',
    title: 'Build a Portfolio That Wows',
    description: 'Go beyond theory. Work on real-world projects that recruiters actually care about.',
    cta: 'Join Live Batch',
    link: '/courses'
  }
];

const HeroSlider = ({ onEnquiryClick }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent(prev => (prev === slides.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrent(prev => (prev === 0 ? slides.length - 1 : prev - 1));

  return (
    <div style={{ position: 'relative', height: '80vh', minHeight: '600px', width: '100%', overflow: 'hidden', background: '#000' }}>
      {slides.map((slide, idx) => (
        <div key={idx} style={{
          position: 'absolute', inset: 0, 
          opacity: idx === current ? 1 : 0,
          transition: 'opacity 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
          pointerEvents: idx === current ? 'auto' : 'none'
        }}>
          {/* Image Layer with Zoom Effect */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${slide.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: idx === current ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform 8s linear'
          }} />
          
          {/* Dark Overlay Gradient */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)'
          }} />

          {/* Content Layer */}
          <div className="container" style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center', zIndex: 10 }}>
            <div style={{ 
              maxWidth: '650px',
              padding: '0 20px',
              transform: idx === current ? 'translateY(0)' : 'translateY(40px)',
              opacity: idx === current ? 1 : 0,
              transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s'
            }}>
              <span style={{ 
                background: 'rgba(99, 102, 241, 0.2)', 
                color: '#818cf8', 
                padding: '8px 16px', 
                borderRadius: '100px', 
                fontSize: '0.85rem', 
                fontWeight: '800', 
                textTransform: 'uppercase', 
                letterSpacing: '2px',
                border: '1px solid rgba(129, 140, 248, 0.3)',
                marginBottom: '20px',
                display: 'inline-block'
              }}>Top Rated Academy</span>
              
              <h1 style={{ 
                color: 'white', 
                fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', 
                fontWeight: '900', 
                lineHeight: '1.1',
                marginBottom: '24px',
                letterSpacing: '-1.5px'
              }}>{slide.title}</h1>
              
              <p style={{ 
                color: 'rgba(255,255,255,0.8)', 
                fontSize: '1.2rem', 
                lineHeight: '1.6',
                marginBottom: '40px'
              }}>{slide.description}</p>
              
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <Link to={slide.link} style={{ textDecoration: 'none' }}>
                    <button className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '1rem' }}>{slide.cta}</button>
                  </Link>
                  <button 
                    onClick={onEnquiryClick}
                    className="btn" 
                    style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '16px 32px', fontSize: '1rem', backdropFilter: 'blur(10px)' }}
                  >
                    <HelpCircle size={20} /> Admissions Enquiry
                  </button>
                </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Controls */}
      <button onClick={prevSlide} style={{ position: 'absolute', left: '30px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 100, backdropFilter: 'blur(5px)' }}>
        <ChevronLeft size={24} />
      </button>
      <button onClick={nextSlide} style={{ position: 'absolute', right: '30px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 100, backdropFilter: 'blur(5px)' }}>
        <ChevronRight size={24} />
      </button>

      {/* Pagination Dots */}
      <div style={{ position: 'absolute', bottom: '40px', width: '100%', display: 'flex', justifyContent: 'center', gap: '12px', zIndex: 100 }}>
        {slides.map((_, idx) => (
          <div key={idx} onClick={() => setCurrent(idx)} style={{
            width: idx === current ? '40px' : '10px',
            height: '10px',
            borderRadius: '5px',
            background: idx === current ? '#818cf8' : 'rgba(255,255,255,0.4)',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }} />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
