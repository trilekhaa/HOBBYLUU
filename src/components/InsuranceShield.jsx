import React from 'react';
import { 
  ShieldCheck, 
  Droplets, 
  Thermometer, 
  CloudRain, 
  CheckCircle2, 
  AlertCircle, 
  Zap, 
  Clock, 
  Lock,
  Cpu,
  FileX
} from 'lucide-react';

export default function InsuranceShield({ activeTrigger, onSimulatePayoutTrigger, liveWeatherData }) {
  
  // Parametric readings: live telemetry with trigger overrides
  const rainfallVal = activeTrigger === 'drought' ? 6.2 : activeTrigger === 'flood' ? 182.0 : (liveWeatherData?.rain21Day ?? 38.5);
  const soilVal = activeTrigger === 'drought' ? 9.4 : activeTrigger === 'flood' ? 95.2 : (liveWeatherData?.soilMoisture ?? 36.8);
  const tempVal = activeTrigger === 'drought' ? 39.8 : activeTrigger === 'flood' ? 24.1 : (liveWeatherData?.temp ?? 29.5);

  const isDroughtBreached = rainfallVal < 12.0;
  const isFloodBreached = rainfallVal > 150.0;
  const isBreached = isDroughtBreached || isFloodBreached;

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={22} color="#34d399" />
            <h2 style={{ fontSize: '1.15rem', color: '#fff', margin: 0 }}>
              Parametric Drought & Flood Shield
            </h2>
          </div>
          <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '2px 0 0 1.7rem' }}>
            Policy ID: POL-2026-889 • Sum Insured: <strong>$2,500 USD</strong> • Sub-Second Payout
          </p>
        </div>

        <div className={`badge ${isBreached ? 'badge-rose' : 'badge-emerald'}`} style={{ padding: '0.4rem 0.85rem' }}>
          {isBreached ? (
            <>
              <AlertCircle size={14} />
              Trigger Breached
            </>
          ) : (
            <>
              <CheckCircle2 size={14} />
              Oracle Shield Active
            </>
          )}
        </div>
      </div>

      {/* Live Parametric Sensor Telemetry Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.85rem', marginBottom: '1.25rem' }}>
        
        {/* Rainfall Metric */}
        <div style={{
          background: isDroughtBreached ? 'rgba(244, 63, 94, 0.12)' : isFloodBreached ? 'rgba(245, 158, 11, 0.12)' : 'rgba(255, 255, 255, 0.03)',
          border: isDroughtBreached ? '1px solid rgba(244, 63, 94, 0.4)' : isFloodBreached ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '1rem',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>21-Day Rain Index</span>
            <CloudRain size={16} color={isDroughtBreached ? '#f43f5e' : isFloodBreached ? '#fbbf24' : '#06b6d4'} />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: isDroughtBreached ? '#f43f5e' : '#fff', fontFamily: 'var(--font-heading)' }}>
            {rainfallVal} <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>mm</span>
          </div>
          <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.2rem' }}>
            Trigger: &lt; 12mm (Drought)
          </div>
        </div>

        {/* Soil Moisture Metric */}
        <div style={{
          background: isBreached ? 'rgba(244, 63, 94, 0.12)' : 'rgba(255, 255, 255, 0.03)',
          border: isBreached ? '1px solid rgba(244, 63, 94, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '1rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>Soil Moisture</span>
            <Droplets size={16} color="#38bdf8" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-heading)' }}>
            {soilVal} <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>%</span>
          </div>
          <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.2rem' }}>
            Root Zone Saturation
          </div>
        </div>

        {/* Surface Temperature */}
        <div style={{
          background: tempVal > 38 ? 'rgba(245, 158, 11, 0.12)' : 'rgba(255, 255, 255, 0.03)',
          border: tempVal > 38 ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '1rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>Thermal Anomaly</span>
            <Thermometer size={16} color={tempVal > 38 ? '#f59e0b' : '#34d399'} />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-heading)' }}>
            {tempVal} <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>°C</span>
          </div>
          <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.2rem' }}>
            Land Surface Temp
          </div>
        </div>

      </div>

      {/* Sub-Second Edge Payout Architecture Card */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.7)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '12px',
        padding: '1.1rem',
        marginBottom: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#e2e8f0', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Zap size={15} color="#22d3ee" />
            Sub-Second Edge Payout Architecture:
          </span>
          <span style={{ fontSize: '0.7rem', color: '#34d399', fontFamily: 'var(--font-mono)' }}>
            Latency Target: &lt;500ms
          </span>
        </div>

        {/* Edge Payout Workflow Diagram */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', fontSize: '0.725rem', textAlign: 'center' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.6rem 0.4rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ color: '#94a3b8', fontSize: '0.65rem' }}>1. Satellite Scan</div>
            <div style={{ fontWeight: 600, color: '#38bdf8' }}>NASA / Sentinel Feed</div>
          </div>
          
          <div style={{ background: isBreached ? 'rgba(244, 63, 94, 0.2)' : 'rgba(255,255,255,0.03)', padding: '0.6rem 0.4rem', borderRadius: '8px', border: isBreached ? '1px solid #f43f5e' : '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ color: '#94a3b8', fontSize: '0.65rem' }}>2. Edge Smart Contract</div>
            <div style={{ fontWeight: 600, color: isBreached ? '#f43f5e' : '#e2e8f0' }}>Zero Land Title Lock</div>
          </div>

          <div style={{ background: isBreached ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.03)', padding: '0.6rem 0.4rem', borderRadius: '8px', border: isBreached ? '1px solid #34d399' : '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ color: '#94a3b8', fontSize: '0.65rem' }}>3. Sub-Second Payout</div>
            <div style={{ fontWeight: 600, color: isBreached ? '#34d399' : '#e2e8f0' }}>2G/3G Cell Tower Relay</div>
          </div>
        </div>
      </div>

      {/* Zero Formal Land Title & Zero Financial History Guarantee */}
      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(6, 182, 212, 0.08)', border: '1px dashed rgba(6, 182, 212, 0.3)', padding: '0.75rem 1rem', borderRadius: '10px' }}>
        <div style={{ fontSize: '0.78rem', color: '#22d3ee', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <FileX size={16} color="#22d3ee" />
          <span><strong>Zero Bank Records or Formal Land Titles Required:</strong> Verified using customary GPS plot boundaries & satellite crop resilience.</span>
        </div>
      </div>

    </div>
  );
}
