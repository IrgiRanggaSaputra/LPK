import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Key, User, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import logoImg from '../images/kiyoraka.png';
import './AdminLogin.css';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // If already logged in, redirect to dashboard automatically
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Username dan Password wajib diisi.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Save session token in local storage
        localStorage.setItem('adminToken', result.token);

        // Redirect to dashboard
        navigate('/admin');
      } else {
        setError(result.message || 'Login gagal. Silakan coba kembali.');
      }
    } catch (err) {
      console.error('Login request error:', err);
      setError('Tidak dapat menghubungi server backend. Pastikan server aktif.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-layout">
      <div className="login-card animate-slide-up">

        {/* Header Branding */}
        <div className="login-header-group">
          <img src={logoImg} alt="Logo LPK Kiyoraka" style={{ height: '60px', marginBottom: '1rem', objectFit: 'contain' }} />
          <h2>LPK Jepang</h2>
          <p>Portal Sistem Informasi & Pendaftaran</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="form-status error" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <p style={{ fontSize: '0.85rem' }}>{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>

          {/* Username */}
          <div className="form-group">
            <label className="form-label" htmlFor="username">Username</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input
                type="text"
                id="username"
                className="form-control"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <Key size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input
                type="password"
                id="password"
                className="form-control"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1.5rem' }}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Mencocokkan...
              </>
            ) : (
              'Masuk Ke Dashboard'
            )}
          </button>

        </form>

        {/* Back link */}
        <div style={{ textAlign: 'center' }}>
          <a href="/" className="login-back-home">
            <ArrowLeft size={16} />
            Kembali Ke Beranda
          </a>
        </div>

      </div>
    </div>
  );
}
