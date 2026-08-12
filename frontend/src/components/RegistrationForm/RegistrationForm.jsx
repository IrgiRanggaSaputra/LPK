import React, { useState, useEffect } from 'react';
import { Send, CheckCircle2, RefreshCw, ArrowRight, ArrowLeft, Upload, Paperclip } from 'lucide-react';
import './RegistrationForm.css';

export default function RegistrationForm({ selectedProgram, onProgramChange }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    gender: '',
    birth_place_date: '',
    age: '',
    marital_status: '',
    address: '',
    height: '',
    weight: '',
    has_tattoo: '',
    last_education: '',
    major: '',
    joining_purpose: '',
    has_sim_a: '',
    studied_japanese: '',
    has_certificate: '',
    japanese_level: '',
    desired_job: '',
    japan_reason: '',
    lpk_info_source: ''
  });

  // Independent file states
  const [ijazahFile, setIjazahFile] = useState(null);
  const [simFile, setSimFile] = useState(null);
  const [certFile, setCertFile] = useState(null);

  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: null,
    waUrl: null
  });

  // Sync selectedProgram dropdown option from Programs component selection
  useEffect(() => {
    if (selectedProgram) {
      setFormData(prev => ({ ...prev, desired_job: selectedProgram }));
    }
  }, [selectedProgram]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Bubble manual dropdown selection changes back to LandingPage state
    if (name === 'desired_job' && onProgramChange) {
      onProgramChange(value);
    }
  };

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert('File terlalu besar! Ukuran maksimal file adalah 3MB.');
        e.target.value = null;
        return;
      }
      if (fileType === 'ijazah') setIjazahFile(file);
      if (fileType === 'sim') setSimFile(file);
      if (fileType === 'cert') setCertFile(file);
    }
  };

  const handleNext = () => {
    // Basic validation per step before proceeding
    if (step === 1) {
      const { name, whatsapp, gender, birth_place_date, age, marital_status, address } = formData;
      if (!name || !whatsapp || !gender || !birth_place_date || !age || !marital_status || !address) {
        setStatus(prev => ({ ...prev, error: 'Harap lengkapi semua bidang pada Langkah 1.' }));
        return;
      }
      if (parseInt(age) < 18 || parseInt(age) > 30) {
        setStatus(prev => ({ ...prev, error: 'Target usia pendaftaran adalah 18 - 30 tahun.' }));
        return;
      }
    } else if (step === 2) {
      const { height, weight, has_tattoo, last_education, major } = formData;
      if (!height || !weight || !has_tattoo || !last_education || !major) {
        setStatus(prev => ({ ...prev, error: 'Harap lengkapi semua bidang pada Langkah 2.' }));
        return;
      }
      if (!ijazahFile) {
        setStatus(prev => ({ ...prev, error: 'Unggahan foto Ijazah wajib dilampirkan.' }));
        return;
      }
    }
    
    // Clear step errors and step forward
    setStatus(prev => ({ ...prev, error: null }));
    setStep(prev => prev + 1);
  };

  const handlePrev = () => {
    setStatus(prev => ({ ...prev, error: null }));
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: null, waUrl: null });

    // Step 3 final validations
    const {
      joining_purpose, has_sim_a, studied_japanese, has_certificate,
      japanese_level, desired_job, japan_reason, lpk_info_source
    } = formData;

    if (!joining_purpose || !has_sim_a || !studied_japanese || !has_certificate || !japanese_level || !desired_job || !japan_reason || !lpk_info_source) {
      setStatus({ loading: false, success: false, error: 'Harap lengkapi semua bidang pada Langkah 3.', waUrl: null });
      return;
    }
    if (has_sim_a === 'Ya' && !simFile) {
      setStatus({ loading: false, success: false, error: 'Anda menyatakan memiliki SIM A, harap unggah file foto SIM A Anda.', waUrl: null });
      return;
    }
    if (has_certificate === 'Ya' && !certFile) {
      setStatus({ loading: false, success: false, error: 'Anda menyatakan memiliki sertifikat bahasa, harap unggah foto sertifikat Anda.', waUrl: null });
      return;
    }

    // Build multi-part form payload
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });
    if (ijazahFile) data.append('ijazah_photo', ijazahFile);
    if (simFile) data.append('sim_a_photo', simFile);
    if (certFile) data.append('certificate_photo', certFile);

    try {
      const response = await fetch('http://localhost:5000/api/daftar', {
        method: 'POST',
        body: data
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setStatus({
          loading: false,
          success: true,
          error: null,
          waUrl: result.waUrl
        });

        // Reset form states
        setFormData({
          name: '', whatsapp: '', gender: '', birth_place_date: '', age: '', marital_status: '',
          address: '', height: '', weight: '', has_tattoo: '', last_education: '', major: '',
          joining_purpose: '', has_sim_a: '', studied_japanese: '', has_certificate: '',
          japanese_level: '', desired_job: '', japan_reason: '', lpk_info_source: ''
        });
        setIjazahFile(null);
        setSimFile(null);
        setCertFile(null);
        setStep(1);

      } else {
        setStatus({
          loading: false,
          success: false,
          error: result.message || 'Gagal menyimpan pendaftaran.',
          waUrl: null
        });
      }
    } catch (err) {
      console.error(err);
      setStatus({
        loading: false,
        success: false,
        error: 'Gagal menghubungi server. Harap pastikan server backend berjalan.',
        waUrl: null
      });
    }
  };

  return (
    <section id="daftar" className="section register-section">
      <div className="container">
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          
          {/* Header */}
          <div className="section-title-wrapper" style={{ marginBottom: '2.5rem' }}>
            <span className="section-tag" style={{ color: 'var(--color-accent-gold)' }}>FORMULIR PENDAFTARAN LENGKAP</span>
            <h2 className="section-title" style={{ color: 'var(--color-bg-white)' }}>Pendaftaran Calon Peserta</h2>
            <p className="section-subtitle" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              Silakan lengkapi seluruh isian formulir di bawah ini dengan data asli sesuai berkas resmi Anda.
            </p>
          </div>

          {/* Form Card */}
          <div className="register-form-card animate-fade-in" style={{ padding: '2.5rem 3rem', width: '100%' }}>
            
            {/* Step Wizard Bar */}
            {!status.success && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '2px solid var(--color-border)', paddingBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                  <span style={{ fontWeight: '800', color: step === 1 ? 'var(--color-accent-red)' : 'var(--color-text-muted)' }}>1. Data Diri</span>
                  <span style={{ fontWeight: '800', color: step === 2 ? 'var(--color-accent-red)' : 'var(--color-text-muted)' }}>2. Fisik & Dokumen</span>
                  <span style={{ fontWeight: '800', color: step === 3 ? 'var(--color-accent-red)' : 'var(--color-text-muted)' }}>3. Kompetensi & Minat</span>
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Langkah {step} dari 3</span>
              </div>
            )}

            {/* Notification messages */}
            {status.success && (
              <div className="form-status success" style={{ textAlign: 'center', padding: '2.5rem 1.5rem', margin: 0 }}>
                <p style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>🎉 Pendaftaran Berhasil Disimpan!</p>
                <p style={{ fontSize: '0.9rem', fontWeight: 400, color: 'var(--color-text-muted)', lineHeight: '1.5', margin: 0 }}>
                  Terima kasih, data pendaftaran Anda telah berhasil terkirim dan disimpan secara aman di database LPK Jepang.
                </p>
              </div>
            )}

            {status.error && (
              <div className="form-status error" style={{ marginBottom: '1.5rem' }}>
                <p>⚠️ Ada Kesalahan Pengisian</p>
                <p style={{ fontSize: '0.85rem', fontWeight: 400, marginTop: '0.25rem' }}>{status.error}</p>
              </div>
            )}

            {/* Forms body */}
            {!status.success && (
              <form onSubmit={handleSubmit}>
                
                {/* ==========================================
                   STEP 1: DATA DIRI
                   ========================================== */}
                {step === 1 && (
                  <div>
                    {/* Name */}
                    <div className="form-group">
                      <label className="form-label" htmlFor="name">Nama Lengkap (Sesuai KTP)</label>
                      <input 
                        type="text" id="name" name="name" 
                        placeholder="Contoh: Budi Santoso"
                        value={formData.name} onChange={handleChange}
                        className="form-control" required
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                      {/* WhatsApp */}
                      <div className="form-group">
                        <label className="form-label" htmlFor="whatsapp">No. WhatsApp Aktif</label>
                        <input 
                          type="tel" id="whatsapp" name="whatsapp" 
                          placeholder="Contoh: 081234567890"
                          value={formData.whatsapp} onChange={handleChange}
                          className="form-control" required
                        />
                      </div>

                      {/* Gender */}
                      <div className="form-group">
                        <label className="form-label" htmlFor="gender">Jenis Kelamin</label>
                        <select 
                          id="gender" name="gender" 
                          value={formData.gender} onChange={handleChange}
                          className="form-control" required
                        >
                          <option value="">-- Pilih --</option>
                          <option value="Laki-laki">Laki-laki</option>
                          <option value="Perempuan">Perempuan</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem' }}>
                      {/* Birth Place Date */}
                      <div className="form-group">
                        <label className="form-label" htmlFor="birth_place_date">Tempat, Tanggal Lahir</label>
                        <input 
                          type="text" id="birth_place_date" name="birth_place_date" 
                          placeholder="Contoh: Bandung, 15 Juni 2004"
                          value={formData.birth_place_date} onChange={handleChange}
                          className="form-control" required
                        />
                      </div>

                      {/* Age */}
                      <div className="form-group">
                        <label className="form-label" htmlFor="age">Usia (Tahun)</label>
                        <input 
                          type="number" id="age" name="age" 
                          placeholder="18 - 30" min="18" max="30"
                          value={formData.age} onChange={handleChange}
                          className="form-control" required
                        />
                      </div>
                    </div>

                    {/* Marital Status */}
                    <div className="form-group">
                      <label className="form-label" htmlFor="marital_status">Status Pernikahan</label>
                      <select 
                        id="marital_status" name="marital_status" 
                        value={formData.marital_status} onChange={handleChange}
                        className="form-control" required
                      >
                        <option value="">-- Pilih Status --</option>
                        <option value="Belum Menikah">Belum Menikah</option>
                        <option value="Menikah">Menikah</option>
                        <option value="Cerai Hidup/Mati">Cerai Hidup/Mati</option>
                      </select>
                    </div>

                    {/* Address */}
                    <div className="form-group">
                      <label className="form-label" htmlFor="address">Alamat Rumah Lengkap (KTP)</label>
                      <textarea 
                        id="address" name="address" 
                        rows="3" placeholder="Masukkan alamat lengkap RT/RW, Kelurahan, Kecamatan, Kota..."
                        value={formData.address} onChange={handleChange}
                        className="form-control" required
                      ></textarea>
                    </div>

                    {/* Navigation */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                      <button type="button" onClick={handleNext} className="btn btn-secondary" style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}>
                        Selanjutnya
                        <ArrowRight size={18} />
                      </button>
                    </div>
                  </div>
                )}

                {/* ==========================================
                   STEP 2: FISIK & PENDIDIKAN
                   ========================================== */}
                {step === 2 && (
                  <div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                      {/* Height */}
                      <div className="form-group">
                        <label className="form-label" htmlFor="height">Tinggi Badan (cm)</label>
                        <input 
                          type="number" id="height" name="height" 
                          placeholder="Contoh: 165"
                          value={formData.height} onChange={handleChange}
                          className="form-control" required
                        />
                      </div>

                      {/* Weight */}
                      <div className="form-group">
                        <label className="form-label" htmlFor="weight">Berat Badan (kg)</label>
                        <input 
                          type="number" id="weight" name="weight" 
                          placeholder="Contoh: 58"
                          value={formData.weight} onChange={handleChange}
                          className="form-control" required
                        />
                      </div>
                    </div>

                    {/* Tattoo */}
                    <div className="form-group">
                      <label className="form-label" htmlFor="has_tattoo">Apakah Anda memiliki tato di badan?</label>
                      <select 
                        id="has_tattoo" name="has_tattoo" 
                        value={formData.has_tattoo} onChange={handleChange}
                        className="form-control" required
                      >
                        <option value="">-- Pilih --</option>
                        <option value="Tidak">Tidak</option>
                        <option value="Ya">Ya (Memiliki Tato)</option>
                      </select>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem' }}>
                      {/* Last Education */}
                      <div className="form-group">
                        <label className="form-label" htmlFor="last_education">Pendidikan Terakhir</label>
                        <select 
                          id="last_education" name="last_education" 
                          value={formData.last_education} onChange={handleChange}
                          className="form-control" required
                        >
                          <option value="">-- Pilih Pendidikan --</option>
                          <option value="SMK">SMK</option>
                          <option value="SMA">SMA</option>
                          <option value="MA">MA</option>
                          <option value="Diploma D3">Diploma D3</option>
                          <option value="Sarjana S1">Sarjana S1</option>
                        </select>
                      </div>

                      {/* Major */}
                      <div className="form-group">
                        <label className="form-label" htmlFor="major">Jurusan</label>
                        <input 
                          type="text" id="major" name="major" 
                          placeholder="Contoh: Teknik Otomotif"
                          value={formData.major} onChange={handleChange}
                          className="form-control" required
                        />
                      </div>
                    </div>

                    {/* File Upload: Ijazah */}
                    <div className="form-group">
                      <label className="form-label">Upload Foto / Scan Ijazah Terakhir (JPG/PNG/PDF max 3MB)</label>
                      <div style={{ position: 'relative', border: '2px dashed var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '1.5rem', textAlign: 'center', backgroundColor: 'var(--color-bg-light)' }}>
                        <input 
                          type="file" 
                          accept=".jpg,.jpeg,.png,.pdf"
                          onChange={(e) => handleFileChange(e, 'ijazah')}
                          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                        />
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)' }}>
                          {ijazahFile ? (
                            <>
                              <Paperclip size={28} style={{ color: 'var(--color-success)' }} />
                              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-primary)' }}>{ijazahFile.name}</span>
                              <span style={{ fontSize: '0.75rem' }}>Klik atau seret untuk mengganti file</span>
                            </>
                          ) : (
                            <>
                              <Upload size={28} />
                              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Pilih File Ijazah</span>
                              <span style={{ fontSize: '0.75rem' }}>Format: JPG, PNG, PDF (Maks 3MB)</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Navigation */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                      <button type="button" onClick={handlePrev} className="btn btn-outline" style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}>
                        <ArrowLeft size={18} />
                        Sebelumnya
                      </button>
                      
                      <button type="button" onClick={handleNext} className="btn btn-secondary" style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}>
                        Selanjutnya
                        <ArrowRight size={18} />
                      </button>
                    </div>
                  </div>
                )}

                {/* ==========================================
                   STEP 3: KOMPETENSI & MINAT
                   ========================================== */}
                {step === 3 && (
                  <div>
                    {/* Joining Purpose */}
                    <div className="form-group">
                      <label className="form-label" htmlFor="joining_purpose">Tujuan Bergabung dengan LPK</label>
                      <textarea 
                        id="joining_purpose" name="joining_purpose" 
                        rows="2" placeholder="Jelaskan apa tujuan atau motivasi Anda masuk pendidikan LPK..."
                        value={formData.joining_purpose} onChange={handleChange}
                        className="form-control" required
                      ></textarea>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                      {/* SIM A */}
                      <div className="form-group">
                        <label className="form-label" htmlFor="has_sim_a">Apakah memiliki SIM A?</label>
                        <select 
                          id="has_sim_a" name="has_sim_a" 
                          value={formData.has_sim_a} onChange={handleChange}
                          className="form-control" required
                        >
                          <option value="">-- Pilih --</option>
                          <option value="Tidak">Tidak</option>
                          <option value="Ya">Ya</option>
                        </select>
                      </div>

                      {/* Desired Job */}
                      <div className="form-group">
                        <label className="form-label" htmlFor="desired_job">Job / Pekerjaan yang Diinginkan</label>
                        <select 
                          id="desired_job" name="desired_job" 
                          value={formData.desired_job} onChange={handleChange}
                          className="form-control" required
                        >
                          <option value="">-- Pilih Job --</option>
                          <option value="Ginou Jisshusei (Magang)">Ginou Jisshusei (Magang Kerja)</option>
                          <option value="Tokutei Ginou (SSW)">Tokutei Ginou (Kerja Keahlian Khusus)</option>
                        </select>
                      </div>
                    </div>

                    {/* File Upload: SIM A (Conditional) */}
                    {formData.has_sim_a === 'Ya' && (
                      <div className="form-group animate-slide-up">
                        <label className="form-label">Upload Foto SIM A Anda (JPG/PNG/PDF max 3MB)</label>
                        <div style={{ position: 'relative', border: '2px dashed var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '1.5rem', textAlign: 'center', backgroundColor: 'var(--color-bg-light)' }}>
                          <input 
                            type="file" 
                            accept=".jpg,.jpeg,.png,.pdf"
                            onChange={(e) => handleFileChange(e, 'sim')}
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                            required
                          />
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)' }}>
                            {simFile ? (
                              <>
                                <Paperclip size={28} style={{ color: 'var(--color-success)' }} />
                                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-primary)' }}>{simFile.name}</span>
                              </>
                            ) : (
                              <>
                                <Upload size={28} />
                                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Pilih Foto SIM A</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                      {/* Studied Japanese */}
                      <div className="form-group">
                        <label className="form-label" htmlFor="studied_japanese">Apakah pernah belajar Bahasa Jepang? Berapa lama?</label>
                        <input 
                          type="text" id="studied_japanese" name="studied_japanese" 
                          placeholder="Contoh: Tidak Pernah, atau Ya - 3 Bulan"
                          value={formData.studied_japanese} onChange={handleChange}
                          className="form-control" required
                        />
                      </div>

                      {/* Has Certificate */}
                      <div className="form-group">
                        <label className="form-label" htmlFor="has_certificate">Punya Sertifikat JLPT/JFT/J-TEST/NAT?</label>
                        <select 
                          id="has_certificate" name="has_certificate" 
                          value={formData.has_certificate} onChange={handleChange}
                          className="form-control" required
                        >
                          <option value="">-- Pilih --</option>
                          <option value="Tidak">Tidak</option>
                          <option value="Ya">Ya</option>
                        </select>
                      </div>
                    </div>

                    {/* File Upload: Certificate (Conditional) */}
                    {formData.has_certificate === 'Ya' && (
                      <div className="form-group animate-slide-up">
                        <label className="form-label">Upload Foto Sertifikat Bahasa (JPG/PNG/PDF max 3MB)</label>
                        <div style={{ position: 'relative', border: '2px dashed var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '1.5rem', textAlign: 'center', backgroundColor: 'var(--color-bg-light)' }}>
                          <input 
                            type="file" 
                            accept=".jpg,.jpeg,.png,.pdf"
                            onChange={(e) => handleFileChange(e, 'cert')}
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                            required
                          />
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)' }}>
                            {certFile ? (
                              <>
                                <Paperclip size={28} style={{ color: 'var(--color-success)' }} />
                                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-primary)' }}>{certFile.name}</span>
                              </>
                            ) : (
                              <>
                                <Upload size={28} />
                                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Pilih Foto Sertifikat</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                      {/* Japanese Level */}
                      <div className="form-group">
                        <label className="form-label" htmlFor="japanese_level">Level Bahasa Jepang yang Dimiliki</label>
                        <select 
                          id="japanese_level" name="japanese_level" 
                          value={formData.japanese_level} onChange={handleChange}
                          className="form-control" required
                        >
                          <option value="">-- Pilih Level --</option>
                          <option value="Belum Bisa / Nol">Belum Bisa / Nol</option>
                          <option value="Dasar (N5)">Dasar (N5)</option>
                          <option value="Menengah (N4)">Menengah (N4)</option>
                          <option value="Lanjut (N3/Keatas)">Lanjut (N3/Keatas)</option>
                        </select>
                      </div>

                      {/* LPK Info Source */}
                      <div className="form-group">
                        <label className="form-label" htmlFor="lpk_info_source">Dari mana mengetahui info LPK?</label>
                        <select 
                          id="lpk_info_source" name="lpk_info_source" 
                          value={formData.lpk_info_source} onChange={handleChange}
                          className="form-control" required
                        >
                          <option value="">-- Pilih Sumber --</option>
                          <option value="Instagram / Facebook">Instagram / Facebook</option>
                          <option value="TikTok">TikTok</option>
                          <option value="Website Resmi LPK">Website Resmi LPK</option>
                          <option value="Rekomendasi Alumni LPK">Rekomendasi Alumni LPK</option>
                          <option value="Brosur / Spanduk">Brosur / Spanduk</option>
                        </select>
                      </div>
                    </div>

                    {/* Japan Reason */}
                    <div className="form-group">
                      <label className="form-label" htmlFor="japan_reason">Alasan utama Anda ingin bekerja ke Jepang?</label>
                      <textarea 
                        id="japan_reason" name="japan_reason" 
                        rows="3" placeholder="Contoh: Ingin meningkatkan kondisi ekonomi keluarga, belajar teknologi industri otomotif, meningkatkan skill kemandirian..."
                        value={formData.japan_reason} onChange={handleChange}
                        className="form-control" required
                      ></textarea>
                    </div>

                    {/* Navigation */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                      <button type="button" onClick={handlePrev} className="btn btn-outline" style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }} disabled={status.loading}>
                        <ArrowLeft size={18} />
                        Sebelumnya
                      </button>
                      
                      <button type="submit" className="btn btn-primary" style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center', minWidth: '180px' }} disabled={status.loading}>
                        {status.loading ? (
                          <>
                            <RefreshCw className="animate-spin" size={18} />
                            Memproses...
                          </>
                        ) : (
                          <>
                            <Send size={18} />
                            Kirim Pendaftaran
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

              </form>
            )}

          </div>

        </div>
      </div>
    </section>
  );
}
