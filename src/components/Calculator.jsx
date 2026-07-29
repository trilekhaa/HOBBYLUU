import React, { useState } from 'react';
import { Calculator as CalcIcon, DollarSign, Shield, Sprout, ArrowRight, Zap } from 'lucide-react';

export default function Calculator({ onApplyWithEstimate }) {
  const [hectares, setHectares] = useState(3.5);
  const [crop, setCrop] = useState('maize');
  const [climateZone, setClimateZone] = useState('moderate');
  const [irrigation, setIrrigation] = useState('rainfed');

  // Dynamic Calculation Logic
  const cropMultiplier = crop === 'coffee' ? 450 : crop === 'maize' ? 220 : crop === 'wheat' ? 260 : 180;
  const zoneFactor = climateZone === 'high' ? 0.8 : climateZone === 'moderate' ? 1.0 : 1.2;
  const irrigationFactor = irrigation === 'drip' ? 1.3 : 1.0;

  const estimatedCreditLine = Math.round(hectares * cropMultiplier * zoneFactor * irrigationFactor);
  const estimatedCoverage = Math.round(estimatedCreditLine * 2.2);
  const grossPremium = Math.round(estimatedCoverage * 0.04);
  const netPremium = Math.round(grossPremium * 0.5); // 50% Subsidized by Climate Mitigation Fund

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
        <div style={{ background: 'rgba(245, 158, 11, 0.2)', padding: '8px', borderRadius: '10px' }}>
          <CalcIcon size={20} color="#fbbf24" />
        </div>
        <div>
          <h2 style={{ fontSize: '1.15rem', color: '#fff', margin: 0 }}>
            Instant Credit & Insurance Quote Estimator
          </h2>
          <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0 }}>
            Simulate credit line and parametric premium based on farm parameters
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        
        {/* Input Parameters */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Farm Size Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', color: '#e2e8f0', marginBottom: '0.35rem' }}>
              <span>Farm Land Size:</span>
              <span style={{ fontWeight: 700, color: '#34d399' }}>{hectares} Hectares</span>
            </div>
            <input 
              type="range" 
              min="0.5" 
              max="15" 
              step="0.5" 
              value={hectares} 
              onChange={(e) => setHectares(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#10b981', cursor: 'pointer' }}
            />
          </div>

          {/* Crop Type Selection */}
          <div>
            <label style={{ fontSize: '0.825rem', color: '#e2e8f0', display: 'block', marginBottom: '0.35rem' }}>Crop Type:</label>
            <select 
              value={crop} 
              onChange={(e) => setCrop(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#fff',
                padding: '0.6rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.85rem'
              }}
            >
              <option value="maize">🌽 Hybrid Maize</option>
              <option value="wheat">🌾 Hard Winter Wheat</option>
              <option value="coffee">☕ Arabica Coffee</option>
              <option value="sorghum">🌱 Drought-Resistant Sorghum</option>
            </select>
          </div>

          {/* Climate Zone Risk */}
          <div>
            <label style={{ fontSize: '0.825rem', color: '#e2e8f0', display: 'block', marginBottom: '0.35rem' }}>Regional Climate Zone Risk:</label>
            <select 
              value={climateZone} 
              onChange={(e) => setClimateZone(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#fff',
                padding: '0.6rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.85rem'
              }}
            >
              <option value="low">🟢 Low Vulnerability (Consistent Rainfall)</option>
              <option value="moderate">🟡 Moderate Zone (Occasional Spells)</option>
              <option value="high">🔴 High Drought Zone (Kitale/Eastern Sector)</option>
            </select>
          </div>

        </div>

        {/* Calculated Results Box */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(6, 182, 212, 0.08) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          borderRadius: '12px',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Calculated Pre-Approval Quote
            </div>
            
            <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.825rem', color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <DollarSign size={14} color="#34d399" />
                  Microcredit Capacity:
                </span>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#34d399', fontFamily: 'var(--font-heading)' }}>
                  ${estimatedCreditLine} USD
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.825rem', color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Shield size={14} color="#22d3ee" />
                  Parametric Sum Insured:
                </span>
                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#22d3ee' }}>
                  ${estimatedCoverage} USD
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.5rem' }}>
                <span style={{ fontSize: '0.825rem', color: '#94a3b8' }}>
                  Seasonal Insurance Premium:
                </span>
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fbbf24' }}>
                  ${netPremium} USD <span style={{ fontSize: '0.7rem', color: '#34d399' }}>(50% Subsidized)</span>
                </span>
              </div>

            </div>
          </div>

          <button
            className="btn-primary"
            onClick={() => onApplyWithEstimate(estimatedCreditLine)}
            style={{ marginTop: '1rem', width: '100%', justifyContent: 'center', fontSize: '0.85rem' }}
          >
            <Zap size={16} />
            <span>Apply For ${estimatedCreditLine} Credit Now</span>
            <ArrowRight size={16} />
          </button>
        </div>

      </div>

    </div>
  );
}
