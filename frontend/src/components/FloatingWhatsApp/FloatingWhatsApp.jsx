import React from 'react';
import { MessageSquare } from 'lucide-react';
import './FloatingWhatsApp.css';

export default function FloatingWhatsApp() {
  const handleClick = () => {
    const adminPhone = "6281234567890";
    const text = encodeURIComponent("Halo Admin LPK Jepang, saya membaca website Anda dan ingin bertanya mengenai pendaftaran magang/kerja ke Jepang.");
    window.open(`https://api.whatsapp.com/send?phone=${adminPhone}&text=${text}`, '_blank');
  };

  return (
    <div className="floating-wa">
      <div className="floating-wa-badge">Tanya Kami (Online)</div>
      <button 
        onClick={handleClick}
        className="floating-wa-btn"
        aria-label="Chat WhatsApp"
      >
        <MessageSquare size={30} />
      </button>
    </div>
  );
}
