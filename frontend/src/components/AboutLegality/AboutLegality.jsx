import React from 'react';
import { ShieldCheck, Award, Users, BookOpen } from 'lucide-react';
import './AboutLegality.css';

export default function AboutLegality() {
  return (
    <section id="tentang" className="section container">
      <div className="about-grid">
        {/* Left Side: Photo and Legality Badge */}
        <div className="about-graphics animate-slide-up">
          <img 
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop" 
            alt="Kegiatan Belajar Bahasa Jepang" 
            className="about-img-main"
          />
          <div className="about-badge-legality">
            <h3>TERAKREDITASI</h3>
            <p>Sistem Manajemen Mutu</p>
          </div>
        </div>

        {/* Right Side: Information Content */}
        <div className="about-info animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <span className="section-tag">TENTANG KAMI</span>
          <h2 className="about-title">
            Lembaga Pelatihan Kerja Resmi dengan Jaminan <span>Keberangkatan</span>
          </h2>
          
          <p className="about-text">
            Didirikan sejak tahun 2020, LPK Jepang lahir dengan dedikasi penuh untuk mengantarkan putra-putri terbaik bangsa meraih karir bermartabat di Jepang. Lebih dari sekadar tempat belajar bahasa, kami adalah wadah penempaan fisik, mental, dan karakter agar setiap calon tenaga kerja siap beradaptasi dengan budaya kerja industri Jepang yang dinamis.
          </p>

          {/* Core Features Grid */}
          <div className="about-features">
            <div className="about-feat-item">
              <BookOpen className="about-feat-icon" />
              <div className="about-feat-content">
                <h4>Kurikulum Standar Jepang</h4>
                <p>Materi N5 hingga N4 dengan fokus percakapan harian (Kaiwa).</p>
              </div>
            </div>
            
            <div className="about-feat-item">
              <ShieldCheck className="about-feat-icon" />
              <div className="about-feat-content">
                <h4>Legalitas Resmi & Terjamin</h4>
                <p>Terdaftar resmi di KEMNAKER RI dengan izin SO resmi terverifikasi.</p>
              </div>
            </div>
            
            <div className="about-feat-item">
              <Users className="about-feat-icon" />
              <div className="about-feat-content">
                <h4>Instruktur Berpengalaman</h4>
                <p>Diajar langsung oleh eks-magang Jepang dan Sensei profesional.</p>
              </div>
            </div>

            <div className="about-feat-item">
              <Award className="about-feat-icon" />
              <div className="about-feat-content">
                <h4>Pembinaan Fisik & Mental (FMD)</h4>
                <p>Membentuk sikap disiplin tinggi dan kebiasaan kerja 5S khas Jepang.</p>
              </div>
            </div>
          </div>

          {/* Highlight Legality Banner */}
          <div className="legality-banner">
            <div className="legality-banner-icon">
              <ShieldCheck size={32} />
            </div>
            <div className="legality-banner-text">
              <h4>Legalitas & Izin KEMNAKER RI</h4>
              <p>No. Izin LPK: <strong>503/482/LATTAS/2026</strong> | SO (Sending Organization) Resmi: <strong>KEP.891/LATTAS/IX/2026</strong></p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
