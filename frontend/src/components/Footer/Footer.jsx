import React from 'react';
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">

          {/* Brand Info */}
          <div className="footer-brand">
            <h3>LPK <span>JEPANG</span></h3>
            <p>
              Lembaga Pelatihan Kerja resmi terpercaya. Menyiapkan generasi muda unggul, kompeten, berkarakter, dan disiplin tinggi untuk berkarir sukses di Jepang.
            </p>
            <div className="footer-socials">
              <a href="#" className="footer-social-btn" aria-label="Facebook"><Facebook size={18} /></a>
              <a href="#" className="footer-social-btn" aria-label="Instagram"><Instagram size={18} /></a>
              <a href="#" className="footer-social-btn" aria-label="Youtube"><Youtube size={18} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-title">Tautan Cepat</h4>
            <ul className="footer-links" style={{ marginTop: '1rem' }}>
              <li><a href="#hero">Home</a></li>
              <li><a href="#tentang">Tentang Kami</a></li>
              <li><a href="#program">Program Pelatihan</a></li>
              <li><a href="/daftar">Pendaftaran</a></li>
              <li><a href="#alur">Alur Proses</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </div>

          {/* Contacts & Maps */}
          <div>
            <h4 className="footer-title">Kontak & Lokasi</h4>
            <div style={{ marginTop: '1rem' }}>
              <div className="footer-contact-item">
                <MapPin className="footer-contact-icon" />
                <span>Jl. Sakura No. 12, Kebayoran Baru, Jakarta Selatan, DKI Jakarta 12130</span>
              </div>
              <div className="footer-contact-item">
                <Phone className="footer-contact-icon" />
                <span>+62 812-3456-7890</span>
              </div>
              <div className="footer-contact-item">
                <Mail className="footer-contact-icon" />
                <span>info@lpkjepangresmi.co.id</span>
              </div>
            </div>

            {/* Embedded Google Map */}
            <div className="footer-map-wrapper" style={{ marginTop: '1.5rem' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d17465.07296725593!2d107.6252569267201!3d-6.967355320058008!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e947377ed12f%3A0xd10aff7364d114a9!2sLPK%20Kiyoraka%20Asia%20Global!5e1!3m2!1sid!2sid!4v1786521973480!5m2!1sid!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Peta Lokasi LPK Jepang"
              ></iframe>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="footer-copyright">
          <p>© {new Date().getFullYear()} LPK KIYORAKA GLOBAL.</p>
        </div>
      </div>
    </footer>
  );
}
