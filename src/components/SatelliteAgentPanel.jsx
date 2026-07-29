import React, { useState, useEffect } from 'react';
import { Satellite, Leaf, TrendingUp, AlertTriangle, CheckCircle, RefreshCw, Activity } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { runSatelliteCropAssessment } from '../agents/SatelliteCropAgent';

export default function SatelliteAgentPanel({ liveWeatherData, activeTrigger, onAgentEvent, coordinates = { lat: 0.9821, lon: 35.0029 } }) {
  const [phase, setPhase] = useState('idle'); // idle | scanning | done
  const [scanLog, setScanLog] = useState([]);
  const [agentResult, setAgentResult] = useState(null);

  const ndvi = activeTrigger === 'drought' ? 0.32 : activeTrigger === 'flood' ? 0.48 : (agentResult?.currentNDVI ?? liveWeatherData?.ndvi ?? 0.78);
  const health = ndvi >= 0.65 ? 'Good' : ndvi >= 0.45 ? 'Fair' : 'Poor';
  const healthColor = ndvi >= 0.65 ? '#34d399' : ndvi >= 0.45 ? '#fbbf24' : '#f43f5e';
  const healthClass = ndvi >= 0.65 ? 'badge-emerald' : ndvi >= 0.45 ? 'badge-amber' : 'badge-rose';

  const chartData = agentResult ? agentResult.ndviTimeSeries : [];

  const runScan = React.useCallback(() => {
    setPhase('scanning');
    setScanLog([]);
    const steps = [
      'Pinging Sentinel-2B orbital path...',
      'Requesting Band-4 & Band-8 reflectance tiles...',
      'Computing NDVI for plot boundary polygon...',
      'Cross-referencing soil moisture index...',
      'Generating crop-health classification...',
    ];
    let i = 0;
    const iv = setInterval(() => {
      if (i < steps.length) {
        setScanLog(p => [...p, steps[i]]);
        i++;
      } else {
        clearInterval(iv);
        
        // Call the backend agent simulation
        const result = runSatelliteCropAssessment({
           lat: coordinates.lat,
           lon: coordinates.lon,
           dateFrom: '2026-01-01',
           dateTo: '2026-07-29'
        });
        
        if (activeTrigger === 'drought') result.output.currentNDVI = 0.32;
        if (activeTrigger === 'flood') result.output.currentNDVI = 0.48;
        
        setAgentResult(result.output);
        setPhase('done');
        
        const finalHealth = result.output.currentNDVI >= 0.65 ? 'Good' : result.output.currentNDVI >= 0.45 ? 'Fair' : 'Poor';
        onAgentEvent({
          agent: 'Satellite Agent',
          action: `Crop health classified as "${finalHealth}" (Score: ${result.output.cropHealthScore}, Yield Risk: ${result.output.yieldRiskRating})`,
          timestamp: new Date().toLocaleTimeString(),
          status: finalHealth === 'Poor' ? 'warn' : 'ok',
        });
      }
    }, 420);
  }, [activeTrigger, coordinates.lat, coordinates.lon, onAgentEvent]);

  // Auto-run on mount
  useEffect(() => { runScan(); }, [runScan]);
  // Re-run when trigger changes
  useEffect(() => { 
    if (phase === 'done' && (activeTrigger !== 'none' || liveWeatherData?.ndvi)) { 
      setPhase('idle'); 
      const t = setTimeout(runScan, 200); 
      return () => clearTimeout(t);
    } 
  }, [activeTrigger, liveWeatherData?.ndvi]);


  return (
    <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ background: 'rgba(6,182,212,0.18)', padding: '7px', borderRadius: '10px' }}>
            <Satellite size={18} color="#22d3ee" />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>
              Satellite Agent
            </div>
            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Farm onboarding · NDVI telemetry</div>
          </div>
        </div>
        <button onClick={runScan} disabled={phase === 'scanning'}
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', padding: '0.3rem 0.6rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <RefreshCw size={11} className={phase === 'scanning' ? 'pulsing-radar' : ''} />
          Re-scan
        </button>
      </div>

      {/* Scanning animation */}
      {phase === 'scanning' && (
        <div style={{ background: '#040711', borderRadius: '10px', padding: '0.75rem 1rem', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
          {scanLog.map((l, i) => (
            <div key={i} style={{ color: i === scanLog.length - 1 ? '#22d3ee' : '#475569', marginBottom: '0.2rem' }}>› {l}</div>
          ))}
          <div style={{ color: '#22d3ee', marginTop: '0.3rem' }} className="pulsing-radar">▌</div>
        </div>
      )}

      {/* Results */}
      {phase === 'done' && (
        <>
          {/* Health Badge */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '0.75rem 1rem', border: `1px solid ${healthColor}33` }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Crop Health Classification</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                <Leaf size={16} color={healthColor} />
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800, color: healthColor }}>{health}</span>
                <span className={`badge ${healthClass}`} style={{ fontSize: '0.65rem' }}>NDVI {ndvi.toFixed(2)}</span>
              </div>
            </div>
            <div style={{ textAlign: 'right', fontSize: '0.72rem', color: '#64748b' }}>
              <div>Soil moisture: <strong style={{ color: '#38bdf8' }}>{liveWeatherData?.soilMoisture ?? 42}%</strong></div>
              <div>Surface temp: <strong style={{ color: '#fbbf24' }}>{liveWeatherData?.temp ?? 28.5}°C</strong></div>
            </div>
          </div>

          {/* Mini NDVI Chart */}
          <div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Activity size={12} color="#34d399" /> 6-Month NDVI Trend
            </div>
            <div style={{ height: '70px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="ndviGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={healthColor} stopOpacity={0.4} />
                      <stop offset="95%" stopColor={healthColor} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="ndvi" stroke={healthColor} fill="url(#ndviGrad)" strokeWidth={2} dot={false} />
                  <Tooltip contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '6px', fontSize: '0.72rem' }} formatter={(v) => [v.toFixed(2), 'NDVI']} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Fraud flag */}
          {ndvi < 0.4 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: '8px', padding: '0.5rem 0.75rem', fontSize: '0.72rem', color: '#fb7185' }}>
              <AlertTriangle size={13} />
              <span><strong>Fraud Flag:</strong> Unusually low NDVI for declared crop type. Manual verification recommended.</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
