import React from 'react';
import { 
  Sprout, 
  Wallet, 
  Radio, 
  Smartphone, 
  Building2, 
  UserCheck,
  Zap,
  Scan,
  TrendingUp
} from 'lucide-react';

export default function Navbar({ 
  currentRole, 
  setCurrentRole, 
  walletBalance, 
  creditLine, 
  openOfflineDrawer,
  openOcrScanner,
  activeTriggerAlert
}) {
  return (
    <header className="glass-panel" style={{ borderRadius: '0 0 20px 20px', borderTop: 'none', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Brand Logo & Tagline */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)'
          }}>
            <Sprout size={26} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ fontSize: '1.4rem', color: '#fff', margin: 0, fontWeight: 800, letterSpacing: '-0.02em' }}>
                Agro<span style={{ color: '#34d399' }}>Finance</span>
              </h1>
              <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>v2.4 Live</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>
              Parametric Insurance & Microcredit Engine
            </p>
          </div>
        </div>

        {/* Role Switcher */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.8)',
          padding: '4px',
          borderRadius: '9999px',
          border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          gap: '4px'
        }}>
          <button
            onClick={() => setCurrentRole('farmer')}
            aria-pressed={currentRole === 'farmer'}
            style={{
              background: currentRole === 'farmer' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'transparent',
              color: currentRole === 'farmer' ? '#fff' : '#94a3b8',
              border: 'none',
              padding: '0.45rem 1.1rem',
              borderRadius: '9999px',
              fontWeight: 600,
              fontSize: '0.825rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s ease',
              fontFamily: 'var(--font-heading)'
            }}
          >
            <UserCheck size={16} />
            Farmer View
          </button>

          <button
            onClick={() => setCurrentRole('insurer')}
            aria-pressed={currentRole === 'insurer'}
            style={{
              background: currentRole === 'insurer' ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' : 'transparent',
              color: currentRole === 'insurer' ? '#fff' : '#94a3b8',
              border: 'none',
              padding: '0.45rem 1.1rem',
              borderRadius: '9999px',
              fontWeight: 600,
              fontSize: '0.825rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s ease',
              fontFamily: 'var(--font-heading)'
            }}
          >
            <Building2 size={16} />
            Insurer Hub
          </button>
        </div>

        {/* Actions & Wallet */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          
          {activeTriggerAlert ? (
            <div className="badge badge-rose pulsing-radar" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.85rem' }}>
              <Zap size={14} />
              <span>Trigger Active</span>
            </div>
          ) : (
            <div className="badge badge-cyan" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.85rem' }}>
              <Radio size={14} className="pulsing-radar" />
              <span>Sentinel-2 Sync</span>
            </div>
          )}

          <button 
            className="btn-secondary" 
            onClick={openOcrScanner}
            aria-label="Open AI OCR document scanner"
            style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem', border: '1px solid rgba(6, 182, 212, 0.4)', color: '#22d3ee' }}
          >
            <Scan size={15} color="#22d3ee" />
            <span>OCR Scan</span>
          </button>

          <button 
            className="btn-secondary" 
            onClick={openOfflineDrawer}
            aria-label="Open USSD mobile menu simulator"
            style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
          >
            <Smartphone size={15} color="#fbbf24" />
            <span>USSD</span>
          </button>

          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            padding: '0.35rem 0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '6px', borderRadius: '8px' }}>
              <Wallet size={18} color="#34d399" />
            </div>
            <div>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Wallet
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#34d399', fontFamily: 'var(--font-heading)' }}>
                ${walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>
            {creditLine > 0 && (
              <>
                <div style={{ width: '1px', height: '28px', background: 'rgba(255,255,255,0.1)' }} />
                <div>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    <TrendingUp size={10} /> Credit Line
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#22d3ee', fontFamily: 'var(--font-heading)' }}>
                    ${creditLine.toLocaleString()}
                  </div>
                </div>
              </>
            )}
          </div>

        </div>

      </div>
    </header>
  );
}
