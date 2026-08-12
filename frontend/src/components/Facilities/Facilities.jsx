import React, { useState, useEffect } from 'react';
import { Home, Compass, GraduationCap } from 'lucide-react';
import './Facilities.css';

// Import local images for Asrama
import asrama1 from '../../images/asrama/asrama1.png';
import asrama2 from '../../images/asrama/asrama2.png';
import asrama3 from '../../images/asrama/asrama3.png';

// Import local images for Kelas
import kelas1 from '../../images/kelas/kelas1.png';
import kelas2 from '../../images/kelas/kelas2.png';
import kelas3 from '../../images/kelas/kelas3.png';

// Import local images for Mushola
import mushola1 from '../../images/mushola/mushola1.png';
import mushola2 from '../../images/mushola/mushola2.png';

// Autoplay Slideshow Sub-component
const AutoplaySlideshow = ({ images, alt = "Fasilitas", interval = 3500 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);
    return () => clearInterval(timer);
  }, [images, interval]);

  if (!images || images.length === 0) return null;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {images.map((img, index) => (
        <img
          key={index}
          src={img}
          alt={`${alt} slide ${index + 1}`}
          className="facility-img"
          style={{
            position: index === 0 ? 'relative' : 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: currentIndex === index ? 1 : 0,
            transition: 'opacity 0.8s ease-in-out',
            zIndex: currentIndex === index ? 2 : 1
          }}
        />
      ))}
      
      {/* Slide dots indicators */}
      {images.length > 1 && (
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '6px',
          zIndex: 3,
          backgroundColor: 'rgba(15, 44, 89, 0.4)',
          padding: '4px 8px',
          borderRadius: '10px',
          backdropFilter: 'blur(2px)'
        }}>
          {images.map((_, index) => (
            <span
              key={index}
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: currentIndex === index ? 'var(--color-bg-white)' : 'rgba(255,255,255,0.4)',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function Facilities() {
  const items = [
    {
      title: "Asrama Pembiasaan Karakter",
      desc: "Lebih dari sekadar tempat beristirahat yang bersih dan nyaman. Asrama LPK adalah laboratorium pembiasaan karakter. Di sini, peserta berlatih hidup mandiri, menerapkan budaya kebersihan berkelompok, bangun tepat waktu, dan disiplin merawat lingkungan harian ala Jepang.",
      icon: <Home size={22} />,
      images: [asrama1, asrama2, asrama3]
    },
    {
      title: "Ruang Kelas Audio Visual AC",
      desc: "Proses belajar bahasa Jepang menjadi menyenangkan dan efektif. Ruang kelas kami dirancang modern dengan pendingin ruangan (AC), alat bantu audio-visual interaktif untuk melatih pendengaran (Choukai), serta modul belajar terstruktur guna memastikan kelulusan ujian kompetensi bahasa Jepang (JFT/JLPT).",
      icon: <GraduationCap size={22} />,
      images: [kelas1, kelas2, kelas3]
    },
    {
      title: "Mushola Nyaman & Asri",
      desc: "Ketenangan spiritual adalah kunci ketangguhan mental. Kami menyediakan Mushola yang bersih, rapi, dan sejuk di lingkungan LPK untuk memudahkan para peserta melaksanakan ibadah tepat waktu secara berjamaah, menjaga keseimbangan spiritual selama masa pendidikan intensif.",
      icon: <Compass size={22} />,
      images: [mushola1, mushola2]
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
            <div className="facility-img-wrapper" style={{ height: '220px', position: 'relative' }}>
              <AutoplaySlideshow images={facility.images} alt={facility.title} />
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
