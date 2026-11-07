import React, { useState, useEffect } from 'react';
import { MessageCircle, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logoImg from '../../images/kiyoraka.png';
import './Header.css';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Language state and dropdown visibility
  const [lang, setLang] = useState('id');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  //bahasa
  const languages = [
    { code: 'id', name: 'Indonesian', flag: 'ID', googtrans: '/id/id' },
    { code: 'en', name: 'English', flag: 'EN', googtrans: '/id/en' },
    { code: 'ja', name: 'Japanese', flag: 'JP', googtrans: '/id/ja' }
  ];

  // Helper to read the googtrans cookie
  const getTransCookie = () => {
    const match = document.cookie.match(/googtrans=([^;]+)/);
    if (match) {
      const val = match[1];
      if (val.endsWith('/en')) return 'en';
      if (val.endsWith('/ja')) return 'ja';
    }
    return 'id';
  };

  useEffect(() => {
    setLang(getTransCookie());
  }, []);

  const changeLanguage = (code, googtransVal) => {
    const domain = window.location.hostname;
    // Set cookie for path /
    document.cookie = `googtrans=${googtransVal}; path=/;`;
    document.cookie = `googtrans=${googtransVal}; path=/; domain=.${domain};`;

    if (domain === 'localhost' || domain === '127.0.0.1') {
      document.cookie = `googtrans=${googtransVal}; path=/; domain=localhost;`;
    }

    setLang(code);
    setLangDropdownOpen(false);
    window.location.reload();
  };

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

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      {/* Hidden container to keep the Google Translate API engine working */}
      <div id="google_translate_element" style={{ display: 'none' }}></div>

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
          <a href="/#berita" onClick={() => handleLinkClick('#berita')} className="nav-link">Berita & Informasi</a>
        </nav>

        {/* Action Button & Language Picker */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>

          {/* Custom Flags Dropdown */}
          <div className="lang-selector-container">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="lang-selector-btn"
              aria-label="Pilih Bahasa"
            >
              <span>{languages.find(l => l.code === lang)?.flag}</span>
              <span>{languages.find(l => l.code === lang)?.name}</span>
              <span style={{ fontSize: '0.65rem', marginLeft: '2px', color: 'var(--color-accent-red)' }}>▼</span>
            </button>

            {langDropdownOpen && (
              <div className="lang-dropdown-menu">
                {languages.map(l => (
                  <button
                    key={l.code}
                    onClick={() => changeLanguage(l.code, l.googtrans)}
                    className={`lang-dropdown-item ${lang === l.code ? 'active' : ''}`}
                  >
                    <span style={{ fontSize: '1.1rem' }}>{l.flag}</span>
                    <span>{l.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

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
          <a href="/#berita" onClick={() => handleLinkClick('#berita')} className="nav-link" style={{ fontSize: '1.1rem' }}>Berita & Informasi</a>

          {/* Custom Language selection in mobile list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>Pilih Bahasa / Language</span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {languages.map(l => (
                <button
                  key={l.code}
                  onClick={() => changeLanguage(l.code, l.googtrans)}
                  style={{
                    flexGrow: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    padding: '0.5rem',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: lang === l.code ? 'rgba(15, 44, 89, 0.05)' : '#fff',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    color: 'var(--color-primary)'
                  }}
                >
                  <span>{l.flag}</span>
                  <span>{l.code.toUpperCase()}</span>
                </button>
              ))}
            </div>
          </div>

          <button onClick={handleDaftarClick} className="btn btn-primary" style={{ width: '100%' }}>
            Daftar Sekarang
          </button>
        </div>
      )}
    </header>
  );
}
