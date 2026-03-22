import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { BookOpen, Megaphone, Search, Calendar, Eye, Tag } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

const typeConfig = {
  article:      { label: 'Article',      color: '#6366f1', icon: <BookOpen size={14} /> },
  announcement: { label: 'Announcement', color: '#f59e0b', icon: <Megaphone size={14} /> },
  video:        { label: 'Free Video',   color: '#10b981', icon: null },
  class:        { label: 'Live Class',   color: '#3b82f6', icon: <Calendar size={14} /> },
};

const Content = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');

  useEffect(() => {
    const query = searchParams.get('search');
    if (query !== null) setSearch(query);
  }, [searchParams]);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const params = filter !== 'all' ? `?type=${filter}` : '';
        const { data } = await API.get(`/content${params}`);
        setItems(data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch();
  }, [filter]);

  const filtered = items.filter(i =>
    i.title.toLowerCase().includes(search.toLowerCase()) ||
    (i.body || '').toLowerCase().includes(search.toLowerCase())
  );

  const pinned = filtered.filter(i => i.isPinned);
  const rest = filtered.filter(i => !i.isPinned);

  return (
    <div className="w-full min-h-screen bg-[#F4F6F9]">
      <div className="container section-padding fade-in">
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '16px' }}>
          📢 <span style={{ background: 'linear-gradient(135deg,var(--accent-primary),#10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Insights & Updates</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Articles, announcements, free videos, and live class schedules — all in one place.
        </p>
      </div>

      {/* Filters + Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '36px', flexWrap: 'wrap', gap: '16px' }}>
        <div className="glass-card" style={{ display: 'flex', padding: '6px', gap: '6px', flexWrap: 'wrap' }}>
          {[['all', 'All'], ['article', 'Articles'], ['announcement', 'Announcements'], ['video', 'Free Videos'], ['class', 'Live Classes']].map(([val, label]) => (
            <button key={val} onClick={() => setFilter(val)} className={`btn ${filter === val ? 'btn-primary' : ''}`}
              style={{ padding: '8px 16px', fontSize: '0.85rem', background: filter === val ? undefined : 'transparent' }}>
              {label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-accent)', padding: '10px 16px', borderRadius: '12px', gap: '10px', border: '1px solid var(--border)' }}>
          <Search size={16} color="var(--text-secondary)" />
          <input value={search} onChange={e => {
              setSearch(e.target.value);
              if (e.target.value) setSearchParams({ search: e.target.value });
              else setSearchParams({});
          }} placeholder="Search content..." style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', width: '200px' }} />
        </div>
      </div>

      {loading && <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Loading...</div>}

      {!loading && filtered.length === 0 && (
        <div className="glass-card" style={{ padding: '60px', textAlign: 'center' }}>
          <BookOpen size={56} style={{ color: 'var(--text-secondary)', marginBottom: '16px' }} />
          <h3 style={{ marginBottom: '8px' }}>No content found</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Try a different filter or search term.</p>
        </div>
      )}

      {/* Pinned Items */}
      {pinned.length > 0 && (
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            📌 Pinned
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {pinned.map(item => <ContentCard key={item._id} item={item} />)}
          </div>
        </div>
      )}

      {/* Rest */}
      {rest.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {rest.map(item => <ContentCard key={item._id} item={item} />)}
        </div>
      )}
      </div>
    </div>
  );
};

const ContentCard = ({ item }) => {
  const cfg = typeConfig[item.type] || typeConfig.article;
  const classDate = item.classDate ? new Date(item.classDate) : null;
  const isUpcoming = classDate && classDate > new Date();

  return (
    <div className="glass-card" style={{ padding: '24px', display: 'flex', gap: '20px', alignItems: 'flex-start', transition: 'transform 0.2s', cursor: 'default' }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
      {item.thumbnail && (
          <Link to={`/content/${item._id}`} style={{ flexShrink: 0 }}>
            <img src={item.thumbnail} alt={item.title} style={{ width: '100px', height: '80px', objectFit: 'cover', borderRadius: '10px' }} />
          </Link>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
          <span style={{ background: cfg.color + '22', color: cfg.color, padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px' }}>
            {cfg.icon} {cfg.label}
          </span>
          {item.isPinned && <span style={{ fontSize: '0.72rem', background: 'var(--bg-accent)', padding: '3px 8px', borderRadius: '20px', color: 'var(--text-secondary)' }}>📌 Pinned</span>}
          {item.type === 'class' && classDate && (
            <span style={{ background: isUpcoming ? '#10b98122' : '#6b728022', color: isUpcoming ? '#10b981' : '#6b7280', padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: '800' }}>
              {isUpcoming ? '🟢 UPCOMING' : '⚫ PAST'}
            </span>
          )}
          <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginLeft: 'auto' }}>
            {new Date(item.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
          </span>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Eye size={12} /> {item.views}
          </span>
        </div>
        <Link to={`/content/${item._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '6px' }}>{item.title}</h3>
        </Link>
        {item.body && <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '8px' }}>{item.body.slice(0, 200)}{item.body.length > 200 ? '...' : ''}</p>}

        {/* Class Details */}
        {item.type === 'class' && (
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            {classDate && <span>📅 {classDate.toLocaleString()}</span>}
            {item.classDuration && <span>⏱ {item.classDuration}</span>}
            {item.maxStudents > 0 && <span>👥 Max {item.maxStudents}</span>}
          </div>
        )}

        {/* Video */}
        {item.type === 'video' && item.videoUrl && (
          <div style={{ marginTop: '10px' }}>
            <iframe src={item.videoUrl} style={{ width: '100%', maxWidth: '480px', height: '200px', borderRadius: '10px', border: 'none' }} title={item.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
          </div>
        )}

        {/* Tags */}
        {(item.tags || []).length > 0 && (
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '10px' }}>
            {item.tags.map(tag => (
              <span key={tag} style={{ background: 'var(--bg-accent)', padding: '2px 10px', borderRadius: '20px', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>#{tag}</span>
            ))}
          </div>
        )}

        {/* Class CTA */}
        {item.type === 'class' && item.classLink && isUpcoming && (
          <a href={item.classLink} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ marginTop: '14px', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', fontSize: '0.85rem' }}>
            🎥 Join Class
          </a>
        )}
      </div>
    </div>
  );
};

export default Content;
