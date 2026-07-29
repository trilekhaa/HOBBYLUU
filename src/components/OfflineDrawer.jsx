import React, { useState } from 'react';
import { Smartphone, X, Send, Radio, Check, RefreshCw } from 'lucide-react';

export default function OfflineDrawer({ isOpen, onClose, walletBalance }) {
  const [ussdScreen, setUssdScreen] = useState('main'); // 'main', 'loan', 'weather', 'voucher'
  const [inputVal, setInputVal] = useState('');
  const [ussdMessage, setUssdMessage] = useState('');

  if (!isOpen) return null;

  const handleSend = () => {
    if (inputVal === '1') {
      setUssdScreen('loan');
    } else if (inputVal === '2') {
      setUssdScreen('voucher');
    } else if (inputVal === '3') {
      setUssdScreen('weather');
    } else {
      setUssdMessage('Invalid USSD Option. Please reply with 1, 2, or 3.');
    }
    setInputVal('');
  };

  const resetUSSD = () => {
    setUssdScreen('main');
    setUssdMessage('');
    setInputVal('');
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(8, 13, 26, 0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1100,
      padding: '1rem'
    }}>
      {/* Phone Casing Mockup */}
      <div style={{
        width: '340px',
        background: '#090e1a',
        border: '3px solid #334155',
        borderRadius: '36px',
        padding: '1.25rem 1rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(16, 185, 129, 0.2)',
        position: 'relative'
      }}>
        
        {/* Top Speaker Bar */}
        <div style={{ width: '60px', height: '4px', background: '#334155', borderRadius: '2px', margin: '0 auto 1rem auto' }} />

        {/* Screen Area */}
        <div style={{
          background: '#052e16',
          color: '#4ade80',
          fontFamily: 'var(--font-mono)',
          padding: '1rem',
          borderRadius: '12px',
          height: '320px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          border: '2px solid #166534',
          boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)'
        }}>
          <div>
            <div style={{ fontSize: '0.7rem', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #166534', paddingBottom: '0.35rem', marginBottom: '0.5rem', opacity: 0.8 }}>
              <span>SIGNAL: 3G EDGE</span>
              <span>*384*99#</span>
            </div>

            {ussdScreen === 'main' && (
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem', color: '#86efac' }}>
                  AgroFinance USSD Mobile
                </div>
                <div style={{ fontSize: '0.75rem', lineHeight: 1.4 }}>
                  1. Check Loan & Wallet<br/>
                  2. Get Seed Voucher QR<br/>
                  3. Satellite Rain Oracle<br/>
                  4. Repay via M-Pesa
                </div>
              </div>
            )}

            {ussdScreen === 'loan' && (
              <div style={{ fontSize: '0.75rem', lineHeight: 1.4 }}>
                <div style={{ fontWeight: 700, color: '#86efac', marginBottom: '0.3rem' }}>[Wallet & Loan Status]</div>
                Balance: ${walletBalance}<br/>
                Active Pre-Limit: $1,200<br/>
                Next Repayment: Oct 2026<br/>
                Status: Tier A+ Prime
              </div>
            )}

            {ussdScreen === 'voucher' && (
              <div style={{ fontSize: '0.75rem', lineHeight: 1.4 }}>
                <div style={{ fontWeight: 700, color: '#86efac', marginBottom: '0.3rem' }}>[Input Voucher Code]</div>
                Voucher ID: #AGRI-8849-2026<br/>
                Value: $450 USD<br/>
                Redeem at Kitale Agrovets for Certified Maize Seeds & Fertilizer.
              </div>
            )}

            {ussdScreen === 'weather' && (
              <div style={{ fontSize: '0.75rem', lineHeight: 1.4 }}>
                <div style={{ fontWeight: 700, color: '#86efac', marginBottom: '0.3rem' }}>[Satellite Telemetry]</div>
                Sentinel-2 Sync: OK<br/>
                21-Day Rain: 38.5mm<br/>
                Parametric Shield: ACTIVE<br/>
                Drought Trigger: &lt;12mm
              </div>
            )}

            {ussdMessage && (
              <div style={{ fontSize: '0.7rem', color: '#fca5a5', marginTop: '0.5rem' }}>
                {ussdMessage}
              </div>
            )}
          </div>

          {/* USSD Reply Input */}
          <div>
            <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.5rem' }}>
              <input 
                type="text" 
                placeholder="Reply (e.g. 1)" 
                value={inputVal} 
                onChange={(e) => setInputVal(e.target.value)}
                style={{
                  width: '100%',
                  background: '#022c22',
                  border: '1px solid #15803d',
                  color: '#4ade80',
                  padding: '0.35rem 0.5rem',
                  borderRadius: '4px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem'
                }}
              />
              <button 
                onClick={handleSend}
                style={{
                  background: '#15803d',
                  color: '#fff',
                  border: 'none',
                  padding: '0 0.6rem',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                <Send size={12} />
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem' }}>
              <span onClick={resetUSSD} style={{ cursor: 'pointer', textDecoration: 'underline' }}>Main Menu</span>
              <span onClick={onClose} style={{ cursor: 'pointer', color: '#ef4444' }}>Exit</span>
            </div>
          </div>

        </div>

        {/* Feature Phone Dialpad Simulator Decor */}
        <div style={{ marginTop: '0.85rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.35rem', textAlign: 'center' }}>
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map(key => (
            <div 
              key={key} 
              onClick={() => setInputVal(prev => prev + key)}
              style={{
                background: '#1e293b',
                color: '#cbd5e1',
                borderRadius: '6px',
                padding: '0.4rem 0',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                border: '1px solid rgba(255,255,255,0.05)',
                userSelect: 'none'
              }}
            >
              {key}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
