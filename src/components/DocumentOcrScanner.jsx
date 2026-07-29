import React, { useState } from 'react';
import { 
  Scan, 
  FileText, 
  CreditCard, 
  CheckCircle, 
  Sparkles, 
  Upload, 
  Camera, 
  X, 
  RefreshCw,
  Zap,
  ArrowRight,
  ShieldCheck,
  MapPin
} from 'lucide-react';

export default function DocumentOcrScanner({ isOpen, onClose, onOcrDataExtracted }) {
  const [activeTab, setActiveTab] = useState('land'); // 'land' or 'bank'
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scannedResult, setScannedResult] = useState(null);

  if (!isOpen) return null;

  // Preset Sample Document Scans for Demo
  const sampleLandDocs = [
    { title: 'Kitale Co-op Allotment Slip #482', owner: 'Amara Wanjiku', acreage: '4.2 Hectares', parcelId: 'KYA-POL-9482', crop: 'Hybrid Maize', boundary: '0.9821° N, 35.0029° E' },
    { title: 'Customary Tribal Lease Deed #109', owner: 'Amara Wanjiku', acreage: '6.5 Hectares', parcelId: 'ELD-LND-3301', crop: 'Hard Winter Wheat', boundary: '0.5143° N, 35.2698° E' }
  ];

  const sampleBankDocs = [
    { title: 'M-Pesa Mobile Money Statement', accountName: 'Amara Wanjiku', provider: 'Safaricom M-Pesa', phoneNo: '+254 712 345 678', nationalId: 'ID-28491029', status: 'KYC Verified' },
    { title: 'Equity Bank Micro-Passbook', accountName: 'Amara Wanjiku', provider: 'Equity Bank Kenya', accountNo: '1100-8849-2041', nationalId: 'ID-28491029', status: 'KYC Verified' }
  ];

  const handleStartScan = (docType) => {
    setIsScanning(true);
    setScanProgress(0);
    setScannedResult(null);

    // Simulate OCR Scanning animation over 1.8 seconds
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setScannedResult(docType === 'land' ? sampleLandDocs[0] : sampleBankDocs[0]);
          return 100;
        }
        return prev + 25;
      });
    }, 450);
  };

  const handleApplyExtractedData = () => {
    if (scannedResult) {
      onOcrDataExtracted(scannedResult, activeTab);
      onClose();
    }
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
      zIndex: 1200,
      padding: '1rem'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '680px',
        width: '100%',
        maxHeight: '92vh',
        overflowY: 'auto',
        padding: '2rem',
        border: '1px solid rgba(6, 182, 212, 0.35)',
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

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{ background: 'rgba(6, 182, 212, 0.2)', padding: '10px', borderRadius: '12px' }}>
            <Scan size={24} color="#22d3ee" className="pulsing-radar" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', color: '#fff', margin: 0 }}>
              AI Mobile OCR Document Scanner
            </h2>
            <p style={{ fontSize: '0.825rem', color: '#94a3b8', margin: 0 }}>
              Auto-Extract Land Details & Bank Account Info using Camera Scan
            </p>
          </div>
        </div>

        {/* Document Type Switcher Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.5rem',
          background: 'rgba(15, 23, 42, 0.8)',
          padding: '4px',
          borderRadius: '12px',
          marginBottom: '1.25rem',
          border: '1px solid rgba(255,255,255,0.08)'
        }}>
          <button
            onClick={() => { setActiveTab('land'); setScannedResult(null); }}
            style={{
              background: activeTab === 'land' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'transparent',
              color: activeTab === 'land' ? '#fff' : '#94a3b8',
              border: 'none',
              padding: '0.6rem',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem'
            }}
          >
            <FileText size={16} />
            Scan Land Allotment / Deed
          </button>

          <button
            onClick={() => { setActiveTab('bank'); setScannedResult(null); }}
            style={{
              background: activeTab === 'bank' ? 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)' : 'transparent',
              color: activeTab === 'bank' ? '#fff' : '#94a3b8',
              border: 'none',
              padding: '0.6rem',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem'
            }}
          >
            <CreditCard size={16} />
            Scan Bank / Mobile ID
          </button>
        </div>

        {/* Scanner Viewfinder Box */}
        <div style={{
          position: 'relative',
          height: '240px',
          background: '#040814',
          borderRadius: '14px',
          border: '2px dashed rgba(6, 182, 212, 0.4)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.25rem',
          padding: '1rem'
        }}>
          {isScanning ? (
            /* Animated OCR Scan Reticle */
            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              
              {/* Laser Scan Line */}
              <div style={{
                position: 'absolute',
                top: `${scanProgress}%`,
                left: 0,
                right: 0,
                height: '3px',
                background: '#22d3ee',
                boxShadow: '0 0 15px #22d3ee, 0 0 30px #22d3ee',
                transition: 'top 0.4s ease-out'
              }} />

              {/* Bounding Box Highlights */}
              <div style={{
                border: '2px solid #34d399',
                background: 'rgba(16, 185, 129, 0.1)',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                fontSize: '0.8rem',
                color: '#34d399',
                marginBottom: '1rem',
                fontFamily: 'var(--font-mono)'
              }}>
                [OCR ENGINE] Detecting Text Boundaries... {scanProgress}%
              </div>

              <RefreshCw size={32} color="#06b6d4" className="pulsing-radar" />
              <div style={{ fontSize: '0.85rem', color: '#e2e8f0', marginTop: '0.5rem', fontWeight: 600 }}>
                Extracting {activeTab === 'land' ? 'Land Parcel GPS & Acreage' : 'Account Details & KYC Info'}...
              </div>
            </div>
          ) : scannedResult ? (
            /* Scanned Result Card */
            <div style={{ width: '100%', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#34d399', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                <CheckCircle size={18} />
                <span>OCR Scanning Complete (Confidence: 99.2%)</span>
              </div>

              <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '10px', padding: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', fontSize: '0.8rem' }}>
                {activeTab === 'land' ? (
                  <>
                    <div><span style={{ color: '#94a3b8' }}>Doc Title:</span> <strong style={{ color: '#fff' }}>{scannedResult.title}</strong></div>
                    <div><span style={{ color: '#94a3b8' }}>Owner Name:</span> <strong style={{ color: '#34d399' }}>{scannedResult.owner}</strong></div>
                    <div><span style={{ color: '#94a3b8' }}>Scanned Acreage:</span> <strong style={{ color: '#22d3ee' }}>{scannedResult.acreage}</strong></div>
                    <div><span style={{ color: '#94a3b8' }}>Parcel Geo-ID:</span> <strong style={{ color: '#fff', fontFamily: 'var(--font-mono)' }}>{scannedResult.parcelId}</strong></div>
                    <div style={{ gridColumn: 'span 2' }}><span style={{ color: '#94a3b8' }}>Boundary Coordinates:</span> <strong style={{ color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>{scannedResult.boundary}</strong></div>
                  </>
                ) : (
                  <>
                    <div><span style={{ color: '#94a3b8' }}>Account Holder:</span> <strong style={{ color: '#fff' }}>{scannedResult.accountName}</strong></div>
                    <div><span style={{ color: '#94a3b8' }}>Financial Provider:</span> <strong style={{ color: '#22d3ee' }}>{scannedResult.provider}</strong></div>
                    <div><span style={{ color: '#94a3b8' }}>M-Pesa / Account #:</span> <strong style={{ color: '#34d399', fontFamily: 'var(--font-mono)' }}>{scannedResult.phoneNo || scannedResult.accountNo}</strong></div>
                    <div><span style={{ color: '#94a3b8' }}>National ID:</span> <strong style={{ color: '#fff', fontFamily: 'var(--font-mono)' }}>{scannedResult.nationalId}</strong></div>
                    <div style={{ gridColumn: 'span 2' }}><span style={{ color: '#94a3b8' }}>KYC Verification Status:</span> <strong style={{ color: '#34d399' }}>✅ Passed Anti-Fraud Check</strong></div>
                  </>
                )}
              </div>
            </div>
          ) : (
            /* Upload / Camera Prompt */
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem auto' }}>
                <Camera size={28} color="#06b6d4" />
              </div>
              <div style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600, marginBottom: '0.25rem' }}>
                Scan {activeTab === 'land' ? 'Land Certificate / Co-op Deed' : 'Bank Statement / M-Pesa ID'}
              </div>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', maxWidth: '360px', margin: '0 auto 1rem auto' }}>
                Position document in viewfinder or click below to simulate AI document extraction
              </p>
              
              <button
                className="btn-primary"
                onClick={() => handleStartScan(activeTab)}
                style={{ fontSize: '0.8rem', padding: '0.5rem 1.25rem' }}
              >
                <Sparkles size={16} />
                <span>Simulate Camera Document OCR</span>
              </button>
            </div>
          )}
        </div>

        {/* Action Button once OCR completes */}
        {scannedResult && (
          <button
            className="btn-primary"
            onClick={handleApplyExtractedData}
            style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', fontSize: '0.9rem' }}
          >
            <CheckCircle size={18} />
            <span>Auto-Fill Profile & Save Verified Document Data</span>
            <ArrowRight size={18} />
          </button>
        )}

      </div>
    </div>
  );
}
