import React, { useState } from 'react';
import { 
  X, 
  Zap, 
  CheckCircle, 
  Award, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles,
  HelpCircle,
  FileCheck,
  FileX,
  MapPin,
  Radio,
  Clock,
  WifiOff
} from 'lucide-react';

export default function CreditModal({ isOpen, onClose, onApplyLoan, currentWalletBalance }) {
  const [loanAmount, setLoanAmount] = useState(450);
  const [disbursementType, setDisbursementType] = useState('voucher'); // 'voucher' or 'cash'
  const [isApplying, setIsApplying] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  const [executionTimeMs, setExecutionTimeMs] = useState(0);

  if (!isOpen) return null;

  // Agronomic Credit Score
  const creditScore = 748; 
  const maxLimit = 1200;
  const estimatedInterestRate = 4.2;
  const totalRepayment = Math.round(loanAmount * (1 + estimatedInterestRate / 100));

  const handleConfirmLoan = () => {
    setIsApplying(true);
    const startTime = performance.now();
    
    // Simulate Edge Network Sub-Second Execution (< 450ms)
    setTimeout(() => {
      const endTime = performance.now();
      const latency = Math.round(endTime - startTime);
      setExecutionTimeMs(latency > 0 ? latency : 340);
      setIsApplying(false);
      setApplicationSuccess(true);
      
      setTimeout(() => {
        onApplyLoan(loanAmount, disbursementType, latency);
        setApplicationSuccess(false);
        onClose();
      }, 2200);
    }, 380); // Sub-second timing!
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(8, 13, 26, 0.88)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '720px',
        width: '100%',
        maxHeight: '92vh',
        overflowY: 'auto',
        padding: '2rem',
        border: '1px solid rgba(16, 185, 129, 0.35)',
        position: 'relative'
      }}>
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'rgba(255,255,255,0.06)',
            border: 'none',
            color: '#94a3b8',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={18} />
        </button>

        {applicationSuccess ? (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
            <div style={{
              width: '76px',
              height: '76px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.2)',
              border: '2px solid #34d399',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto',
              boxShadow: '0 0 30px rgba(16, 185, 129, 0.4)'
            }}>
              <CheckCircle size={44} color="#34d399" />
            </div>

            {/* Sub-Second Execution Badge */}
            <div className="badge badge-cyan" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1.1rem', marginBottom: '1rem', fontSize: '0.85rem' }}>
              <Zap size={15} color="#22d3ee" />
              <span>Sub-Second Edge Payout Completed: <strong>{executionTimeMs || 340}ms</strong></span>
            </div>

            <h2 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '0.5rem' }}>
              Microcredit Instantly Disbursed!
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', maxWidth: '460px', margin: '0 auto 1.5rem auto' }}>
              ${loanAmount} sent via <strong>Edge Cell Tower Relay</strong> to your {disbursementType === 'voucher' ? 'Agri-Input Digital Voucher Wallet' : 'Mobile Money (M-Pesa) Wallet'}.
            </p>

            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '0.85rem', maxWidth: '420px', margin: '0 auto', fontSize: '0.8rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                <span>Formal Land Title Needed:</span>
                <span style={{ color: '#34d399', fontWeight: 600 }}>NONE (Satellite Geo-Lock Used)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                <span>Bank Statement / Credit History:</span>
                <span style={{ color: '#34d399', fontWeight: 600 }}>NONE (NDVI Satellite AI Score)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                <span>Network Protocol:</span>
                <span style={{ color: '#22d3ee', fontWeight: 600 }}>2G EDGE Local Micro-Relay</span>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '10px', borderRadius: '12px' }}>
                <Zap size={24} color="#34d399" />
              </div>
              <div>
                <h2 style={{ fontSize: '1.4rem', color: '#fff', margin: 0 }}>
                  Instant Microcredit (Zero Land Title & Zero Bank Record)
                </h2>
                <p style={{ fontSize: '0.825rem', color: '#94a3b8', margin: 0 }}>
                  Sub-Second Payout Execution via Edge Mobile Networks
                </p>
              </div>
            </div>

            {/* Zero Land Title & Zero Financial Record Guarantee Banner */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(99, 102, 241, 0.08) 100%)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              borderRadius: '12px',
              padding: '1rem',
              marginBottom: '1.25rem',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.85rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <FileX size={20} color="#34d399" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#fff' }}>No Formal Land Title Required</div>
                  <div style={{ fontSize: '0.725rem', color: '#94a3b8', marginTop: '2px' }}>
                    Replaced by satellite GPS plot boundary polygon & community co-op consensus lock.
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <FileX size={20} color="#22d3ee" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#fff' }}>No Bank Statements / Credit Bureau</div>
                  <div style={{ fontSize: '0.725rem', color: '#94a3b8', marginTop: '2px' }}>
                    Replaced by 5-year satellite crop canopy history & mobile money telemetry.
                  </div>
                </div>
              </div>
            </div>

            {/* Agronomic Credit Score Card */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: '14px',
              padding: '1.1rem',
              marginBottom: '1.25rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div>
                <div style={{ fontSize: '0.725rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Alternative Satellite Credit Score
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.2rem' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 800, color: '#34d399', fontFamily: 'var(--font-heading)' }}>
                    {creditScore}
                  </span>
                  <span style={{ fontSize: '0.9rem', color: '#64748b' }}>/ 850</span>
                  <span className="badge badge-emerald" style={{ marginLeft: '0.5rem' }}>Prime Agronomic Tier</span>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.725rem', color: '#94a3b8' }}>Edge Pre-Approved Limit</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>${maxLimit} USD</div>
              </div>
            </div>

            {/* Loan Amount Slider */}
            <div style={{ marginBottom: '1.25rem', background: 'rgba(15, 23, 42, 0.6)', padding: '1.1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fff' }}>Select Loan Amount:</label>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399', fontFamily: 'var(--font-heading)' }}>
                  ${loanAmount} USD
                </span>
              </div>

              <input 
                type="range" 
                min="100" 
                max={maxLimit} 
                step="50"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#10b981', cursor: 'pointer', height: '6px' }}
              />
            </div>

            {/* Sub-Second Edge Disbursement Tech Pill */}
            <div style={{ background: 'rgba(6, 182, 212, 0.08)', border: '1px solid rgba(6, 182, 212, 0.25)', padding: '0.75rem 1rem', borderRadius: '10px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: '#22d3ee' }}>
                <Radio size={16} className="pulsing-radar" />
                <span><strong>Sub-Second Edge Execution:</strong> Payout routed via Local 2G/3G Base Station Edge Relays (&lt;500ms).</span>
              </div>
              <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>Latency: ~340ms</span>
            </div>

            {/* Submit Button */}
            <button
              className="btn-primary"
              onClick={handleConfirmLoan}
              disabled={isApplying}
              style={{ width: '100%', justifyContent: 'center', padding: '1rem', fontSize: '1rem' }}
            >
              {isApplying ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Zap size={18} className="pulsing-radar" color="#fbbf24" />
                  Executing Sub-Second Payout via Edge Network...
                </span>
              ) : (
                <>
                  <Zap size={18} color="#ffffff" />
                  <span>Disburse ${loanAmount} in &lt;1 Second via Edge Network</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </>
        )}

      </div>
    </div>
  );
}
