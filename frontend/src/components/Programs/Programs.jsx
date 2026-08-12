import React from 'react';
import { Calendar, Wallet, GraduationCap, Clock, BookOpen, Briefcase, Award } from 'lucide-react';
import './Programs.css';

// Inline SVG component for Pemagangan Jepang
const PemaganganSvg = () => (
  <svg viewBox="0 0 400 240" className="program-img" style={{ display: 'block', backgroundColor: '#f8fafc' }}>
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#0F2C59', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#1A3E75', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <rect width="400" height="240" fill="#f8fafc" />
    <circle cx="200" cy="120" r="80" fill="url(#grad1)" opacity="0.08" />

    {/* Mount Fuji Symbol background */}
    <path d="M 120,180 L 200,90 L 280,180 Z" fill="#e2e8f0" />
    <path d="M 173,120 L 200,90 L 227,120 Z" fill="#f1f5f9" />

    {/* Sun */}
    <circle cx="200" cy="80" r="30" fill="#D80032" opacity="0.15" />

    {/* Trainee Hat & Gear (Technical) */}
    <g transform="translate(140, 110)" stroke="#0F2C59" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <circle cx="30" cy="30" r="15" />
      <path d="M30,10 L30,15 M30,45 L30,50 M10,30 L15,30 M45,30 L50,30" />
      <path d="M16,16 L20,20 M40,40 L44,44 M16,44 L20,40 M40,16 L44,20" />
    </g>

    {/* Agriculture Seedling */}
    <g transform="translate(210, 110)" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <path d="M30,50 L30,20 C30,20 15,15 15,30" />
      <path d="M30,35 C30,35 45,30 45,45" />
      <circle cx="30" cy="15" r="3" fill="#10B981" />
    </g>

    {/* Industry Building / Construction */}
    <g transform="translate(175, 140)" stroke="#C5A880" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <rect x="5" y="10" width="40" height="25" />
      <path d="M 5,10 L 25,0 L 45,10" />
      <line x1="25" y1="10" x2="25" y2="35" />
    </g>
  </svg>
);

// Inline SVG component for Persiapan JLPT
const JlptSvg = () => (
  <svg viewBox="0 0 400 240" className="program-img" style={{ display: 'block', backgroundColor: '#f8fafc' }}>
    <defs>
      <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#D80032', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#B00028', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <rect width="400" height="240" fill="#f8fafc" />
    <circle cx="200" cy="120" r="80" fill="url(#grad2)" opacity="0.05" />

    {/* Torii Gate Outline */}
    <g transform="translate(165, 55)" stroke="#e2e8f0" strokeWidth="3" fill="none">
      <path d="M 10,10 L 60,10 M 15,20 L 55,20 M 25,20 L 25,60 M 45,20 L 45,60" />
    </g>

    {/* Open Book */}
    <g transform="translate(140, 110)" stroke="#0F2C59" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <path d="M10,40 C20,35 50,35 60,40 L60,10 C50,5 20,5 10,10 Z" fill="#ffffff" />
      <path d="M110,40 C100,35 70,35 60,40 L60,10 C70,5 100,5 110,10 Z" fill="#ffffff" />
      <path d="M 60,10 L 60,40" />
      <path d="M20,17 H45 M20,24 H45 M75,17 H100 M75,24 H100" strokeWidth="1.5" opacity="0.6" stroke="#0F2C59" />
    </g>

    {/* Graduation Cap */}
    <g transform="translate(180, 75)" stroke="#C5A880" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <polygon points="20,5 38,12 20,19 2,12" fill="#C5A880" fillOpacity="0.2" />
      <path d="M8,15 V22 C8,25 32,25 32,22 V15" />
      <path d="M30,12 V25 L34,27" />
    </g>

    {/* Japanese Kanji Character symbol */}
    <text x="200" y="55" fontSize="24" fontFamily="serif" fill="#D80032" textAnchor="middle" fontWeight="bold">語</text>
  </svg>
);

