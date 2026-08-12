import React from 'react';
import { Home, Compass, GraduationCap, Users } from 'lucide-react';
import './Facilities.css';

export default function Facilities() {
  const items = [
    {
      title: "Asrama Pembiasaan Karakter",
      desc: "Lebih dari sekadar tempat beristirahat yang bersih dan nyaman. Asrama LPK adalah laboratorium pembiasaan karakter. Di sini, peserta berlatih hidup mandiri, menerapkan budaya kebersihan berkelompok, bangun tepat waktu, dan disiplin merawat lingkungan harian ala Jepang.",
      icon: <Home size={22} />,
      img: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=400&auto=format&fit=crop"
    },
    {
      title: "Mushola Nyaman & Asri",
      desc: "Ketenangan spiritual adalah kunci ketangguhan mental. Kami menyediakan Mushola yang bersih, rapi, dan sejuk di lingkungan LPK untuk memudahkan para peserta melaksanakan ibadah tepat waktu secara berjamaah, menjaga keseimbangan spiritual selama masa pendidikan intensif.",
      icon: <Compass size={22} />,
      img: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=400&auto=format&fit=crop"
    },
    {
      title: "Ruang Kelas Audio Visual AC",
      desc: "Proses belajar bahasa Jepang menjadi menyenangkan dan efektif. Ruang kelas kami dirancang modern dengan pendingin ruangan (AC), alat bantu audio-visual interaktif untuk melatih pendengaran (Choukai), serta modul belajar terstruktur guna memastikan kelulusan ujian kompetensi bahasa Jepang (JFT/JLPT).",
      icon: <GraduationCap size={22} />,
      img: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=400&auto=format&fit=crop"
    },
    {
      title: "Aula Serbaguna & Rapat",
      desc: "Tempat bertemunya kolaborasi, evaluasi, dan transparansi. Aula ini berfungsi sebagai pusat koordinasi harian, tempat briefing keberangkatan, ujian berkala, serta wadah sosialisasi perkembangan belajar calon peserta secara berkala kepada orang tua.",
      icon: <Users size={22} />,
      img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=400&auto=format&fit=crop"
    }
  ];

  return (
    <section id="fasilitas" className="section container">
      {/* Title */}
      <div className="section-title-wrapper">
        <span className="section-tag">FASILITAS LPK</span>
        <h2 className="section-title">Fasilitas Belajar & Asrama</h2>
        <p className="section-subtitle">
          Fasilitas lengkap dan modern disiapkan untuk menunjang kenyamanan belajar, membiasakan pola hidup bersih, serta menanamkan budaya disiplin tinggi.
        </p>
      </div>

      {/* Facilities Grid */}
      <div className="facilities-grid">
        {items.map((facility, idx) => (
          <div key={idx} className="facility-card animate-slide-up" style={{ animationDelay: `${idx * 0.1}s` }}>
            <div className="facility-img-wrapper">
              <img 
                src={facility.img} 
                alt={facility.title} 
                className="facility-img"
              />
            </div>
            
            <div className="facility-body">
              <div className="facility-icon-wrapper">
                {facility.icon}
              </div>
              <h3>{facility.title}</h3>
              <p>{facility.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
