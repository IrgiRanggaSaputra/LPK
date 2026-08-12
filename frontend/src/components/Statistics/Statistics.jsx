import React from 'react';
import { PlaneTakeoff, Building2, Timer, GraduationCap } from 'lucide-react';
import './Statistics.css';

export default function Statistics() {
  return (
    <section className="section container animate-slide-up">
      <div className="stats-banner">
        <div className="stats-grid">
          
          {/* Stat Item 1 */}
          <div className="stats-item">
            <div className="stats-icon">
              <PlaneTakeoff size={36} />
            </div>
            <div className="stats-number">1.250<span>+</span></div>
            <div className="stats-label">Alumni Terbang</div>
          </div>
          
          {/* Stat Item 2 */}
          <div className="stats-item">
            <div className="stats-icon">
              <Building2 size={36} />
            </div>
            <div className="stats-number">48<span>+</span></div>
            <div className="stats-label">Mitra Perusahaan</div>
          </div>
          
          {/* Stat Item 3 */}
          <div className="stats-item">
            <div className="stats-icon">
              <Timer size={36} />
            </div>
            <div className="stats-number">4<span>-</span>6</div>
            <div className="stats-label">Bulan Pelatihan</div>
          </div>
          
          {/* Stat Item 4 */}
          <div className="stats-item">
            <div className="stats-icon">
              <GraduationCap size={36} />
            </div>
            <div className="stats-number">100<span>%</span></div>
            <div className="stats-label">Proses Resmi</div>
          </div>

        </div>
      </div>
    </section>
  );
}
