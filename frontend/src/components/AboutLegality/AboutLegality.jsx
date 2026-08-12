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

          <p className="about-text" style={{ textAlign: "justify" }}>
            LPK Kiyoraka Asia Global mulai berdiri sejak tahun 2018.<br />
            LPK Kiyoraka Asia Global atau lebih dikenal sebagai LPK Kiyoraka berhasil bertahan dari gempuran virus corona yang mewabah mulai dari akhir tahun 2019, setahun setelah LPK Kiyoraka berdiri. Kini setelah wabah berakhir, LPK Kiyoraka siap menerima Peserta yang berminat untuk magang ke jepang atau sekedar belajar bahasa jepang hingga level tertentu.
          </p>
          <br />
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
                <p>Diajar langsung oleh eks-magang Jepang and Sensei profesional.</p>
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

      {/* Visi Misi Section */}
      <div className="vision-mission-wrapper animate-slide-up" style={{ marginTop: '4rem' }}>
        <div className="vision-card">
          <div className="vision-header">
            <span className="vision-tag-label">VISION</span>
            <h3>Visi Kami</h3>
          </div>
          <p className="vision-text">
            “Menjadi LPK yang paling berkontribusi dalam membentuk karakter pemuda-pemudi Indonesia melalui 4 aspek : Attitude, Skill, Knowledge dan Development.”
          </p>
        </div>

        <div className="mission-card">
          <div className="mission-header">
            <span className="mission-tag-label">MISSION</span>
            <h3>Misi Kami</h3>
          </div>
          <ul className="mission-list">
            <li>
              <div className="mission-bullet">1</div>
              <p>Menjadi LPK Management dan Bahasa Jepang yang mencetak siswa berdaya saing dan skill.</p>
            </li>
            <li>
              <div className="mission-bullet">2</div>
              <p>Menjadi lembaga pelatihan kerja yang bisa menyerap dan menyalurkan tenaga kerja yang berkualitas dan memiliki etos kerja tinggi melalui program pemagangan.</p>
            </li>
            <li>
              <div className="mission-bullet">3</div>
              <p>Menjadi lembaga yang memberikan peluang kesempatan kerja bertaraf internasional, sehingga mampu mencetak SDM yang memiliki wawasan luas.</p>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
