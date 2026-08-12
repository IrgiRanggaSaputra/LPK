import React, { useState, useEffect } from 'react';
import { MessageCircle, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logoImg from '../../images/kiyoraka.png';
import './Header.css';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLinkClick = (anchor) => {
    setMobileMenuOpen(false);
    // If not on landing page, navigate to landing first then scroll
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(anchor.replace('#', ''));
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleDaftarClick = () => {
    setMobileMenuOpen(false);
    navigate('/daftar');
  };

  // WhatsApp redirect for general enquiries
  const handleWaContact = () => {
    const adminPhone = "6281234567890";
    const text = encodeURIComponent("Halo Admin LPK Jepang, saya ingin berkonsultasi mengenai program magang/kerja di Jepang.");
    window.open(`https://api.whatsapp.com/send?phone=${adminPhone}&text=${text}`, '_blank');
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container header-container">
        <a href="/" className="logo-wrapper">
          <img src={logoImg} alt="Logo LPK Kiyoraka" className="logo-img" />
          <div>
            <div className="logo-text">LPK KIYORAKA</div>
            <div className="logo-sub">GLOBAL</div>
          </div>
        </a>

        {/* Navigation Menu */}
        <nav className="nav-menu">
          <a href="/#hero" onClick={() => handleLinkClick('#hero')} className="nav-link">Home</a>
          <a href="/#tentang" onClick={() => handleLinkClick('#tentang')} className="nav-link">Tentang Kami</a>
          <a href="/#program" onClick={() => handleLinkClick('#program')} className="nav-link">Program</a>
          <a href="/#fasilitas" onClick={() => handleLinkClick('#fasilitas')} className="nav-link">Fasilitas</a>
          <a href="/#alur" onClick={() => handleLinkClick('#alur')} className="nav-link">Alur Proses</a>
          <a href="/#faq" onClick={() => handleLinkClick('#faq')} className="nav-link">FAQ</a>
        </nav>

        {/* Action Button */}
        <div className="nav-cta">
          <button onClick={handleDaftarClick} className="btn btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem' }}>
            Daftar Sekarang
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button onClick={toggleMobileMenu} className="mobile-menu-btn" aria-label="Toggle menu">
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Basic Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="glass-card" style={{
          position: 'fixed',
          top: isScrolled ? '70px' : '80px',
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          padding: '2rem 1.5rem',
          gap: '1.5rem',
          zIndex: 999,
          borderTop: '1px solid var(--color-border)'
        }}>
          <a href="/#hero" onClick={() => handleLinkClick('#hero')} className="nav-link" style={{ fontSize: '1.1rem' }}>Home</a>
          <a href="/#tentang" onClick={() => handleLinkClick('#tentang')} className="nav-link" style={{ fontSize: '1.1rem' }}>Tentang Kami</a>
          <a href="/#program" onClick={() => handleLinkClick('#program')} className="nav-link" style={{ fontSize: '1.1rem' }}>Program</a>
          <a href="/#fasilitas" onClick={() => handleLinkClick('#fasilitas')} className="nav-link" style={{ fontSize: '1.1rem' }}>Fasilitas</a>
          <a href="/#alur" onClick={() => handleLinkClick('#alur')} className="nav-link" style={{ fontSize: '1.1rem' }}>Alur Proses</a>
          <a href="/#faq" onClick={() => handleLinkClick('#faq')} className="nav-link" style={{ fontSize: '1.1rem' }}>FAQ</a>
          <button onClick={handleDaftarClick} className="btn btn-primary" style={{ width: '100%' }}>
            Daftar Sekarang
          </button>
        </div>
      )}
    </header>
  );
}
