import React, { useState, useEffect, useCallback } from 'react';
import Login from './components/Login';
import Navbar from './components/Navbar';
import FarmMap from './components/FarmMap';
import InsuranceShield from './components/InsuranceShield';
import OracleSimulator from './components/OracleSimulator';
import CreditModal from './components/CreditModal';
import InsurerDashboard from './components/InsurerDashboard';
import Calculator from './components/Calculator';
import OfflineDrawer from './components/OfflineDrawer';
import DocumentOcrScanner from './components/DocumentOcrScanner';
// ── 4 Agent Panels ──
import SatelliteAgentPanel from './components/SatelliteAgentPanel';
import ActuaryAgentPanel from './components/ActuaryAgentPanel';
import UnderwritingAgentPanel from './components/UnderwritingAgentPanel';
import DisbursementAgentPanel from './components/DisbursementAgentPanel';
import ActivityLog from './components/ActivityLog';

import { fetchWeatherByCoordinates } from './services/weatherApi';
import { 
  History, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Sparkles,
  Zap,
  Radio,
  Scan,
  FileCheck,
  Bot
} from 'lucide-react';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  
  const [currentRole, setCurrentRole] = useState('farmer');
  const [walletBalance, setWalletBalance] = useState(350.00);
  const [activeTrigger, setActiveTrigger] = useState('none');

  // Google API coords
  const [coordinates, setCoordinates] = useState({ lat: 0.9821, lon: 35.0029, locationName: 'Kitale Sector 4 (Kenya)' });
  const [liveWeatherData, setLiveWeatherData] = useState({ temp: 28.5, rain21Day: 38.5, soilMoisture: 42, ndvi: 0.78, source: 'Google Earth Engine & Open-Meteo Telemetry' });

  // OCR
  const [extractedOcrDoc, setExtractedOcrDoc] = useState(null);

  // ── Unified Agent Activity Log ──
  const [agentEvents, setAgentEvents] = useState([]);
  const addAgentEvent = useCallback((evt) => {
    setAgentEvents(prev => [evt, ...prev].slice(0, 50));
  }, []);

  // Last payout for DisbursementAgent (track object so effect fires on each new payout)
  const [lastPayout, setLastPayout] = useState(null);

  // Modals
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const [creditModalAmount, setCreditModalAmount] = useState(450);
  const [isOfflineDrawerOpen, setIsOfflineDrawerOpen] = useState(false);
  const [isOcrScannerOpen, setIsOcrScannerOpen] = useState(false);

  // Fetch weather on mount
  useEffect(() => {
    fetchWeatherByCoordinates(coordinates.lat, coordinates.lon).then(setLiveWeatherData);
  }, []);

  // ── Audit Ledger ──
  const [auditLog, setAuditLog] = useState([
    { id: 'TX-9901', title: 'Season Start Microcredit Line Pre-Approval', amount: 1200, type: 'credit_limit', date: '2026-07-01', hash: '0x3f...82a', latencyMs: 310 },
    { id: 'TX-9842', title: 'Kitale Agrovets Certified Seeds Voucher',     amount: -150, type: 'debit',        date: '2026-07-10', hash: '0x9d...110', latencyMs: 195 },
    { id: 'TX-9720', title: 'Parametric Insurance Premium (50% Subsidized)', amount: -18, type: 'debit',       date: '2026-07-12', hash: '0x44...c81', latencyMs: 240 },
  ]);

  const handleOcrDataExtracted = (result, docType) => {
    setExtractedOcrDoc({ data: result, type: docType });
    setAuditLog(prev => [{ id: `TX-${Math.floor(1000+Math.random()*9000)}`, title: `📄 AI OCR Verified: ${result.title||result.provider}`, amount: 0, type: 'ocr_verify', date: new Date().toISOString().split('T')[0], hash: `0x${Math.random().toString(16).substring(2,8)}...ocr`, latencyMs: 180 }, ...prev]);
    addAgentEvent({ agent: 'Satellite Agent', action: `OCR document verified — ${result.title || result.provider}`, timestamp: new Date().toLocaleTimeString(), status: 'ok' });
  };

  const handleApplyLoan = (amount, disbursementType, latencyMs = 340) => {
    setWalletBalance(prev => prev + amount);
    setAuditLog(prev => [{ id: `TX-${Math.floor(1000+Math.random()*9000)}`, title: disbursementType === 'voucher' ? `Agri-Input Voucher Disbursed ($${amount})` : `Mobile Cash Loan Disbursed ($${amount})`, amount, type: 'credit', date: new Date().toISOString().split('T')[0], hash: `0x${Math.random().toString(16).substring(2,8)}...${Math.random().toString(16).substring(2,5)}`, latencyMs }, ...prev]);
    setLastPayout({ id: Date.now(), amount, reason: 'Microcredit Disbursement', type: 'loan', interestRate: 4.2 });
  };

  const handleOraclePayout = (amount, reason, latencyMs = 328) => {
    setWalletBalance(prev => prev + amount);
    setAuditLog(prev => [{ id: `TX-${Math.floor(1000+Math.random()*9000)}`, title: `⚡ Sub-Second Auto-Payout: ${reason}`, amount, type: 'insurance_payout', date: new Date().toISOString().split('T')[0], hash: `0x${Math.random().toString(16).substring(2,8)}...${Math.random().toString(16).substring(2,5)}`, latencyMs }, ...prev]);
    setLastPayout({ id: Date.now(), amount, reason });
    addAgentEvent({ agent: 'Disbursement Agent', action: `$${amount} payout queued for "${reason}" — routing via Edge M-Pesa`, timestamp: new Date().toLocaleTimeString(), status: 'ok' });
  };

  const handleLogin = (email) => {
    setUserEmail(email);
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar 

        currentRole={currentRole} setCurrentRole={setCurrentRole}
        walletBalance={walletBalance} creditLine={1200}
        openOfflineDrawer={() => setIsOfflineDrawerOpen(true)}
        openOcrScanner={() => setIsOcrScannerOpen(true)}
        activeTriggerAlert={activeTrigger !== 'none' || liveWeatherData.rain21Day < 12.0}
      />

      <main style={{ maxWidth: '1400px', width: '100%', margin: '0 auto', padding: '1.5rem', flex: 1 }}>
        {currentRole === 'farmer' ? (
          <>
            {/* ── Onboarding: OCR Status ── */}
            <div className="callout-banner" style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ background: 'rgba(16,185,129,0.2)', padding: '8px', borderRadius: '10px' }}>
                  <Scan size={20} color="#34d399" />
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    AI Mobile OCR Scanner
                    {extractedOcrDoc ? <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>Verified</span> : <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>Ready</span>}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                    {extractedOcrDoc ? <span>Extracted: <strong>{extractedOcrDoc.data.title||extractedOcrDoc.data.provider}</strong> ({extractedOcrDoc.data.acreage||extractedOcrDoc.data.phoneNo})</span> : <span>Scan land deeds or bank / M-Pesa IDs with camera OCR</span>}
                  </div>
                </div>
              </div>
              <button className="btn-secondary btn-sm" onClick={() => setIsOcrScannerOpen(true)} style={{ border: '1px solid #22d3ee', color: '#22d3ee' }}>
                <Scan size={14} /><span>Scan Document</span>
              </button>
            </div>

            {/* ── Core: Farm Map & Insurance Shield ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <FarmMap activeTrigger={activeTrigger} currentCoordinates={coordinates} onCoordinatesChange={setCoordinates} liveWeatherData={liveWeatherData} setLiveWeatherData={setLiveWeatherData} />
              <InsuranceShield activeTrigger={activeTrigger} onSimulatePayoutTrigger={handleOraclePayout} liveWeatherData={liveWeatherData} />
            </div>

            {/* ── Microcredit CTA ── */}
            <div className="glass-panel accent-left accent-left--emerald" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pre-Approved Microcredit Line</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-heading)' }}>
                  $1,200.00 Available <span style={{ fontSize: '0.85rem', color: '#34d399', fontWeight: 600 }}>(Tier A+ Score: 748)</span>
                </div>
              </div>
              <button className="btn-primary" onClick={() => { setCreditModalAmount(450); setIsCreditModalOpen(true); }}>
                <Sparkles size={18} /><span>Request Microcredit</span>
              </button>
            </div>

            {/* ── Demo: Oracle Simulator ── */}
            <OracleSimulator activeTrigger={activeTrigger} setActiveTrigger={setActiveTrigger} onOraclePayout={handleOraclePayout} />

            {/* ── Agent Panels ── */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                <Bot size={18} color="#818cf8" />
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', color: '#fff', margin: 0, fontWeight: 700 }}>Live Agent Activity</h2>
                <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>4 agents</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
                <SatelliteAgentPanel liveWeatherData={liveWeatherData} activeTrigger={activeTrigger} onAgentEvent={addAgentEvent} />
                <ActuaryAgentPanel liveWeatherData={liveWeatherData} activeTrigger={activeTrigger} onAgentEvent={addAgentEvent} />
                <UnderwritingAgentPanel liveWeatherData={liveWeatherData} activeTrigger={activeTrigger} extractedOcrDoc={extractedOcrDoc} onAgentEvent={addAgentEvent} />
                <DisbursementAgentPanel lastPayout={lastPayout} walletBalance={walletBalance} activeTrigger={activeTrigger} onAgentEvent={addAgentEvent} />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <ActivityLog events={agentEvents} />
            </div>

            {/* ── Calculator ── */}
            <Calculator onApplyWithEstimate={(amount) => { setCreditModalAmount(amount); setIsCreditModalOpen(true); }} />

            {/* ── Wallet Ledger ── */}
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.05rem', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <History size={18} color="#34d399" />Digital Wallet Ledger & OCR Verified History
                </h3>
                <span className="badge badge-emerald">Sub-Second Verified Ledger</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {auditLog.map(tx => (
                  <div key={tx.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ background: tx.type === 'insurance_payout' ? 'rgba(6,182,212,0.2)' : tx.type === 'ocr_verify' ? 'rgba(99,102,241,0.2)' : tx.amount > 0 ? 'rgba(16,185,129,0.2)' : 'rgba(244,63,94,0.15)', padding: '8px', borderRadius: '8px' }}>
                        {tx.type === 'ocr_verify' ? <FileCheck size={16} color="#818cf8" /> : tx.amount > 0 ? <ArrowDownLeft size={16} color="#34d399" /> : <ArrowUpRight size={16} color="#f43f5e" />}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>{tx.title}</div>
                        <div style={{ fontSize: '0.725rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>ID: {tx.id} • Hash: {tx.hash} • Date: {tx.date}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1rem', fontWeight: 700, color: tx.type === 'ocr_verify' ? '#818cf8' : tx.amount > 0 ? '#34d399' : '#f43f5e', fontFamily: 'var(--font-heading)' }}>
                        {tx.type === 'ocr_verify' ? 'Verified' : tx.amount > 0 ? `+ $${tx.amount.toFixed(2)}` : `- $${Math.abs(tx.amount).toFixed(2)}`}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#22d3ee', fontFamily: 'var(--font-mono)' }}>⚡ {tx.latencyMs||320}ms Edge Relay</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <InsurerDashboard />
        )}
      </main>

      {/* Modals */}
      <DocumentOcrScanner isOpen={isOcrScannerOpen} onClose={() => setIsOcrScannerOpen(false)} onOcrDataExtracted={handleOcrDataExtracted} />
      <CreditModal isOpen={isCreditModalOpen} onClose={() => setIsCreditModalOpen(false)} onApplyLoan={handleApplyLoan} currentWalletBalance={walletBalance} />
      <OfflineDrawer isOpen={isOfflineDrawerOpen} onClose={() => setIsOfflineDrawerOpen(false)} walletBalance={walletBalance} />

      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '1.5rem', textAlign: 'center', fontSize: '0.78rem', color: '#64748b' }}>
        Agro Finance Web App Prototype • AI Mobile OCR Document Scanner • Google API Weather Telemetry • Sub-Second Parametric Insurance
      </footer>
    </div>
  );
}
