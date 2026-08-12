import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import RegistrationForm from '../components/RegistrationForm/RegistrationForm';

export default function PendaftaranPage() {
  const location = useLocation();

  // Scroll to top when this page is entered
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Page Header Navigation */}
      <Header />

      {/* Main Form container */}
      <main style={{ 
        paddingTop: '90px', 
        backgroundColor: '#0a192f', // Deep dark blue background
        flexGrow: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: '3rem'
      }}>
        <RegistrationForm selectedProgram={location.state?.program || ''} />
      </main>

      {/* Page Footer */}
      <Footer />
    </div>
  );
}
