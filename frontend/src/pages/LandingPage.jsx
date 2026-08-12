import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import Hero from '../components/Hero/Hero';
import AboutLegality from '../components/AboutLegality/AboutLegality';
import Programs from '../components/Programs/Programs';
import Statistics from '../components/Statistics/Statistics';
import FlowSteps from '../components/FlowSteps/FlowSteps';
import TestimonialsGallery from '../components/TestimonialsGallery/TestimonialsGallery';
import FAQAccordion from '../components/FAQAccordion/FAQAccordion';
import Footer from '../components/Footer/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp/FloatingWhatsApp';
import NewsSection from '../components/NewsSection/NewsSection';
import Facilities from '../components/Facilities/Facilities';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Navbar Header */}
      <Header />
      
      {/* Page Sections */}
      <main>
        <Hero />
        <AboutLegality />
        
        {/* Programs section redirecting selection state to registration page */}
        <Programs onSelectProgram={(programName) => navigate('/daftar', { state: { program: programName } })} />
        
        <Statistics />
        <Facilities />
        <FlowSteps />
        <TestimonialsGallery />
        <FAQAccordion />
        <NewsSection />
      </main>

      {/* Footer & Help Chat */}
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