// Inline SVG component for Persiapan JFT Basic
const JftSvg = () => (
  <svg viewBox="0 0 400 240" className="program-img" style={{ display: 'block', backgroundColor: '#f8fafc' }}>
    <defs>
      <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#C5A880', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#A88D65', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <rect width="400" height="240" fill="#f8fafc" />
    <circle cx="200" cy="120" r="80" fill="url(#grad3)" opacity="0.08" />

    {/* Laptop / Computer Screen */}
    <g transform="translate(125, 70)" stroke="#0F2C59" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <rect x="20" y="10" width="110" height="70" rx="4" fill="#ffffff" />
      <path d="M10,85 H140 L130,95 H20 Z" fill="#e2e8f0" />
      <circle cx="75" cy="90" r="2" fill="#0F2C59" />

      {/* Test A2 Badge on Screen */}
      <rect x="35" y="25" width="80" height="20" rx="3" fill="#10B981" fillOpacity="0.1" stroke="#10B981" strokeWidth="1.5" />
      <text x="75" y="39" fontSize="10" fontFamily="sans-serif" fill="#10B981" textAnchor="middle" fontWeight="bold" stroke="none">JFT BASIC: A2</text>

      {/* Text lines simulating exam questions */}
      <line x1="35" y1="55" x2="115" y2="55" strokeWidth="1.5" opacity="0.4" stroke="#0F2C59" />
      <line x1="35" y1="62" x2="95" y2="62" strokeWidth="1.5" opacity="0.4" stroke="#0F2C59" />
    </g>

    {/* Headphones wrapping the laptop */}
    <g transform="translate(115, 65)" stroke="#D80032" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.8">
      <path d="M 20,70 C 20,20 140,20 140,70" />
      <rect x="12" y="60" width="10" height="20" rx="2" fill="#D80032" />
      <rect x="138" y="60" width="10" height="20" rx="2" fill="#D80032" />
    </g>

    {/* Checkmark Badge */}
    <g transform="translate(245, 140)" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <circle cx="15" cy="15" r="12" fill="#ffffff" />
      <path d="M9,15 L13,19 L21,11" />
    </g>
  </svg>
);

