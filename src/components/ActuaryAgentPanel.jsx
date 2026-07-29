import React, { useState, useEffect } from 'react';
import { Scale, CloudRain, AlertTriangle, RefreshCw, CheckCircle, Info } from 'lucide-react';
import { runParametricRiskActuary } from '../agents/ParametricActuaryAgent';

function PlainLangRule({ icon, label, value, breached }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: breached ? 'rgba(244,63,94,0.1)' : 'rgba(255,255,255,0.03)',
      border: `1px solid ${breached ? 'rgba(244,63,94,0.35)' : 'rgba(255,255,255,0.07)'}`,
      borderRadius: '9px', padding: '0.6rem 0.85rem', transition: 'all 0.3s ease'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#e2e8f0' }}>
        {icon}
        <span>{label}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', fontWeight: 700, color: breached ? '#f43f5e' : '#34d399' }}>{value}</span>
        {breached && <AlertTriangle size={13} color="#f43f5e" />}
      </div>
    </div>
  );
}

export default function ActuaryAgentPanel({ liveWeatherData, activeTrigger, onAgentEvent, coordinates = { lat: 0.9821, lon: 35.0029 } }) {
  const [phase, setPhase] = useState('loading'); // loading | done
  const [agentResult, setAgentResult] = useState(null);

  const rain = activeTrigger === 'drought' ? 6.2 : activeTrigger === 'flood' ? 182.0 : (liveWeatherData?.rain21Day ?? 38.5);
  const temp = liveWeatherData?.temp ?? 29.5;

  const droughtBreached = rain < 20;
  const floodBreached = rain > 150;
  const heatBreached = temp > 38;

  useEffect(() => {
    setPhase('loading');
    const t = setTimeout(() => {
      // Call backend agent
      const result = runParametricRiskActuary({
        lat: coordinates.lat,
        lon: coordinates.lon,
        cropHealthScore: (liveWeatherData?.ndvi ?? 0.78) * 100,
        coverageAmount: 1000
      });
      setAgentResult(result.output);
      setPhase('done');
      onAgentEvent({
        agent: 'Actuary Agent',
        action: `Premium set at $${result.output.pricing.netPremium}/season. Drought trigger: ${result.output.triggers.drought.condition} → payout $${result.output.triggers.drought.payoutAmount}`,
        timestamp: new Date().toLocaleTimeString(),
        status: droughtBreached || floodBreached ? 'warn' : 'ok',
      });
    }, 900);
    return () => clearTimeout(t);
  }, [activeTrigger, liveWeatherData?.rain21Day, liveWeatherData?.ndvi, coordinates.lat, coordinates.lon, droughtBreached, floodBreached, onAgentEvent]);

  const recalc = () => {
    setPhase('loading');
    setTimeout(() => setPhase('done'), 700);
  };

  return (
    <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ background: 'rgba(245,158,11,0.18)', padding: '7px', borderRadius: '10px' }}>
            <Scale size={18} color="#fbbf24" />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>Actuary Agent</div>
            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Premium pricing · Trigger thresholds</div>
          </div>
        </div>
        <button onClick={recalc} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', padding: '0.3rem 0.6rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <RefreshCw size={11} className={phase === 'loading' ? 'pulsing-radar' : ''} /> Recalc
        </button>
      </div>

      {phase === 'loading' && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', padding: '1.2rem', color: '#fbbf24', fontSize: '0.82rem' }}>
          <RefreshCw size={15} className="pulsing-radar" />
          <span>Pricing risk model — running actuarial tables...</span>
        </div>
      )}

      {phase === 'done' && agentResult && (
        <>
          {/* Premium Card */}
          <div style={{ background: 'linear-gradient(135deg,rgba(245,158,11,0.12),rgba(99,102,241,0.08))', border: '1px solid rgba(245,158,11,0.25)', borderRadius: '12px', padding: '0.9rem 1rem' }}>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>Seasonal Insurance Premium</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.7rem', fontWeight: 800, color: '#fbbf24' }}>${agentResult.pricing.netPremium}</span>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>/ season (farmer pays)</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.2rem' }}>
              Gross: ${agentResult.pricing.grossPremium} — Climate Fund subsidy: <span style={{ color: '#34d399' }}>−${agentResult.pricing.subsidyAmount} ({agentResult.pricing.subsidyPercentage}%)</span>
            </div>
          </div>

          {/* Plain-language Trigger Rules */}
          <div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Info size={12} /> Plain-language payout triggers (auto-executed, no claim filing):
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <PlainLangRule icon={<CloudRain size={14} color={droughtBreached ? '#f43f5e' : '#38bdf8'} />}
                label={`Payout $${agentResult.triggers.drought.payoutAmount} if ${agentResult.triggers.drought.condition}`}
                value={`${rain.toFixed(1)}mm`} breached={droughtBreached} />
              <PlainLangRule icon={<CloudRain size={14} color={floodBreached ? '#f43f5e' : '#38bdf8'} />}
                label={`Payout $${agentResult.triggers.flood.payoutAmount} if ${agentResult.triggers.flood.condition}`}
                value={`${rain.toFixed(1)}mm`} breached={floodBreached} />
              <PlainLangRule icon={<span style={{ fontSize: '13px' }}>🌡️</span>}
                label={`Payout $${agentResult.triggers.heat.payoutAmount} if ${agentResult.triggers.heat.condition}`}
                value={`${temp}°C`} breached={heatBreached} />
            </div>
          </div>

          {(droughtBreached || floodBreached || heatBreached) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: '8px', padding: '0.5rem 0.75rem', fontSize: '0.72rem', color: '#fb7185' }}>
              <AlertTriangle size={13} />
              <span><strong>Actuary Flag:</strong> Active trigger breach detected. Parametric execution imminent — reserve pool alerted.</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
