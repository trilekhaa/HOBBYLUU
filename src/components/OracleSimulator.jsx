import React, { useState, useRef } from 'react';
import { 
  Play, 
  RotateCcw, 
  Sun, 
  CloudLightning, 
  Radio, 
  CheckCircle, 
  Zap, 
  Terminal,
  Clock,
  Cpu,
  Wifi
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function OracleSimulator({ activeTrigger, setActiveTrigger, onOraclePayout }) {
  const [logs, setLogs] = useState([
    '[SYSTEM INIT] Edge Satellite Weather Oracle v2.4 Active.',
    '[EDGE NETWORK] Connected to Kitale Cell Tower Relay (Latency: 28ms).',
    '[STATUS] Parameters normal. Rain: 38.5mm, Soil: 36.8%, NDVI: 0.78.'
  ]);

  const [isSimulating, setIsSimulating] = useState(false);
  const [lastLatencyMs, setLastLatencyMs] = useState(328);
  const isMounted = useRef(true);
  React.useEffect(() => { isMounted.current = true; return () => { isMounted.current = false; }; }, []);

  const handleSimulateDrought = () => {
    setIsSimulating(true);
    setActiveTrigger('drought');
    
    const startTime = performance.now();
    
    const newLogs = [
      '[SIMULATION LAUNCHED] Triggering 30-Day Heatwave & Drought Anomaly...',
      '[SATELLITE ORACLE] Sentinel-2 Band 8 reading: 6.2mm rain (< 12mm threshold).',
      '[ZERO-PAPERWORK CHECK] Bypassing land titles & bank records via Satellite Geo-Lock...',
      '[SMART CONTRACT] Parametric Trigger Breached -> Executing Smart Contract...',
      '[EDGE CELL NETWORK] Dispatching sub-second payout packet via 2G/3G Local Micro-Node...',
      `⚡ [SUB-SECOND SUCCESS] $850.00 Payout executed in 328ms directly to Mobile Wallet!`
    ];

    addLogsSequentially(newLogs, () => {
      const endTime = performance.now();
      const actualLatency = Math.round(endTime - startTime);
      setLastLatencyMs(328);
      setIsSimulating(false);
      onOraclePayout(850, 'Severe Drought Parametric Claim', 328);
      triggerConfetti();
    });
  };

  const handleSimulateFlood = () => {
    setIsSimulating(true);
    setActiveTrigger('flood');

    const newLogs = [
      '[SIMULATION LAUNCHED] Triggering Extreme Torrential Rain & Flood Anomaly...',
      '[SATELLITE ORACLE] Radar telemetry: 182mm precipitation over 48 hours...',
      '[ZERO-PAPERWORK CHECK] Validating field geo-polygon boundary...',
      '[SMART CONTRACT] Flood Threshold Breached -> Auto Indemnity Approved...',
      '[EDGE CELL NETWORK] Broadcasting sub-second payment token via EDGE Relay...',
      `⚡ [SUB-SECOND SUCCESS] $1,200.00 Payout executed in 294ms directly to Mobile Wallet!`
    ];

    addLogsSequentially(newLogs, () => {
      setLastLatencyMs(294);
      setIsSimulating(false);
      onOraclePayout(1200, 'Tropical Flood Parametric Claim', 294);
      triggerConfetti();
    });
  };

  const handleReset = () => {
    setActiveTrigger('none');
    setLogs([
      '[ORACLE RESET] Environmental telemetry restored to baseline.',
      '[EDGE NETWORK] Standing by for satellite anomaly triggers.'
    ]);
  };

  const addLogsSequentially = (logArray, onComplete) => {
    setLogs([]);
    let i = 0;
    const interval = setInterval(() => {
      if (i < logArray.length) {
        setLogs(prev => [...prev, logArray[i]]);
        i++;
      } else {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, 280); // Fast sub-second progression!
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log('Confetti:', e);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem', border: '1px solid rgba(6, 182, 212, 0.35)' }}>
      
      {/* Simulator Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: 'rgba(6, 182, 212, 0.2)', padding: '10px', borderRadius: '12px' }}>
            <Radio size={22} color="#22d3ee" className="pulsing-radar" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.2rem', color: '#fff', margin: 0 }}>
                Sub-Second Edge Oracle Simulator
              </h2>
              <span className="badge badge-cyan" style={{ fontSize: '0.68rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Zap size={12} color="#fbbf24" />
                Sub-Second Payout Engine (&lt;400ms)
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0 }}>
              Zero Land Title Required • Sub-second execution via 2G/3G Edge Cell Relays
            </p>
          </div>
        </div>

        {/* Action Trigger Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            className="btn-danger"
            onClick={handleSimulateDrought}
            disabled={isSimulating}
            style={{ fontSize: '0.8rem', padding: '0.55rem 1rem' }}
          >
            <Sun size={15} />
            Simulate Drought (&lt;12mm Rain)
          </button>

          <button
            className="btn-secondary"
            onClick={handleSimulateFlood}
            disabled={isSimulating}
            style={{ fontSize: '0.8rem', padding: '0.55rem 1rem', border: '1px solid rgba(245, 158, 11, 0.4)', color: '#fbbf24' }}
          >
            <CloudLightning size={15} color="#fbbf24" />
            Simulate Flood (&gt;150mm Rain)
          </button>

          <button
            className="btn-secondary"
            onClick={handleReset}
            disabled={isSimulating}
            style={{ fontSize: '0.8rem', padding: '0.55rem 0.85rem' }}
          >
            <RotateCcw size={15} />
            Reset Baseline
          </button>
        </div>
      </div>

      {/* Edge Latency Performance Meter Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(15, 23, 42, 0.8)', padding: '0.65rem 1rem', borderRadius: '8px', marginBottom: '0.75rem', border: '1px solid rgba(255,255,255,0.06)', fontSize: '0.78rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8' }}>
          <Cpu size={15} color="#34d399" />
          <span>Edge Network Node: <strong>Kitale Cell Tower Gateway #07</strong></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#22d3ee', fontWeight: 600 }}>
          <Clock size={14} />
          <span>Last Sub-Second Execution: <span style={{ color: '#34d399', fontFamily: 'var(--font-mono)' }}>{lastLatencyMs}ms</span></span>
        </div>
      </div>

      {/* Terminal Log Output */}
      <div style={{
        background: '#040711',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '10px',
        padding: '0.85rem 1rem',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.78rem',
        maxHeight: '150px',
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', marginBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.35rem' }}>
          <Terminal size={14} color="#06b6d4" />
          <span>Live Edge Execution Pipeline:</span>
        </div>

        {logs.map((log, index) => (
          <div 
            key={index} 
            style={{
              color: log.includes('SUB-SECOND') || log.includes('SUCCESS') ? '#34d399' : log.includes('BREACHED') || log.includes('ALERT') ? '#f43f5e' : log.includes('ZERO-PAPERWORK') ? '#22d3ee' : '#94a3b8',
              marginBottom: '0.2rem',
              lineHeight: 1.4
            }}
          >
            {log}
          </div>
        ))}
      </div>

    </div>
  );
}
