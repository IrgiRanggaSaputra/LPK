import React, { useState, useEffect } from 'react';
import { Calendar, User, BookOpen, X } from 'lucide-react';
import { API_BASE_URL, getMediaUrl } from '../../config/api';
import './NewsSection.css';

export default function NewsSection() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null); // Article loaded into modal

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/berita`);
      const result = await response.json();
      if (response.ok && result.success) {
        setNews(result.data);
      }
    } catch (err) {
      console.error('Failed to load news for landing page:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="berita" className="section container">
      {/* Title */}
      <div className="section-title-wrapper">
        <span className="section-tag">BERITA & INFORMASI</span>
        <h2 className="section-title">Kabar Terbaru LPK Jepang</h2>
        <p className="section-subtitle">
          Ikuti terus perkembangan, kegiatan harian, tips belajar bahasa, serta pengumuman keberangkatan alumni magang di Jepang.
        </p>
      </div>

      {loading ? (
        // Loading Cards Skeleton
        <div className="news-grid">
          {[1, 2, 3].map((n) => (
            <div key={n} className="news-card" style={{ opacity: 0.6 }}>
              <div style={{ width: '100%', height: '200px', backgroundColor: '#e2e8f0' }}></div>
              <div className="news-card-body">
                <div style={{ width: '40%', height: '14px', backgroundColor: '#e2e8f0', marginBottom: '0.75rem' }}></div>
                <div style={{ width: '90%', height: '20px', backgroundColor: '#e2e8f0', marginBottom: '0.75rem' }}></div>
                <div style={{ width: '100%', height: '40px', backgroundColor: '#e2e8f0' }}></div>
              </div>
            </div>
          ))}
        </div>
      ) : news.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
          <p>Belum ada artikel berita yang diterbitkan saat ini.</p>
        </div>
      ) : (
        <div className="news-grid">
          {news.map((item) => (
            <div key={item.id} className="news-card animate-slide-up">
              <img src={getMediaUrl(item.image_url)} alt={item.title} className="news-card-img" />
              <div className="news-card-body">
                <span className="news-card-tag">{item.category}</span>
                <h3 className="news-card-title">{item.title}</h3>
                <p className="news-card-text">{item.content}</p>
                
                <button 
                  onClick={() => setSelectedArticle(item)}
                  className="btn btn-outline" 
                  style={{ fontSize: '0.8rem', padding: '0.5rem 1rem', alignSelf: 'flex-start', marginTop: 'auto' }}
                >
                  <BookOpen size={14} />
                  Baca Selengkapnya
                </button>
              </div>
              <div className="news-card-footer">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Calendar size={12} />
                  {new Date(item.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  <User size={12} />
                  Admin LPK
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal overlay to read full news article */}
      {selectedArticle && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 44, 89, 0.6)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          padding: '1.5rem'
        }}>
          <div className="glass-card animate-scale-up" style={{
            backgroundColor: 'var(--color-bg-white)',
            maxWidth: '650px',
            width: '100%',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '90vh'
          }}>
            {/* Modal Image Header */}
            <div style={{ position: 'relative', height: '240px', overflow: 'hidden' }}>
              <img 
                src={getMediaUrl(selectedArticle.image_url)} 
                alt={selectedArticle.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <button 
                onClick={() => setSelectedArticle(null)}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  border: 'none',
                  borderRadius: '50%',
                  color: '#fff',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                aria-label="Tutup"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content body */}
            <div style={{ padding: '2rem', overflowY: 'auto', flexGrow: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span className="news-card-tag" style={{ margin: 0 }}>{selectedArticle.category}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Calendar size={12} />
                  {new Date(selectedArticle.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                </span>
              </div>
              
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '1.25rem', lineHeight: '1.3' }}>
                {selectedArticle.title}
              </h3>
              
              <p style={{ color: 'var(--color-text-dark)', fontSize: '0.975rem', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
                {selectedArticle.content}
              </p>
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '1.25rem 2rem', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'flex-end', backgroundColor: 'var(--color-bg-light)' }}>
              <button 
                onClick={() => setSelectedArticle(null)}
                className="btn btn-secondary btn-sm"
              >
                Tutup Bacaan
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
