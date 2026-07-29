import React, { useState, useEffect } from 'react';
import { Send, Wifi, WifiOff, CheckCircle, Clock, RefreshCw, AlertTriangle, Zap } from 'lucide-react';
import { runDisbursementAgent } from '../agents/DisbursementRepaymentAgent';

const PAYOUT_STEPS = [
  { label: 'Trigger verified by satellite oracle', ms: 60 },
  { label: 'Smart contract executed on edge node', ms: 180 },
  { label: 'Processing via M-Pesa mobile gateway...', ms: 310 },
  { label: 'Transaction broadcast to cell tower relay', ms: 420 },
  { label: '✅ Payment confirmed & wallet credited', ms: 520 },
];

export default function DisbursementAgentPanel({ lastPayout, walletBalance, activeTrigger, onAgentEvent }) {
  const [phase, setPhase] = useState('idle'); // idle | processing | confirmed | offline
  const [stepIdx, setStepIdx] = useState(-1);
  const [latencyMs, setLatencyMs] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const [syncPending, setSyncPending] = useState(false);
  const [agentResult, setAgentResult] = useState(null);

  // Simulate offline toggle
  const toggleOffline = () => {
    setIsOnline(p => !p);
    if (isOnline) setSyncPending(true);
    else {
      setSyncPending(false);
      onAgentEvent({ agent: 'Disbursement Agent', action: 'Offline queue synced — 1 pending payout transmitted via 2G relay', timestamp: new Date().toLocaleTimeString(), status: 'ok' });
    }
  };

  // Auto-trigger animation when a new payout comes in
  useEffect(() => {
    if (!lastPayout) return;
    setPhase('processing');
    setStepIdx(0);
    setLatencyMs(null);
    setAgentResult(null);
    const start = performance.now();
    let i = 0;
    const iv = setInterval(async () => {
      i++;
      setStepIdx(i);
      if (i >= PAYOUT_STEPS.length) {
        clearInterval(iv);
        const elapsed = Math.round(performance.now() - start);
        
        // Call backend agent
        const result = await runDisbursementAgent({
          eventType: lastPayout.type || 'insurance_payout',
          amount: lastPayout.amount,
          recipientPhone: '+254711223344',
          isOnline: isOnline,
          interestRate: lastPayout.interestRate || 0
        });

        setAgentResult(result.output);
        setLatencyMs(elapsed < 600 ? elapsed : result.metadata?.networkLatencyMs ?? PAYOUT_STEPS[PAYOUT_STEPS.length - 1].ms);
        setPhase('confirmed');
        onAgentEvent({
          agent: 'Disbursement Agent',
          action: `$${lastPayout.amount} disbursed via ${result.output.disbursementMethod} in ${result.metadata?.networkLatencyMs ?? elapsed}ms.`,
          timestamp: new Date().toLocaleTimeString(),
          status: 'ok',
        });
      }
    }, 320);
    return () => clearInterval(iv);
  }, [lastPayout, isOnline, onAgentEvent]);


  return (
    <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ background: 'rgba(16,185,129,0.18)', padding: '7px', borderRadius: '10px' }}>
            <Send size={18} color="#34d399" />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>Disbursement Agent</div>
            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Payout routing · Offline sync · Repayment</div>
          </div>
        </div>
        {/* Online / Offline toggle */}
        <button onClick={toggleOffline}
          style={{ background: isOnline ? 'rgba(16,185,129,0.15)' : 'rgba(244,63,94,0.15)', border: `1px solid ${isOnline ? 'rgba(16,185,129,0.35)' : 'rgba(244,63,94,0.35)'}`, color: isOnline ? '#34d399' : '#f43f5e', padding: '0.3rem 0.65rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          {isOnline ? <Wifi size={11} /> : <WifiOff size={11} />}
          {isOnline ? 'Online' : 'Offline'}
        </button>
      </div>

      {/* Offline sync pending banner */}
      {syncPending && !isOnline && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '8px', padding: '0.5rem 0.75rem', fontSize: '0.72rem', color: '#fbbf24' }}>
          <WifiOff size={13} />
          <span><strong>Offline Mode:</strong> 1 payout queued in local cache — will sync when 2G signal restored.</span>
        </div>
      )}

      {/* Idle state */}
      {phase === 'idle' && !lastPayout && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', color: '#475569', fontSize: '0.8rem', gap: '0.4rem', flexDirection: 'column' }}>
          <Send size={22} color="#334155" />
          <span>Awaiting parametric payout trigger...</span>
          <span style={{ fontSize: '0.7rem', color: '#374151' }}>Trigger a weather event in the simulator above</span>
        </div>
      )}

      {/* Processing steps */}
      {phase === 'processing' && (
        <div style={{ background: '#040711', borderRadius: '10px', padding: '0.75rem 1rem', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
          {PAYOUT_STEPS.slice(0, stepIdx + 1).map((s, i) => (
            <div key={i} style={{ color: i === stepIdx ? '#34d399' : '#475569', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              {i < stepIdx ? <CheckCircle size={11} color="#34d399" /> : <RefreshCw size={11} className="pulsing-radar" color="#34d399" />}
              {s.label}
              <span style={{ color: '#334155', marginLeft: 'auto' }}>{s.ms}ms</span>
            </div>
          ))}
        </div>
      )}

      {/* Confirmed state */}
      {phase === 'confirmed' && lastPayout && (
        <>
          {/* Confirmation card */}
          <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '12px', padding: '0.85rem 1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <CheckCircle size={16} color="#34d399" />
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 700, color: '#34d399' }}>Payment Confirmed</span>
              <span className="badge badge-cyan" style={{ fontSize: '0.64rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Zap size={10} /> {latencyMs ?? PAYOUT_STEPS[PAYOUT_STEPS.length - 1].ms}ms
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-heading)' }}>${lastPayout.amount.toFixed(2)}</div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>via {isOnline ? '2G/3G Edge M-Pesa Relay' : 'Offline Cache → Synced'}</div>
              </div>
              <div style={{ textAlign: 'right', fontSize: '0.72rem' }}>
                <div style={{ color: '#64748b' }}>Wallet balance</div>
                <div style={{ color: '#34d399', fontWeight: 700, fontFamily: 'var(--font-heading)', fontSize: '1rem' }}>${walletBalance.toFixed(2)}</div>
              </div>
            </div>
          </div>

          {/* Repayment schedule */}
          {agentResult?.scheduledRepayment && (
            <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '9px', padding: '0.7rem 0.9rem', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Clock size={11} /> Repayment Schedule
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                <span style={{ color: '#e2e8f0' }}>Collection: {agentResult.scheduledRepayment.collectionDate}</span>
                <span style={{ color: '#34d399', fontWeight: 700 }}>${agentResult.scheduledRepayment.amountDue} at harvest</span>
              </div>
              <div style={{ fontSize: '0.68rem', color: '#475569', marginTop: '0.3rem' }}>{agentResult.scheduledRepayment.collectionMethod}</div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
