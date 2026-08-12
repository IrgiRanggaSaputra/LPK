import React from 'react';
import { Calendar, Wallet, GraduationCap, Clock } from 'lucide-react';
import './Programs.css';

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
            Pilih jalur karir yang paling sesuai dengan latar belakang dan cita-cita Anda. Kami membimbing Anda dari nol hingga terbang.
          </p>
        </div>

        {/* Programs Grid */}
        <div className="programs-grid">
          {/* Card 1: Ginou Jisshusei */}
          <div className="program-card">
            <span className="program-badge">Populer</span>
            <img 
              src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=600&auto=format&fit=crop" 
              alt="Ginou Jisshusei Magang Jepang" 
              className="program-img"
            />
            <div className="program-content">
              <span className="program-title-jp">技能実習 (GINOU JISSHUSEI)</span>
              <h3 className="program-title">Program Magang Jepang</h3>
              <p className="program-desc">
                Program pelatihan kerja praktek langsung di perusahaan Jepang untuk meningkatkan keterampilan teknis dan etos kerja standar internasional selama 3 tahun.
              </p>
              
              <ul className="program-details">
                <li className="program-details-item">
                  <Calendar className="program-details-icon" />
                  <span><strong>Syarat Usia</strong>: 18 - 26 Tahun</span>
                </li>
                <li className="program-details-item">
                  <GraduationCap className="program-details-icon" />
                  <span><strong>Syarat Pendidikan</strong>: Minimal SMA/SMK Sederajat</span>
                </li>
                <li className="program-details-item">
                  <Clock className="program-details-icon" />
                  <span><strong>Durasi Kontrak</strong>: 3 Tahun (Dapat Diperpanjang)</span>
                </li>
                <li className="program-details-item">
                  <Wallet className="program-details-icon" />
                  <span><strong>Estimasi Gaji</strong>: Rp 14 - 18 Juta / Bulan (Bersih)</span>
                </li>
              </ul>

              <div className="program-footer">
                <button 
                  onClick={() => handleProgramSelect('Ginou Jisshusei (Magang)')}
                  className="btn btn-secondary" 
                  style={{ width: '100%' }}
                >
                  Pilih Program Magang
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Tokutei Ginou */}
          <div className="program-card">
            <span className="program-badge" style={{ backgroundColor: 'var(--color-accent-gold)', color: 'var(--color-primary-dark)' }}>Profesional</span>
            <img 
              src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=600&auto=format&fit=crop" 
              alt="Tokutei Ginou SSW Jepang" 
              className="program-img"
            />
            <div className="program-content">
              <span className="program-title-jp">特定技能 (TOKUTEI GINOU)</span>
              <h3 className="program-title">Specified Skilled Worker (SSW)</h3>
              <p className="program-desc">
                Jalur visa kerja keahlian khusus bagi profesional yang telah menguasai bahasa Jepang tingkat dasar dan memiliki keahlian bidang tertentu (seperti perawat lansia, pengolahan makanan, restoran, dll).
              </p>
              
              <ul className="program-details">
                <li className="program-details-item">
                  <Calendar className="program-details-icon" />
                  <span><strong>Syarat Usia</strong>: 18 - 30 Tahun (Pria & Wanita)</span>
                </li>
                <li className="program-details-item">
                  <GraduationCap className="program-details-icon" />
                  <span><strong>Syarat Tambahan</strong>: Sertifikat JFT/JLPT N4 & Ujian Skill</span>
                </li>
                <li className="program-details-item">
                  <Clock className="program-details-icon" />
                  <span><strong>Durasi Kontrak</strong>: 5 Tahun (Dapat Diperpanjang Tanpa Batas)</span>
                </li>
                <li className="program-details-item">
                  <Wallet className="program-details-icon" />
                  <span><strong>Estimasi Gaji</strong>: Rp 18 - 25 Juta / Bulan (Setara UMR Jepang)</span>
                </li>
              </ul>

              <div className="program-footer">
                <button 
                  onClick={() => handleProgramSelect('Tokutei Ginou (SSW)')}
                  className="btn btn-gold" 
                  style={{ width: '100%' }}
                >
                  Pilih Program SSW
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