export default function Programs({ onSelectProgram }) {
  const handleProgramSelect = (programName) => {
    onSelectProgram(programName);
  };

  return (
    <section id="program" className="section section-alt">
      <div className="container">
        {/* Title */}
        <div className="section-title-wrapper">
          <span className="section-tag">PROGRAM KAMI</span>
          <h2 className="section-title">Program Pelatihan & Keberangkatan</h2>
          <p className="section-subtitle">
            Pilih program yang paling sesuai dengan cita-cita dan kebutuhan Anda. Kami membimbing Anda dari nol hingga sukses.
          </p>
        </div>

        {/* Programs Grid */}
        <div className="programs-grid">
          {/* Card 1: Pemagangan Jepang */}
          <div className="program-card">
            <span className="program-badge">Magang Kerja</span>
            <PemaganganSvg />
            <div className="program-content">
              <span className="program-title-jp">技能実習 (GINOU JISSHUSEI)</span>
              <h3 className="program-title">Pemagangan Jepang</h3>
              <p className="program-desc">
                Program pelatihan kerja praktek di berbagai lini pekerjaan di Jepang untuk meningkatkan keterampilan teknis dan etos kerja standar internasional.
              </p>

              <ul className="program-details">
                <li className="program-details-item">
                  <Briefcase className="program-details-icon" />
                  <span><strong>Lini Kerja</strong>: Pertanian, Konstruksi, Produksi Makanan, Perawatan Mobil, Caregiver</span>
                </li>
                <li className="program-details-item">
                  <Calendar className="program-details-icon" />
                  <span><strong>Syarat Usia</strong>: 18 - 26 Tahun</span>
                </li>
                <li className="program-details-item">
                  <Clock className="program-details-icon" />
                  <span><strong>Durasi</strong>: Kontrak 3 Tahun (Dapat Diperpanjang)</span>
                </li>
                <li className="program-details-item">
                  <Wallet className="program-details-icon" />
                  <span><strong>Estimasi Gaji</strong>: Rp 14 - 18 Juta / Bulan (Bersih)</span>
                </li>
              </ul>

              <div className="program-footer">
                <button
                  onClick={() => handleProgramSelect('Pemagangan Jepang')}
                  className="btn btn-secondary"
                  style={{ width: '100%' }}
                >
                  Pilih Pemagangan Jepang
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Persiapan JLPT */}
          <div className="program-card">
            <span className="program-badge" style={{ backgroundColor: 'var(--color-primary-light)', color: '#fff' }}>Belajar Bahasa</span>
            <JlptSvg />
            <div className="program-content">
              <span className="program-title-jp">日本語能力試験 (JLPT PREPARATION)</span>
              <h3 className="program-title">Persiapan JLPT</h3>
              <p className="program-desc">
                Program belajar bahasa Jepang komprehensif bagi peserta yang ingin menguasai bahasa Jepang tingkat dasar hingga menengah tanpa minat pergi ke Jepang.
              </p>

              <ul className="program-details">
                <li className="program-details-item">
                  <BookOpen className="program-details-icon" />
                  <span><strong>Materi</strong>: Tata Bahasa, Kanji, Dokkai & Choukai</span>
                </li>
                <li className="program-details-item">
                  <GraduationCap className="program-details-icon" />
                  <span><strong>Tingkatan</strong>: Level N5 sampai N3</span>
                </li>
                <li className="program-details-item">
                  <Calendar className="program-details-icon" />
                  <span><strong>Peserta</strong>: Mahasiswa, Karyawan, Umum & Hobi</span>
                </li>
                <li className="program-details-item">
                  <Award className="program-details-icon" />
                  <span><strong>Sertifikasi</strong>: Persiapan Ujian Resmi JLPT</span>
                </li>
              </ul>

              <div className="program-footer">
                <button
                  onClick={() => handleProgramSelect('Persiapan JLPT')}
                  className="btn btn-secondary"
                  style={{ width: '100%', backgroundColor: 'var(--color-primary-light)' }}
                >
                  Pilih Persiapan JLPT
                </button>
              </div>
            </div>
          </div>

          {/* Card 3: Persiapan JFT Basic */}
          <div className="program-card">
            <span className="program-badge" style={{ backgroundColor: 'var(--color-accent-gold)', color: 'var(--color-primary-dark)' }}>Ujian Kerja SSW</span>
            <JftSvg />
            <div className="program-content">
              <span className="program-title-jp">国際交流基金 (JFT-BASIC PREPARATION)</span>
              <h3 className="program-title">Persiapan JFT Basic</h3>
              <p className="program-desc">
                Bimbingan belajar intensif untuk membantu calon pekerja berkemampuan khusus (Tokutei Ginou / SSW) mendapatkan kompetensi bahasa Jepang standar JFT Basic A2.
              </p>

              <ul className="program-details">
                <li className="program-details-item">
                  <Briefcase className="program-details-icon" />
                  <span><strong>Target</strong>: Kandidat Tokutei Ginou (SSW) Jepang</span>
                </li>
                <li className="program-details-item">
                  <Clock className="program-details-icon" />
                  <span><strong>Durasi Belajar</strong>: Kelas Intensif 3 - 4 Bulan</span>
                </li>
                <li className="program-details-item">
                  <BookOpen className="program-details-icon" />
                  <span><strong>Kurikulum</strong>: Standar Ujian JFT-Basic A2</span>
                </li>
                <li className="program-details-item">
                  <Award className="program-details-icon" />
                  <span><strong>Sertifikat</strong>: Dokumen Persyaratan Utama Visa SSW</span>
                </li>
              </ul>

              <div className="program-footer">
                <button
                  onClick={() => handleProgramSelect('Persiapan JFT Basic')}
                  className="btn btn-gold"
                  style={{ width: '100%' }}
                >
                  Pilih Persiapan JFT Basic
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
