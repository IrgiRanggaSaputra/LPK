import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, CheckCircle } from 'lucide-react';
import './Hero.css';

export default function Hero() {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate('/daftar');
  };

  return (
    <section id="hero" className="hero">
      <div className="container">
        <div className="hero-grid">
          {/* Left Column: Headline and CTA */}
          <div className="hero-content animate-slide-up">
            <div className="hero-badge">
              <span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: 'var(--color-accent-red)', borderRadius: '50%' }}></span>
              Resmi Terakreditasi KEMNAKER RI
            </div>
            
            <h1 className="hero-title">
              Raih Karir Global Sejak Usia Muda: Bekerja Resmi di <span>Jepang</span>
            </h1>
            
            <p className="hero-description">
              Program Magang Resmi (Ginou Jisshusei) dan Pekerja Keahlian Khusus (Tokutei Ginou / SSW). Kami membimbing putra-putri Anda dari nol (tanpa dasar bahasa) hingga sukses terbang dan mandiri di Jepang.
            </p>
            
            <div className="hero-actions">
              <button onClick={handleRegisterClick} className="btn btn-primary btn-lg">
                <Send size={18} />
                Daftar Sekarang
              </button>
              <a href="#program" className="btn btn-outline" style={{ color: 'var(--color-bg-white)', borderColor: 'var(--color-bg-white)' }}>
                Pelajari Program
              </a>
            </div>
          </div>

          {/* Right Column: Visual Component */}
          <div className="hero-image-container animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="hero-image-wrapper">
              <img 
                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600&auto=format&fit=crop" 
                alt="Pelatihan LPK Jepang" 
              />
              
              {/* Floating trust card */}
              <div className="hero-floating-card animate-float">
                <div className="hero-floating-icon">
                  <CheckCircle size={24} />
                </div>
                <div className="hero-floating-text">
                  <h4>98% Alumni Lulus</h4>
                  <p>Terbang & Kerja di Jepang</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
