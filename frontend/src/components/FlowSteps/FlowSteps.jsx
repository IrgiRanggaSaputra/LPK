import React from 'react';
import './FlowSteps.css';

export default function FlowSteps() {
  const steps = [
    {
      num: "01",
      title: "Pendaftaran & Seleksi Berkas",
      desc: "Mengisi formulir pendaftaran online di website ini, dilanjutkan verifikasi berkas administrasi dan wawancara awal di kantor LPK."
    },
    {
      num: "02",
      title: "Pelatihan Bahasa & Budaya",
      desc: "Mengikuti pendidikan intensif bahasa Jepang (Minna no Nihongo), pengenalan budaya kerja Jepang, serta bimbingan fisik, mental, dan disiplin (FMD)."
    },
    {
      num: "03",
      title: "Wawancara dengan Perusahaan (Mensetsu)",
      desc: "Peserta dipertemukan langsung dengan pihak perwakilan perusahaan penerima dari Jepang secara online maupun offline (wawancara kerja)."
    },
    {
      num: "04",
      title: "Penerbitan COE & Visa Kerja",
      desc: "Setelah lulus wawancara, pihak LPK akan mengurus Certificate of Eligibility (COE) ke imigrasi Jepang dan mengajukan visa kerja resmi di Kedutaan."
    },
    {
      num: "05",
      title: "Pemberangkatan & Mulai Kerja",
      desc: "Pemberangkatan secara berkelompok dari Bandara Soekarno-Hatta menuju Jepang. Peserta dijemput oleh pihak Kumiai dan langsung bekerja."
    }
  ];

  return (
    <section id="alur" className="section container">
      {/* Title */}
      <div className="section-title-wrapper">
        <span className="section-tag">ALUR PROSES</span>
        <h2 className="section-title">Langkah Menuju Karir Sukses</h2>
        <p className="section-subtitle">
          Prosedur transparan dan terstruktur. Kami mendampingi Anda di setiap langkah perjuangan Anda.
        </p>
      </div>

      {/* Timeline Wrapper */}
      <div className="flow-container">
        <div className="flow-timeline-line"></div>
        
        {steps.map((step, idx) => (
          <div key={idx} className="flow-step-item animate-slide-up" style={{ animationDelay: `${idx * 0.1}s` }}>
            <div className="flow-node">
              {idx + 1}
            </div>
            <div className="flow-card">
              <span className="flow-step-num">Langkah {step.num}</span>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
