import React, { useState, useEffect } from 'react';
import './TestimonialsGallery.css';

const DEFAULT_TESTIMONIALS = [
  {
    name: "Ahmad Fauzi",
    city: "Tokyo, Jepang",
    program: "Alumni Magang Otomotif (2024)",
    quote: "Sangat bersyukur belajar di LPK ini. Pelatihan bahasa dan disiplin fisiknya keras tapi itu yang membuat saya bisa langsung adaptasi dengan cepat di pabrik Tokyo. Gaji lancar dan fasilitas asrama sangat baik.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop"
  },
  {
    name: "Rina Kartika",
    city: "Osaka, Jepang",
    program: "Alumni Tokutei Ginou - Care Worker (2025)",
    quote: "Program SSW Kaigo benar-benar mengubah hidup saya. Bimbingan LPK dari persiapan ujian JFT, ujian skill Kaigo, hingga pengurusan visa kerja di Osaka dibimbing sampai tuntas. Sekarang saya bisa bantu ekonomi keluarga di Indonesia.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop"
  },
  {
    name: "Dian Saputra",
    city: "Nagoya, Jepang",
    program: "Alumni Magang Pengolahan Makanan (2024)",
    quote: "Pilihan terbaik bagi yang mau kerja ke Jepang secara resmi. Sensei di LPK sangat sabar membimbing tata bahasa dan Kaiwa sehari-hari. Dokumen transparan dan tidak ada pungli tersembunyi. Sukses terus untuk LPK!",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop"
  }
];

export default function TestimonialsGallery() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/testimoni');
      const result = await response.json();
      if (response.ok && result.success && result.data.length > 0) {
        setTestimonials(result.data);
      } else {
        setTestimonials(DEFAULT_TESTIMONIALS);
      }
    } catch (err) {
      console.error('Failed to load testimonials:', err);
      setTestimonials(DEFAULT_TESTIMONIALS);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section section-alt" style={{ overflow: 'hidden' }}>
      <div className="container">
        {/* Title */}
        <div className="section-title-wrapper">
          <span className="section-tag">TESTIMONI</span>
          <h2 className="section-title">Kisah Sukses Alumni Kami</h2>
          <p className="section-subtitle">
            Kebahagiaan terbesar kami adalah melihat para alumni sukses meraih impian dan bekerja dengan nyaman di Jepang.
          </p>
        </div>
      </div>

      {/* Testimonials Marquee Slider */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
          <p>Memuat testimoni...</p>
        </div>
      ) : (
        <div className="testi-marquee-container">
          <div className="testi-marquee-track">
            {/* Group 1 */}
            <div className="testi-marquee-group">
              {testimonials.map((testi, idx) => (
                <div key={`g1-${testi.id || idx}`} className="testi-card">
                  <div className="testi-quote">
                    <p>{testi.quote}</p>
                  </div>
                  <div className="testi-profile">
                    <img 
                      src={testi.avatar} 
                      alt={testi.name} 
                      className="testi-avatar"
                    />
                    <div className="testi-info">
                      <h4>{testi.name}</h4>
                      <p style={{ color: 'var(--color-accent-red)', fontWeight: 'bold' }}>{testi.city}</p>
                      <p>{testi.program}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Group 2 (Duplicate for infinite seamless scroll) */}
            <div className="testi-marquee-group">
              {testimonials.map((testi, idx) => (
                <div key={`g2-${testi.id || idx}`} className="testi-card">
                  <div className="testi-quote">
                    <p>{testi.quote}</p>
                  </div>
                  <div className="testi-profile">
                    <img 
                      src={testi.avatar} 
                      alt={testi.name} 
                      className="testi-avatar"
                    />
                    <div className="testi-info">
                      <h4>{testi.name}</h4>
                      <p style={{ color: 'var(--color-accent-red)', fontWeight: 'bold' }}>{testi.city}</p>
                      <p>{testi.program}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
