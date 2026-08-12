import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import './FAQAccordion.css';

export default function FAQAccordion() {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "Apakah LPK ini resmi dan berizin SO?",
      answer: "Ya, LPK kami resmi terdaftar di KEMNAKER RI dengan Nomor Izin LPK: 503/482/LATTAS/2026 dan status Sending Organization (SO) resmi KEP.891/LATTAS/IX/2026. Seluruh proses rekrutmen hingga pemberangkatan dilakukan secara transparan dan sesuai hukum."
    },
    {
      question: "Berapa lama waktu pelatihan bahasa hingga terbang?",
      answer: "Rata-rata pelatihan memakan waktu 4 hingga 6 bulan. Durasi ini mencakup materi bahasa Jepang tingkat dasar (N5/N4), pelatihan fisik, pengenalan etos kerja (FMD), serta persiapan wawancara kerja (Mensetsu) bersama user Jepang."
    },
    {
      question: "Bagaimana jika saya belum bisa berbahasa Jepang sama sekali?",
      answer: "Anda tidak perlu khawatir. Kurikulum LPK kami dirancang untuk pemula yang belajar dari nol (diawali pengenalan huruf Hiragana, Katakana, kosakata dasar, hingga percakapan praktis). Pembelajaran dipandu oleh Sensei ahli."
    },
    {
      question: "Berapa batas usia minimal dan maksimal untuk mendaftar?",
      answer: "Berdasarkan regulasi imigrasi dan program kerja Jepang: Program Magang (Ginou Jisshusei) ditujukan untuk usia 18 - 26 tahun. Sementara Program Keahlian Khusus (Tokutei Ginou / SSW) menerima peserta usia 18 - 30 tahun."
    },
    {
      question: "Apakah biaya pelatihan bisa dicicil?",
      answer: "Benar. Untuk meringankan beban calon peserta dan orang tua, kami menyediakan skema pembayaran biaya diklat yang dapat diangsur beberapa kali selama masa pendidikan berlangsung di LPK."
    }
  ];

  const handleToggle = (index) => {
    if (activeIndex === index) {
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
    }
  };

  return (
    <section id="faq" className="section container">
      {/* Title */}
      <div className="section-title-wrapper">
        <span className="section-tag">FAQ</span>
        <h2 className="section-title">Pertanyaan yang Sering Diajukan</h2>
        <p className="section-subtitle">
          Berikut adalah rangkuman jawaban untuk pertanyaan yang paling sering ditanyakan oleh calon peserta dan orang tua mereka.
        </p>
      </div>

      {/* Accordion List */}
      <div className="faq-container">
        {faqs.map((faq, index) => {
          const isActive = activeIndex === index;
          return (
            <div 
              key={index} 
              className={`faq-item ${isActive ? 'active' : ''}`}
            >
              <button 
                onClick={() => handleToggle(index)}
                className="faq-trigger"
                aria-expanded={isActive}
              >
                <span className="faq-question">{faq.question}</span>
                <ChevronDown className="faq-icon-chevron" />
              </button>
              
              <div 
                className="faq-content" 
                style={{ maxHeight: isActive ? '300px' : '0' }}
              >
                <div className="faq-answer">
                  {faq.answer}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
