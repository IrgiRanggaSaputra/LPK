import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImg from '../images/kiyoraka.png';
import {
  Newspaper,
  Users,
  FileText,
  Trash2,
  Edit3,
  Plus,
  ExternalLink,
  Check,
  Loader2,
  LogOut,
  Calendar,
  AlertCircle,
  Download,
  Eye,
  X,
  Printer,
  FileSpreadsheet
} from 'lucide-react';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('news'); // 'news' or 'registrants'

  // State for News CRUD
  const [newsList, setNewsList] = useState([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsFormData, setNewsFormData] = useState({
    title: '',
    content: '',
    category: 'Tips & Trik',
    image_url: ''
  });
  const [editingId, setEditingId] = useState(null); // ID of article being updated
  const [newsFile, setNewsFile] = useState(null);
  const newsFileRef = useRef(null);

  // State for Registrants Listing
  const [registrantsList, setRegistrantsList] = useState([]);
  const [registrantsLoading, setRegistrantsLoading] = useState(false);
  const [selectedRegistrant, setSelectedRegistrant] = useState(null); // For detail modal

  // State for Testimonials CRUD
  const [testimonialsList, setTestimonialsList] = useState([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(false);
  const [testimonialFormData, setTestimonialFormData] = useState({
    name: '',
    city: '',
    program: '',
    quote: '',
    avatar: ''
  });
  const [editingTestimonialId, setEditingTestimonialId] = useState(null);
  const [testimonialFile, setTestimonialFile] = useState(null);
  const testimonialFileRef = useRef(null);

  // Global UI feedback states
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [btnLoading, setBtnLoading] = useState(false);

  // Redirect to login if not authenticated on mount
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
    } else {
      fetchNews();
      fetchRegistrants();
      fetchTestimonials();
    }
  }, [navigate]);

  const triggerNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification({ type: '', message: '' });
    }, 4000);
  };

  /**
   * Helper to retrieve auth headers
   */
  const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  /**
   * Handles 401 Unauthorized API responses
   */
  const handleAuthError = () => {
    localStorage.removeItem('adminToken');
    triggerNotification('error', 'Sesi Anda telah berakhir. Harap login kembali.');
    setTimeout(() => {
      navigate('/admin/login');
    }, 1500);
  };

  /* ==========================================================================
     NEWS CRUD API INTERACTIONS
     ========================================================================== */
  const fetchNews = async () => {
    setNewsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/berita');
      const result = await response.json();
      if (response.ok && result.success) {
        setNewsList(result.data);
      } else {
        triggerNotification('error', 'Gagal memuat daftar berita.');
      }
    } catch (err) {
      console.error(err);
      triggerNotification('error', 'Koneksi ke backend bermasalah.');
    } finally {
      setNewsLoading(false);
    }
  };

  const handleNewsFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert('File terlalu besar! Ukuran maksimal file adalah 3MB.');
        e.target.value = null;
        return;
      }
      setNewsFile(file);
    }
  };

  const handleNewsSubmit = async (e) => {
    e.preventDefault();
    setBtnLoading(true);

    if (!newsFormData.title.trim() || !newsFormData.content.trim()) {
      triggerNotification('error', 'Judul dan konten berita wajib diisi.');
      setBtnLoading(false);
      return;
    }

    try {
      const isEdit = editingId !== null;
      const url = isEdit
        ? `http://localhost:5000/api/berita/${editingId}`
        : 'http://localhost:5000/api/berita';

      const method = isEdit ? 'PUT' : 'POST';

      const data = new FormData();
      data.append('title', newsFormData.title);
      data.append('content', newsFormData.content);
      data.append('category', newsFormData.category);
      data.append('image_url', newsFormData.image_url);
      if (newsFile) {
        data.append('news_image', newsFile);
      }

      const headers = {};
      const token = localStorage.getItem('adminToken');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        method,
        headers,
        body: data
      });

      if (response.status === 401) {
        handleAuthError();
        return;
      }

      const result = await response.json();

      if (response.ok && result.success) {
        triggerNotification('success', isEdit ? 'Berita berhasil diperbarui!' : 'Berita berhasil diterbitkan!');

        // Reset form
        setNewsFormData({ title: '', content: '', category: 'Tips & Trik', image_url: '' });
        setEditingId(null);
        setNewsFile(null);
        if (newsFileRef.current) newsFileRef.current.value = "";

        // Reload list
        fetchNews();
      } else {
        triggerNotification('error', result.message || 'Gagal menyimpan berita.');
      }
    } catch (err) {
      console.error(err);
      triggerNotification('error', 'Gagal menghubungi server.');
    } finally {
      setBtnLoading(false);
    }
  };

  const handleEditClick = (article) => {
    setEditingId(article.id);
    setNewsFormData({
      title: article.title,
      content: article.content,
      category: article.category,
      image_url: article.image_url
    });
    setNewsFile(null);
    if (newsFileRef.current) newsFileRef.current.value = "";
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNewsFormData({ title: '', content: '', category: 'Tips & Trik', image_url: '' });
    setNewsFile(null);
    if (newsFileRef.current) newsFileRef.current.value = "";
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus berita ini?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/berita/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (response.status === 401) {
        handleAuthError();
        return;
      }

      const result = await response.json();

      if (response.ok && result.success) {
        triggerNotification('success', 'Berita berhasil dihapus.');
        fetchNews();
      } else {
        triggerNotification('error', result.message || 'Gagal menghapus berita.');
      }
    } catch (err) {
      console.error(err);
      triggerNotification('error', 'Koneksi ke backend terputus.');
    }
  };

  /* ==========================================================================
     TESTIMONIALS CRUD API INTERACTIONS
     ========================================================================== */
  const fetchTestimonials = async () => {
    setTestimonialsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/testimoni');
      const result = await response.json();
      if (response.ok && result.success) {
        setTestimonialsList(result.data);
      } else {
        triggerNotification('error', 'Gagal memuat daftar testimoni.');
      }
    } catch (err) {
      console.error(err);
      triggerNotification('error', 'Koneksi ke backend bermasalah.');
    } finally {
      setTestimonialsLoading(false);
    }
  };

  const handleTestimonialFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert('File terlalu besar! Ukuran maksimal file adalah 3MB.');
        e.target.value = null;
        return;
      }
      setTestimonialFile(file);
    }
  };

  const handleTestimonialSubmit = async (e) => {
    e.preventDefault();
    setBtnLoading(true);

    if (!testimonialFormData.name.trim() || !testimonialFormData.quote.trim()) {
      triggerNotification('error', 'Nama dan isi testimoni wajib diisi.');
      setBtnLoading(false);
      return;
    }

    try {
      const isEdit = editingTestimonialId !== null;
      const url = isEdit
        ? `http://localhost:5000/api/testimoni/${editingTestimonialId}`
        : 'http://localhost:5000/api/testimoni';

      const method = isEdit ? 'PUT' : 'POST';

      const data = new FormData();
      data.append('name', testimonialFormData.name.trim());
      data.append('city', testimonialFormData.city.trim());
      data.append('program', testimonialFormData.program.trim());
      data.append('quote', testimonialFormData.quote.trim());
      data.append('avatar', testimonialFormData.avatar.trim());
      if (testimonialFile) {
        data.append('avatar_image', testimonialFile);
      }

      const headers = {};
      const token = localStorage.getItem('adminToken');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        method,
        headers,
        body: data
      });

      if (response.status === 401) {
        handleAuthError();
        return;
      }

      const result = await response.json();

      if (response.ok && result.success) {
        triggerNotification('success', isEdit ? 'Testimoni berhasil diperbarui!' : 'Testimoni berhasil ditambahkan!');

        // Reset form
        setTestimonialFormData({ name: '', city: '', program: '', quote: '', avatar: '' });
        setEditingTestimonialId(null);
        setTestimonialFile(null);
        if (testimonialFileRef.current) testimonialFileRef.current.value = "";

        // Reload list
        fetchTestimonials();
      } else {
        triggerNotification('error', result.message || 'Gagal menyimpan testimoni.');
      }
    } catch (err) {
      console.error(err);
      triggerNotification('error', 'Gagal menghubungi server.');
    } finally {
      setBtnLoading(false);
    }
  };

  const handleTestimonialEditClick = (testi) => {
    setEditingTestimonialId(testi.id);
    setTestimonialFormData({
      name: testi.name,
      city: testi.city,
      program: testi.program,
      quote: testi.quote,
      avatar: testi.avatar
    });
    setTestimonialFile(null);
    if (testimonialFileRef.current) testimonialFileRef.current.value = "";
  };

  const handleTestimonialCancelEdit = () => {
    setEditingTestimonialId(null);
    setTestimonialFormData({ name: '', city: '', program: '', quote: '', avatar: '' });
    setTestimonialFile(null);
    if (testimonialFileRef.current) testimonialFileRef.current.value = "";
  };

  const handleTestimonialDeleteClick = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus testimoni ini?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/testimoni/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (response.status === 401) {
        handleAuthError();
        return;
      }

      const result = await response.json();

      if (response.ok && result.success) {
        triggerNotification('success', 'Testimoni berhasil dihapus.');
        fetchTestimonials();
      } else {
        triggerNotification('error', result.message || 'Gagal menghapus testimoni.');
      }
    } catch (err) {
      console.error(err);
      triggerNotification('error', 'Koneksi ke backend terputus.');
    }
  };

  /* ==========================================================================
     REGISTRANTS LISTING & EXPORTS INTERACTION
     ========================================================================== */
  const fetchRegistrants = async () => {
    setRegistrantsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/pendaftar', {
        headers: getAuthHeaders()
      });

      if (response.status === 401) {
        handleAuthError();
        return;
      }

      const result = await response.json();
      if (response.ok && result.success) {
        setRegistrantsList(result.data);
      } else {
        triggerNotification('error', 'Gagal memuat data pendaftar.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRegistrantsLoading(false);
    }
  };

  /**
   * Safe CSV Downloader using token headers
   */
  const handleExportCsv = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/pendaftar/export/csv', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.status === 401) {
        handleAuthError();
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'laporan_pendaftar_lpk.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      triggerNotification('success', 'File CSV berhasil diunduh!');
    } catch (err) {
      console.error(err);
      triggerNotification('error', 'Gagal mengekspor data CSV.');
    }
  };

  /**
   * PDF Printable View Renderer
   */
  const handlePrintPdf = (candidate) => {
    const printWindow = window.open('', '_blank', 'width=850,height=950');
    if (!printWindow) {
      alert('Gagal membuka jendela cetak. Pastikan pop-up diblokir di browser Anda.');
      return;
    }

    const ijazahUrl = candidate.ijazah_photo ? `http://localhost:5000/${candidate.ijazah_photo}` : '';
    const simUrl = candidate.sim_a_photo ? `http://localhost:5000/${candidate.sim_a_photo}` : '';
    const certUrl = candidate.certificate_photo ? `http://localhost:5000/${candidate.certificate_photo}` : '';

    printWindow.document.write(`
      <html>
        <head>
          <title>CV Pendaftar - ${candidate.name}</title>
          <style>
            body { font-family: 'Arial', sans-serif; color: #1e293b; padding: 40px; line-height: 1.6; }
            .header { border-bottom: 3px solid #D80032; padding-bottom: 12px; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: center; }
            .header h1 { color: #0F2C59; margin: 0 0 5px 0; font-size: 26px; font-weight: 800; }
            .header p { margin: 0; font-size: 13px; color: #64748b; }
            .logo { background-color: #D80032; color: white; width: 45px; height: 45px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: bold; }
            .section-title { background-color: #0F2C59; color: white; padding: 8px 12px; font-weight: bold; margin-top: 30px; margin-bottom: 15px; font-size: 15px; border-radius: 4px; letter-spacing: 0.5px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            td { padding: 9px 12px; border-bottom: 1px solid #f1f5f9; vertical-align: top; font-size: 14px; }
            td.label { font-weight: bold; width: 35%; color: #475569; background-color: #f8fafc; }
            td.val { color: #0f172a; }
            .footer { text-align: center; font-size: 11px; color: #94a3b8; margin-top: 50px; border-top: 1px solid #e2e8f0; padding-top: 15px; }
            @media print {
              body { padding: 15px; }
              a { text-decoration: none; color: #000; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1>BIODATA CALON PESERTA LPK JEPANG</h1>
              <p>Formulir Pendaftaran Online | Terdaftar: ${new Date(candidate.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })} WIB</p>
            </div>
            <img src="\${logoImg}" alt="Logo LPK Kiyoraka" style="height: 50px; object-fit: contain;" />
          </div>

          <div class="section-title">I. INFORMASI PRIBADI</div>
          <table>
            <tr><td class="label">Nama Lengkap</td><td class="val"><strong>${candidate.name}</strong></td></tr>
            <tr><td class="label">No. WhatsApp Aktif</td><td class="val">${candidate.whatsapp}</td></tr>
            <tr><td class="label">Jenis Kelamin</td><td class="val">${candidate.gender}</td></tr>
            <tr><td class="label">Tempat, Tanggal Lahir</td><td class="val">${candidate.birth_place_date}</td></tr>
            <tr><td class="label">Usia</td><td class="val">${candidate.age} Tahun</td></tr>
            <tr><td class="label">Status Pernikahan</td><td class="val">${candidate.marital_status}</td></tr>
            <tr><td class="label">Alamat Rumah (KTP)</td><td class="val">${candidate.address}</td></tr>
          </table>

          <div class="section-title">II. KONDISI FISIK & PENDIDIKAN</div>
          <table>
            <tr><td class="label">Tinggi / Berat Badan</td><td class="val">${candidate.height} cm / ${candidate.weight} kg</td></tr>
            <tr><td class="label">Apakah Ada Tato?</td><td class="val">${candidate.has_tattoo}</td></tr>
            <tr><td class="label">Pendidikan Terakhir</td><td class="val">${candidate.last_education}</td></tr>
            <tr><td class="label">Jurusan Sekolah/Kuliah</td><td class="val">${candidate.major}</td></tr>
            <tr><td class="label">Link Berkas Ijazah</td><td class="val">${ijazahUrl ? `<a href="${ijazahUrl}" target="_blank">${ijazahUrl}</a>` : '-'}</td></tr>
          </table>

          <div class="section-title">III. KEMAMPUAN BAHASA & TUJUAN KE JEPANG</div>
          <table>
            <tr><td class="label">Job / Program yang Diinginkan</td><td class="val" style="font-weight:bold; color:#D80032;">${candidate.desired_job}</td></tr>
            <tr><td class="label">Pernah Belajar Bahasa Jepang?</td><td class="val">${candidate.studied_japanese}</td></tr>
            <tr><td class="label">Memiliki Sertifikat Bahasa?</td><td class="val">${candidate.has_certificate}</td></tr>
            <tr><td class="label">Level Bahasa Jepang Saat Ini</td><td class="val">${candidate.japanese_level}</td></tr>
            <tr><td class="label">Memiliki SIM A?</td><td class="val">${candidate.has_sim_a}</td></tr>
            <tr><td class="label">Link Berkas SIM A</td><td class="val">${simUrl ? `<a href="${simUrl}" target="_blank">${simUrl}</a>` : '-'}</td></tr>
            <tr><td class="label">Link Berkas Sertifikat</td><td class="val">${certUrl ? `<a href="${certUrl}" target="_blank">${certUrl}</a>` : '-'}</td></tr>
            <tr><td class="label">Tujuan Bergabung LPK</td><td class="val">${candidate.joining_purpose}</td></tr>
            <tr><td class="label">Alasan Ingin Bekerja ke Jepang</td><td class="val">${candidate.japan_reason}</td></tr>
            <tr><td class="label">Sumber Info LPK</td><td class="val">${candidate.lpk_info_source}</td></tr>
          </table>

          <div class="footer">
            <p>Biodata ini dicetak secara otomatis dari database sistem LPK Jepang.</p>
            <p>© ${new Date().getFullYear()} LPK Jepang. All Rights Reserved.</p>
          </div>
          
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() { window.close(); };
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleWaContact = (phone, name, program) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(`Halo ${name},\n\nKami dari *LPK Jepang Resmi* ingin menindaklanjuti formulir pendaftaran lengkap Anda untuk program *${program}*. Apakah Anda memiliki waktu untuk wawancara seleksi administrasi awal?`);
    window.open(`https://api.whatsapp.com/send?phone=${cleanPhone}&text=${message}`, '_blank');
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  return (
    <div className="admin-layout">

      {/* Header */}
      <header className="admin-header">
        <div className="admin-title-group" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <a href="/">
            <img src={logoImg} alt="Logo LPK Kiyoraka" style={{ height: '36px', objectFit: 'contain' }} />
          </a>
          <span className="admin-title-badge">ADMIN DASHBOARD</span>
        </div>
        <div className="admin-nav-actions" style={{ display: 'flex', gap: '0.75rem' }}>
          <a href="/" className="btn btn-outline" style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#fff', fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
            Lihat Web
          </a>
          <button onClick={handleLogout} className="btn btn-primary" style={{ backgroundColor: 'var(--color-accent-red)', fontSize: '0.85rem', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      <main className="admin-main">
        {/* Banner notification */}
        {notification.message && (
          <div className={`form-status ${notification.type === 'success' ? 'success' : 'error'}`} style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={18} />
            <p>{notification.message}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <Users size={24} />
            </div>
            <div className="admin-stat-info">
              <h3>{registrantsList.length}</h3>
              <p>Total Pendaftar</p>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon red">
              <Newspaper size={24} />
            </div>
            <div className="admin-stat-info">
              <h3>{newsList.length}</h3>
              <p>Total Berita</p>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon gold">
              <FileText size={24} />
            </div>
            <div className="admin-stat-info">
              <h3>{testimonialsList.length}</h3>
              <p>Total Testimoni</p>
            </div>
          </div>
        </div>

        {/* Tabs switcher */}
        <div className="admin-tabs">
          <button
            onClick={() => setActiveTab('news')}
            className={`admin-tab-btn ${activeTab === 'news' ? 'active' : ''}`}
          >
            <Newspaper size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Kelola Berita
          </button>

          <button
            onClick={() => setActiveTab('registrants')}
            className={`admin-tab-btn ${activeTab === 'registrants' ? 'active' : ''}`}
          >
            <Users size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Daftar Pendaftar
          </button>

          <button
            onClick={() => setActiveTab('testimonials')}
            className={`admin-tab-btn ${activeTab === 'testimonials' ? 'active' : ''}`}
          >
            <FileText size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Kelola Testimoni
          </button>
        </div>

        {/* Tab 1: News CRUD Management */}
        {activeTab === 'news' && (
          <div className="admin-workspace-grid">

            {/* Left Side: Form to Create/Edit */}
            <div className="admin-card">
              <h2>{editingId ? 'Edit Artikel Berita' : 'Tulis Berita Baru'}</h2>
              <p className="admin-card-subtitle">
                {editingId ? 'Modifikasi konten berita di bawah ini kemudian klik Simpan.' : 'Artikel ini akan langsung ditayangkan di halaman utama website.'}
              </p>

              <form onSubmit={handleNewsSubmit}>
                {/* Title */}
                <div className="form-group">
                  <label className="form-label" htmlFor="title">Judul Berita</label>
                  <input
                    type="text"
                    id="title"
                    className="form-control"
                    placeholder="Contoh: Info Pembukaan Kelas Bahasa Jepang N4 Terdekat"
                    value={newsFormData.title}
                    onChange={(e) => setNewsFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>
                {/* Grid image and category */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                  
                  {/* Category Selection */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="category">Kategori</label>
                    <select
                      id="category"
                      className="form-control"
                      value={newsFormData.category}
                      onChange={(e) => setNewsFormData(prev => ({ ...prev, category: e.target.value }))}
                      required
                    >
                      <option value="Tips & Trik">Tips & Trik</option>
                      <option value="Pemberitahuan">Pemberitahuan</option>
                      <option value="Pelepasan">Pelepasan</option>
                      <option value="Kegiatan LPK">Kegiatan LPK</option>
                    </select>
                  </div>

                  {/* Cover Image Upload / URL Selector */}
                  <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label className="form-label">Gambar Cover Berita</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1rem', border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-bg-light)' }}>
                      <div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 'bold', display: 'block', marginBottom: '0.4rem', color: 'var(--color-primary)' }}>Pilihan 1: Upload File Gambar</span>
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png"
                          onChange={handleNewsFileChange}
                          ref={newsFileRef}
                          className="form-control"
                          style={{ padding: '0.4rem', fontSize: '0.85rem' }}
                        />
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                        <span>— ATAU —</span>
                      </div>

                      <div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 'bold', display: 'block', marginBottom: '0.4rem', color: 'var(--color-primary)' }}>Pilihan 2: Gunakan URL Gambar</span>
                        <input
                          type="url"
                          id="image_url"
                          className="form-control"
                          placeholder="https://images.unsplash.com/..."
                          value={newsFormData.image_url}
                          onChange={(e) => setNewsFormData(prev => ({ ...prev, image_url: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>

                </div>

                {/* Content */}
                <div className="form-group">
                  <label className="form-label" htmlFor="content">Konten Berita / Informasi Lengkap</label>
                  <textarea
                    id="content"
                    className="form-control"
                    rows="6"
                    placeholder="Tulis artikel berita secara detail..."
                    value={newsFormData.content}
                    onChange={(e) => setNewsFormData(prev => ({ ...prev, content: e.target.value }))}
                    required
                    style={{ resize: 'vertical' }}
                  ></textarea>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                  <button type="submit" className="btn btn-primary" disabled={btnLoading} style={{ flexGrow: 1 }}>
                    {btnLoading ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        {editingId ? <Check size={18} /> : <Plus size={18} />}
                        {editingId ? 'Perbarui Berita' : 'Terbitkan Berita'}
                      </>
                    )}
                  </button>

                  {editingId && (
                    <button type="button" onClick={handleCancelEdit} className="btn btn-outline" style={{ borderColor: 'var(--color-accent-red)', color: 'var(--color-accent-red)' }}>
                      Batal
                    </button>
                  )}
                </div>

              </form>
            </div>

            {/* Right Side: List of Current News */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ color: 'var(--color-primary)', fontWeight: 800 }}>Daftar Berita Aktif</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>{newsList.length} Artikel</span>
              </div>

              {newsLoading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <Loader2 className="animate-spin" size={32} style={{ margin: '0 auto', color: 'var(--color-primary)' }} />
                  <p style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>Memuat data...</p>
                </div>
              ) : newsList.length === 0 ? (
                <div className="empty-state">
                  <Newspaper className="empty-state-icon" size={40} />
                  <p>Belum ada berita yang diterbitkan.</p>
                </div>
              ) : (
                <div className="admin-news-list">
                  {newsList.map((article) => (
                    <div key={article.id} className="admin-news-item">
                      <img src={article.image_url} alt={article.title} className="admin-news-img" />
                      <div className="admin-news-details">
                        <span className="admin-news-cat">{article.category}</span>
                        <h4 className="admin-news-title">{article.title}</h4>
                        <div className="admin-news-actions">
                          <button onClick={() => handleEditClick(article)} className="btn btn-secondary btn-mini">
                            <Edit3 size={12} />
                            Edit
                          </button>
                          <button onClick={() => handleDeleteClick(article.id)} className="btn btn-outline btn-mini" style={{ borderColor: 'var(--color-accent-red)', color: 'var(--color-accent-red)' }}>
                            <Trash2 size={12} />
                            Hapus
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* Tab 2: Registrant Database View */}
        {activeTab === 'registrants' && (
          <div className="admin-card" style={{ padding: '2rem 1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2>Database Pendaftaran Peserta LPK</h2>
                <p className="admin-card-subtitle" style={{ marginBottom: 0 }}>
                  Daftar calon peserta yang mendaftar melalui formulir lengkap website LPK Jepang.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={handleExportCsv}
                  className="btn btn-outline"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', padding: '0.5rem 1rem', borderColor: 'var(--color-success)', color: 'var(--color-success)' }}
                >
                  <FileSpreadsheet size={16} />
                  Ekspor CSV Excel
                </button>

                <button onClick={fetchRegistrants} className="btn btn-outline btn-sm" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                  Refresh Data
                </button>
              </div>
            </div>

            {registrantsLoading ? (
              <div style={{ textAlign: 'center', padding: '4rem' }}>
                <Loader2 className="animate-spin" size={36} style={{ margin: '0 auto', color: 'var(--color-primary)' }} />
                <p style={{ marginTop: '0.5rem' }}>Memuat data pendaftar...</p>
              </div>
            ) : registrantsList.length === 0 ? (
              <div className="empty-state">
                <Users className="empty-state-icon" size={40} />
                <p>Belum ada pendaftaran yang masuk.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Nama Lengkap</th>
                      <th>Usia</th>
                      <th>Jenis Kelamin</th>
                      <th>No. WhatsApp</th>
                      <th>Pendidikan (Jurusan)</th>
                      <th>Job Diinginkan</th>
                      <th>Tanggal Daftar</th>
                      <th style={{ textAlign: 'center' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrantsList.map((item, idx) => (
                      <tr key={item.id}>
                        <td style={{ fontWeight: 'bold' }}>{idx + 1}</td>
                        <td style={{ fontWeight: '700', color: 'var(--color-primary)' }}>{item.name}</td>
                        <td>{item.age} Tahun</td>
                        <td>{item.gender}</td>
                        <td style={{ fontWeight: '600' }}>{item.whatsapp}</td>
                        <td>{item.last_education} ({item.major})</td>
                        <td>
                          <span className={`badge-program ${item.desired_job.includes('SSW') || item.desired_job.includes('Ginou') ? (item.desired_job.includes('SSW') ? 'ssw' : '') : ''}`}>
                            {item.desired_job}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Calendar size={12} />
                            {new Date(item.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center' }}>
                            <button
                              onClick={() => setSelectedRegistrant(item)}
                              className="btn btn-secondary btn-mini"
                              style={{ display: 'inline-flex', gap: '0.25rem', alignItems: 'center', backgroundColor: 'var(--color-primary)', borderColor: 'var(--color-primary)', color: '#fff' }}
                            >
                              <Eye size={12} />
                              Detail
                            </button>
                            <button
                              onClick={() => handleWaContact(item.whatsapp, item.name, item.desired_job)}
                              className="btn btn-secondary btn-mini"
                              style={{ backgroundColor: 'var(--color-success)', borderColor: 'var(--color-success)', color: '#fff', display: 'inline-flex', gap: '0.25rem', alignItems: 'center' }}
                            >
                              <ExternalLink size={12} />
                              WA
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        )}

        {/* Tab 3: Testimonial CRUD Management */}
        {activeTab === 'testimonials' && (
          <div className="admin-workspace-grid">

            {/* Left Side: Form to Create/Edit */}
            <div className="admin-card">
              <h2>{editingTestimonialId ? 'Edit Testimoni' : 'Tulis Testimoni Baru'}</h2>
              <p className="admin-card-subtitle">
                {editingTestimonialId ? 'Modifikasi testimoni terpilih kemudian klik Simpan.' : 'Testimoni ini akan langsung ditayangkan di halaman utama website.'}
              </p>

              <form onSubmit={handleTestimonialSubmit}>
                {/* Author Name */}
                <div className="form-group">
                  <label className="form-label" htmlFor="testi_name">Nama Lengkap Alumni</label>
                  <input
                    type="text"
                    id="testi_name"
                    className="form-control"
                    placeholder="Contoh: Ahmad Fauzi"
                    value={testimonialFormData.name}
                    onChange={(e) => setTestimonialFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>

                {/* Grid program & city */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {/* City */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="testi_city">Kota Penempatan (Jepang)</label>
                    <input
                      type="text"
                      id="testi_city"
                      className="form-control"
                      placeholder="Contoh: Tokyo, Jepang"
                      value={testimonialFormData.city}
                      onChange={(e) => setTestimonialFormData(prev => ({ ...prev, city: e.target.value }))}
                      required
                    />
                  </div>

                  {/* Program */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="testi_program">Program & Angkatan</label>
                    <input
                      type="text"
                      id="testi_program"
                      className="form-control"
                      placeholder="Contoh: Alumni Magang Otomotif (2024)"
                      value={testimonialFormData.program}
                      onChange={(e) => setTestimonialFormData(prev => ({ ...prev, program: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                {/* Avatar Image Selection */}
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label className="form-label">Foto Profil / Avatar Alumni</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1rem', border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-bg-light)' }}>
                    <div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 'bold', display: 'block', marginBottom: '0.4rem', color: 'var(--color-primary)' }}>Pilihan 1: Upload Foto Avatar</span>
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        onChange={handleTestimonialFileChange}
                        ref={testimonialFileRef}
                        className="form-control"
                        style={{ padding: '0.4rem', fontSize: '0.85rem' }}
                      />
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                      <span>— ATAU —</span>
                    </div>

                    <div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 'bold', display: 'block', marginBottom: '0.4rem', color: 'var(--color-primary)' }}>Pilihan 2: Gunakan URL Gambar</span>
                      <input
                        type="url"
                        className="form-control"
                        placeholder="https://images.unsplash.com/..."
                        value={testimonialFormData.avatar}
                        onChange={(e) => setTestimonialFormData(prev => ({ ...prev, avatar: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                {/* Quote Content */}
                <div className="form-group">
                  <label className="form-label" htmlFor="testi_quote">Pernyataan Testimoni / Pengalaman Alumni</label>
                  <textarea
                    id="testi_quote"
                    className="form-control"
                    rows="4"
                    placeholder="Tulis kutipan sukses alumni..."
                    value={testimonialFormData.quote}
                    onChange={(e) => setTestimonialFormData(prev => ({ ...prev, quote: e.target.value }))}
                    required
                    style={{ resize: 'vertical' }}
                  ></textarea>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                  <button type="submit" className="btn btn-primary" disabled={btnLoading} style={{ flexGrow: 1 }}>
                    {btnLoading ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        {editingTestimonialId ? <Check size={18} /> : <Plus size={18} />}
                        {editingTestimonialId ? 'Perbarui Testimoni' : 'Terbitkan Testimoni'}
                      </>
                    )}
                  </button>

                  {editingTestimonialId && (
                    <button type="button" onClick={handleTestimonialCancelEdit} className="btn btn-outline" style={{ borderColor: 'var(--color-accent-red)', color: 'var(--color-accent-red)' }}>
                      Batal
                    </button>
                  )}
                </div>

              </form>
            </div>

            {/* Right Side: List of Current Testimonials */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ color: 'var(--color-primary)', fontWeight: 800 }}>Daftar Testimoni Aktif</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>{testimonialsList.length} Item</span>
              </div>

              {testimonialsLoading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <Loader2 className="animate-spin" size={32} style={{ margin: '0 auto', color: 'var(--color-primary)' }} />
                  <p style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>Memuat data...</p>
                </div>
              ) : testimonialsList.length === 0 ? (
                <div className="empty-state">
                  <FileText className="empty-state-icon" size={40} />
                  <p>Belum ada testimoni yang ditambahkan.</p>
                </div>
              ) : (
                <div className="admin-news-list">
                  {testimonialsList.map((testi) => (
                    <div key={testi.id} className="admin-news-item">
                      <img src={testi.avatar} alt={testi.name} className="admin-news-img" style={{ borderRadius: '50%', width: '70px', height: '70px' }} />
                      <div className="admin-news-details">
                        <span className="admin-news-cat">{testi.city}</span>
                        <h4 className="admin-news-title" style={{ margin: 0 }}>{testi.name}</h4>
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>{testi.program}</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-dark)', fontStyle: 'italic', marginBottom: '0.75rem', lineHeight: '1.4' }}>
                          "{testi.quote.length > 80 ? testi.quote.substring(0, 80) + '...' : testi.quote}"
                        </p>
                        <div className="admin-news-actions">
                          <button onClick={() => handleTestimonialEditClick(testi)} className="btn btn-secondary btn-mini">
                            <Edit3 size={12} />
                            Edit
                          </button>
                          <button onClick={() => handleTestimonialDeleteClick(testi.id)} className="btn btn-outline btn-mini" style={{ borderColor: 'var(--color-accent-red)', color: 'var(--color-accent-red)' }}>
                            <Trash2 size={12} />
                            Hapus
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

      </main>

      {/* ==========================================
         REGISTRANT DETAIL MODAL OVERLAY
         ========================================== */}
      {selectedRegistrant && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
          <div className="animate-slide-up" style={{ backgroundColor: '#fff', width: '100%', maxWidth: '780px', maxHeight: '90vh', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)' }}>

            {/* Modal Header */}
            <div style={{ padding: '1.5rem 2rem', backgroundColor: 'var(--color-primary)', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>Profil & Berkas Pendaftar</h3>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)' }}>
                  ID Pendaftaran: #{selectedRegistrant.id} | Dibuat: {new Date(selectedRegistrant.created_at).toLocaleString('id-ID')} WIB
                </p>
              </div>
              <button
                onClick={() => setSelectedRegistrant(null)}
                style={{ backgroundColor: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div style={{ padding: '2rem', overflowY: 'auto', flexGrow: 1 }}>

              {/* Toolbar */}
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
                <button
                  onClick={() => handlePrintPdf(selectedRegistrant)}
                  className="btn btn-secondary"
                  style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.9rem' }}
                >
                  <Printer size={16} />
                  Cetak PDF / Print CV
                </button>
                <button
                  onClick={() => handleWaContact(selectedRegistrant.whatsapp, selectedRegistrant.name, selectedRegistrant.desired_job)}
                  className="btn btn-primary"
                  style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.9rem', backgroundColor: 'var(--color-success)', borderColor: 'var(--color-success)' }}
                >
                  <ExternalLink size={16} />
                  Hubungi WhatsApp
                </button>
              </div>

              {/* Data Sections */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>

                {/* Column 1 */}
                <div>
                  <h4 style={{ color: 'var(--color-accent-red)', fontWeight: 800, borderBottom: '2px solid #f1f5f9', paddingBottom: '0.25rem', marginBottom: '0.75rem' }}>I. DATA PRIBADI</h4>
                  <table style={{ width: '100%', fontSize: '0.875rem', borderCollapse: 'collapse' }}>
                    <tbody>
                      <tr><td style={{ fontWeight: 'bold', padding: '6px 0', width: '40%', color: '#64748b' }}>Nama Lengkap</td><td style={{ padding: '6px 0', fontWeight: 'bold' }}>{selectedRegistrant.name}</td></tr>
                      <tr><td style={{ fontWeight: 'bold', padding: '6px 0', color: '#64748b' }}>WhatsApp</td><td style={{ padding: '6px 0' }}>{selectedRegistrant.whatsapp}</td></tr>
                      <tr><td style={{ fontWeight: 'bold', padding: '6px 0', color: '#64748b' }}>Jenis Kelamin</td><td style={{ padding: '6px 0' }}>{selectedRegistrant.gender}</td></tr>
                      <tr><td style={{ fontWeight: 'bold', padding: '6px 0', color: '#64748b' }}>TTL</td><td style={{ padding: '6px 0' }}>{selectedRegistrant.birth_place_date}</td></tr>
                      <tr><td style={{ fontWeight: 'bold', padding: '6px 0', color: '#64748b' }}>Usia</td><td style={{ padding: '6px 0' }}>{selectedRegistrant.age} Tahun</td></tr>
                      <tr><td style={{ fontWeight: 'bold', padding: '6px 0', color: '#64748b' }}>Status Marital</td><td style={{ padding: '6px 0' }}>{selectedRegistrant.marital_status}</td></tr>
                      <tr><td style={{ fontWeight: 'bold', padding: '6px 0', color: '#64748b' }}>Alamat</td><td style={{ padding: '6px 0', fontSize: '0.8rem', lineHeight: '1.4' }}>{selectedRegistrant.address}</td></tr>
                    </tbody>
                  </table>

                  <h4 style={{ color: 'var(--color-accent-red)', fontWeight: 800, borderBottom: '2px solid #f1f5f9', paddingBottom: '0.25rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>II. KONDISI FISIK</h4>
                  <table style={{ width: '100%', fontSize: '0.875rem' }}>
                    <tbody>
                      <tr><td style={{ fontWeight: 'bold', padding: '6px 0', width: '40%', color: '#64748b' }}>Tinggi Badan</td><td style={{ padding: '6px 0' }}>{selectedRegistrant.height} cm</td></tr>
                      <tr><td style={{ fontWeight: 'bold', padding: '6px 0', color: '#64748b' }}>Berat Badan</td><td style={{ padding: '6px 0' }}>{selectedRegistrant.weight} kg</td></tr>
                      <tr><td style={{ fontWeight: 'bold', padding: '6px 0', color: '#64748b' }}>Memiliki Tato?</td><td style={{ padding: '6px 0' }}>{selectedRegistrant.has_tattoo}</td></tr>
                    </tbody>
                  </table>
                </div>

                {/* Column 2 */}
                <div>
                  <h4 style={{ color: 'var(--color-accent-red)', fontWeight: 800, borderBottom: '2px solid #f1f5f9', paddingBottom: '0.25rem', marginBottom: '0.75rem' }}>III. PENDIDIKAN & DOKUMEN</h4>
                  <table style={{ width: '100%', fontSize: '0.875rem' }}>
                    <tbody>
                      <tr><td style={{ fontWeight: 'bold', padding: '6px 0', width: '45%', color: '#64748b' }}>Pendidikan Terakhir</td><td style={{ padding: '6px 0' }}>{selectedRegistrant.last_education}</td></tr>
                      <tr><td style={{ fontWeight: 'bold', padding: '6px 0', color: '#64748b' }}>Jurusan Sekolah</td><td style={{ padding: '6px 0' }}>{selectedRegistrant.major}</td></tr>
                      <tr>
                        <td style={{ fontWeight: 'bold', padding: '6px 0', color: '#64748b' }}>Dokumen Ijazah</td>
                        <td style={{ padding: '6px 0' }}>
                          <a href={`http://localhost:5000/${selectedRegistrant.ijazah_photo}`} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-primary)', fontWeight: 'bold', textDecoration: 'none' }}>
                            <Download size={14} />
                            Unduh / Lihat File
                          </a>
                        </td>
                      </tr>
                      <tr><td style={{ fontWeight: 'bold', padding: '6px 0', color: '#64748b' }}>Memiliki SIM A?</td><td style={{ padding: '6px 0' }}>{selectedRegistrant.has_sim_a}</td></tr>
                      {selectedRegistrant.has_sim_a === 'Ya' && (
                        <tr>
                          <td style={{ fontWeight: 'bold', padding: '6px 0', color: '#64748b' }}>Dokumen SIM A</td>
                          <td style={{ padding: '6px 0' }}>
                            <a href={`http://localhost:5000/${selectedRegistrant.sim_a_photo}`} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-primary)', fontWeight: 'bold', textDecoration: 'none' }}>
                              <Download size={14} />
                              Unduh / Lihat File
                            </a>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  <h4 style={{ color: 'var(--color-accent-red)', fontWeight: 800, borderBottom: '2px solid #f1f5f9', paddingBottom: '0.25rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>IV. KOMPETENSI BAHASA & MINAT</h4>
                  <table style={{ width: '100%', fontSize: '0.875rem' }}>
                    <tbody>
                      <tr><td style={{ fontWeight: 'bold', padding: '6px 0', width: '45%', color: '#64748b' }}>Pernah Belajar JP?</td><td style={{ padding: '6px 0' }}>{selectedRegistrant.studied_japanese}</td></tr>
                      <tr><td style={{ fontWeight: 'bold', padding: '6px 0', color: '#64748b' }}>Memiliki Sertifikat?</td><td style={{ padding: '6px 0' }}>{selectedRegistrant.has_certificate}</td></tr>
                      {selectedRegistrant.has_certificate === 'Ya' && (
                        <tr>
                          <td style={{ fontWeight: 'bold', padding: '6px 0', color: '#64748b' }}>Dokumen Sertifikat</td>
                          <td style={{ padding: '6px 0' }}>
                            <a href={`http://localhost:5000/${selectedRegistrant.certificate_photo}`} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-primary)', fontWeight: 'bold', textDecoration: 'none' }}>
                              <Download size={14} />
                              Unduh / Lihat File
                            </a>
                          </td>
                        </tr>
                      )}
                      <tr><td style={{ fontWeight: 'bold', padding: '6px 0', color: '#64748b' }}>Level Bahasa JP</td><td style={{ padding: '6px 0' }}>{selectedRegistrant.japanese_level}</td></tr>
                      <tr><td style={{ fontWeight: 'bold', padding: '6px 0', color: '#64748b' }}>Job Diinginkan</td><td style={{ padding: '6px 0', fontWeight: 'bold', color: 'var(--color-accent-red)' }}>{selectedRegistrant.desired_job}</td></tr>
                      <tr><td style={{ fontWeight: 'bold', padding: '6px 0', color: '#64748b' }}>Sumber Info LPK</td><td style={{ padding: '6px 0' }}>{selectedRegistrant.lpk_info_source}</td></tr>
                    </tbody>
                  </table>
                </div>

              </div>

              {/* Text Blocks */}
              <div style={{ marginTop: '1.5rem' }}>
                <h4 style={{ color: 'var(--color-accent-red)', fontWeight: 800, borderBottom: '2px solid #f1f5f9', paddingBottom: '0.25rem', marginBottom: '0.5rem' }}>V. TUJUAN & ALASAN</h4>
                <div style={{ marginBottom: '1rem' }}>
                  <h5 style={{ margin: '0 0 0.25rem 0', color: '#475569', fontSize: '0.85rem' }}>Tujuan Bergabung LPK:</h5>
                  <p style={{ margin: 0, fontSize: '0.875rem', backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid #f1f5f9', lineHeight: '1.5' }}>
                    {selectedRegistrant.joining_purpose}
                  </p>
                </div>
                <div>
                  <h5 style={{ margin: '0 0 0.25rem 0', color: '#475569', fontSize: '0.85rem' }}>Alasan Ingin Bekerja/Magang ke Jepang:</h5>
                  <p style={{ margin: 0, fontSize: '0.875rem', backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid #f1f5f9', lineHeight: '1.5' }}>
                    {selectedRegistrant.japan_reason}
                  </p>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div style={{ padding: '1rem 2rem', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setSelectedRegistrant(null)} className="btn btn-outline" style={{ padding: '0.5rem 1.5rem', fontSize: '0.9rem' }}>
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{ marginTop: 'auto', backgroundColor: '#e2e8f0', padding: '1.25rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border)' }}>
        © {new Date().getFullYear()} LPK KIYORAKA GLOBAL Admin Panel.
      </footer>
    </div>
  );
}
