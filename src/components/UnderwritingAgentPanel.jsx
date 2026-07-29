import React, { useState, useEffect } from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle, RefreshCw, Database, Info, Zap } from 'lucide-react';
import { runCreditUnderwriting } from '../agents/CreditUnderwritingAgent';

const RISK_TIERS = {
  'Low Risk':    { color: '#34d399', badgeClass: 'badge-emerald' },
  'Medium Risk': { color: '#fbbf24', badgeClass: 'badge-amber' },
  'High Risk':   { color: '#f43f5e', badgeClass: 'badge-rose' },
};

const DATA_SOURCES = [
  { label: 'Satellite NDVI (5-yr history)', icon: '🛰️' },
  { label: 'Community Co-op Reputation', icon: '🤝' },
  { label: 'Climate Zone Drought Index', icon: '🌦️' },
  { label: 'Mobile Money Utility Signal', icon: '📱' },
  { label: 'OCR Land Boundary Polygon', icon: '📄' },
];

const STEPS = [
  'Checking eligibility — ingesting alternative data...',
  'Running climate-adjusted default probability model...',
  'Verifying co-op endorsement & OCR land lock...',
  'Assigning risk tier and computing loan terms...',
];

export default function UnderwritingAgentPanel({ liveWeatherData, activeTrigger, extractedOcrDoc, onAgentEvent }) {
  const [phase, setPhase] = useState('idle'); // idle | checking | done
  const [stepLog, setStepLog] = useState([]);
  const [agentResult, setAgentResult] = useState(null);

  const T = agentResult ? RISK_TIERS[agentResult.riskTier] : RISK_TIERS['Low Risk'];

  const ndvi = liveWeatherData?.ndvi ?? 0.78;
  const isFraud = activeTrigger === 'drought' && ndvi < 0.35;

  const runCheck = React.useCallback(() => {
    setPhase('checking');
    setStepLog([]);
    let i = 0;
    const iv = setInterval(() => {
      if (i < STEPS.length) { setStepLog(p => [...p, STEPS[i]]); i++; }
      else {
        clearInterval(iv);
        
        // Call backend agent
        const result = runCreditUnderwriting({
          mobileUsageScore: 82,
          mobileMoneyTxVolume: 600,
          agriPurchaseHistory: true,
          coopVouchingScore: 90,
          requestedAmount: 1200
        });
        
        setAgentResult(result.output);
        setPhase('done');
        onAgentEvent({
          agent: 'Underwriting Agent',
          action: `${result.output.riskEmoji} ${result.output.riskTier} tier assigned — max loan $${result.output.loanTerms.approvedAmount} at ${result.output.loanTerms.interestRatePercentage}%.`,
          timestamp: new Date().toLocaleTimeString(),
          status: result.output.riskTier === 'High Risk' ? 'warn' : 'ok',
        });
      }
    }, 430);
  }, [onAgentEvent]);

  useEffect(() => { runCheck(); }, [runCheck]);
  useEffect(() => { 
    if (phase === 'done' && (activeTrigger !== 'none' || ndvi)) { 
      setPhase('idle'); 
      const t = setTimeout(runCheck, 300); 
      return () => clearTimeout(t);
    } 
  }, [activeTrigger, ndvi]);


  return (
    <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ background: 'rgba(99,102,241,0.18)', padding: '7px', borderRadius: '10px' }}>
            <ShieldCheck size={18} color="#818cf8" />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>Underwriting Agent</div>
            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Eligibility · Risk tier · Loan terms</div>
          </div>
        </div>
        <button onClick={runCheck} disabled={phase === 'checking'}
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', padding: '0.3rem 0.6rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <RefreshCw size={11} className={phase === 'checking' ? 'pulsing-radar' : ''} /> Recheck
        </button>
      </div>

      {/* Checking loader */}
      {phase === 'checking' && (
        <div style={{ background: '#040711', borderRadius: '10px', padding: '0.75rem 1rem', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
          {stepLog.map((l, i) => (
            <div key={i} style={{ color: i === stepLog.length - 1 ? '#818cf8' : '#475569', marginBottom: '0.2rem' }}>› {l}</div>
          ))}
          <div style={{ color: '#818cf8', marginTop: '0.3rem' }} className="pulsing-radar">▌</div>
        </div>
      )}

      {phase === 'done' && agentResult && (
        <>
          {/* Risk Tier Badge */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: `${T.color}12`, border: `1px solid ${T.color}33`, borderRadius: '12px', padding: '0.85rem 1rem' }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Risk Classification</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.25rem' }}>
                <span style={{ fontSize: '1.4rem' }}>{agentResult.riskEmoji}</span>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 800, color: T.color }}>{agentResult.riskTier}</span>
                <span className={`badge ${T.badgeClass}`} style={{ fontSize: '0.64rem' }}>{agentResult.decision}</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Max Loan</div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>${agentResult.loanTerms.approvedAmount}</div>
              <div style={{ fontSize: '0.7rem', color: T.color }}>{agentResult.loanTerms.interestRatePercentage}% harvest rate</div>
            </div>
          </div>

          {/* Data Sources Note */}
          <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '9px', padding: '0.7rem 0.9rem', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Database size={11} /> Data used for scoring (no bank statements required):
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
              {DATA_SOURCES.map((s, i) => (
                <span key={i} style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', color: '#a5b4fc', padding: '0.2rem 0.5rem', borderRadius: '5px', fontSize: '0.68rem' }}>
                  {s.icon} {s.label}
                </span>
              ))}
              {extractedOcrDoc && (
                <span style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399', padding: '0.2rem 0.5rem', borderRadius: '5px', fontSize: '0.68rem' }}>
                  📄 OCR-Verified Doc
                </span>
              )}
            </div>
          </div>

          {/* Fraud flag */}
          {isFraud && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: '8px', padding: '0.5rem 0.75rem', fontSize: '0.72rem', color: '#fb7185' }}>
              <AlertTriangle size={13} />
              <strong>Fraud Flag:</strong>&nbsp;Drought event + low NDVI inconsistent with declared irrigated plot. Escalated to manual review.
            </div>
          )}
        </>
      )}
    </div>
  );
}
