import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Layers, 
  Droplets, 
  Activity, 
  Search,
  Globe,
  Radio,
  RefreshCw
} from 'lucide-react';
import { fetchWeatherByCoordinates } from '../services/weatherApi';

export default function FarmMap({ activeTrigger, currentCoordinates, onCoordinatesChange, liveWeatherData, setLiveWeatherData }) {
  const [selectedOverlay, setSelectedOverlay] = useState('ndvi');
  
  // Local Lat/Lon state for user inputs
  const [latInput, setLatInput] = useState(currentCoordinates?.lat?.toString() || '0.9821');
  const [lonInput, setLonInput] = useState(currentCoordinates?.lon?.toString() || '35.0029');
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);

  // Preset Lat/Lon Locations for quick testing
  const presets = [
    { name: 'Kitale Sector (High Yield)', lat: '0.9821', lon: '35.0029' },
    { name: 'Machakos (Drought Zone)', lat: '-1.5167', lon: '37.2667' },
    { name: 'Eldoret East (Maize Belt)', lat: '0.5143', lon: '35.2698' },
    { name: 'Garissa (Arid Semi-Desert)', lat: '-0.4532', lon: '39.6461' }
  ];

  const handleFetchWeather = async (lat, lon) => {
    setIsLoadingWeather(true);
    const result = await fetchWeatherByCoordinates(lat, lon);
    setLiveWeatherData(result);
    onCoordinatesChange({ lat: parseFloat(lat), lon: parseFloat(lon), locationName: `Lat ${lat}°, Lon ${lon}°` });
    setIsLoadingWeather(false);
  };

  const handleSelectPreset = (preset) => {
    setLatInput(preset.lat);
    setLonInput(preset.lon);
    handleFetchWeather(preset.lat, preset.lon);
  };

  // Dynamic values combining active trigger & fetched weather data
  const currentNdvi = activeTrigger === 'drought' ? 0.32 : activeTrigger === 'flood' ? 0.48 : (liveWeatherData?.ndvi || 0.78);
  const currentMoisture = activeTrigger === 'drought' ? '11%' : activeTrigger === 'flood' ? '96%' : `${liveWeatherData?.soilMoisture || 42}%`;
  const currentRain = activeTrigger === 'drought' ? 6.2 : activeTrigger === 'flood' ? 182.0 : (liveWeatherData?.rain21Day || 38.5);
  
  const healthStatus = currentNdvi < 0.4 ? 'Severe Crop Distress' : currentNdvi < 0.6 ? 'Moderate Growth' : 'Optimal Growth Canopy';
  const statusBadgeClass = currentNdvi < 0.4 ? 'badge-rose' : currentNdvi < 0.6 ? 'badge-amber' : 'badge-emerald';

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header with Title & Overlay Toggles */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={20} color="#34d399" />
            <h2 style={{ fontSize: '1.15rem', color: '#fff', margin: 0 }}>
              Plot #482 — Geo-Fenced Farm Polygon
            </h2>
          </div>
          <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '2px 0 0 1.6rem' }}>
            Coordinates: <strong>Lat: {currentCoordinates.lat}° N, Lon: {currentCoordinates.lon}° E</strong> • 4.2 Hectares
          </p>
        </div>

        {/* Layer Controls */}
        <div style={{ display: 'flex', gap: '0.35rem', background: 'rgba(0,0,0,0.3)', padding: '3px', borderRadius: '8px' }}>
          <button
            onClick={() => setSelectedOverlay('ndvi')}
            style={{
              background: selectedOverlay === 'ndvi' ? 'rgba(16, 185, 129, 0.25)' : 'transparent',
              color: selectedOverlay === 'ndvi' ? '#34d399' : '#94a3b8',
              border: selectedOverlay === 'ndvi' ? '1px solid rgba(16,185,129,0.4)' : '1px solid transparent',
              padding: '0.3rem 0.65rem',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            <Layers size={13} />
            NDVI Satellite Index
          </button>
          <button
            onClick={() => setSelectedOverlay('moisture')}
            style={{
              background: selectedOverlay === 'moisture' ? 'rgba(6, 182, 212, 0.25)' : 'transparent',
              color: selectedOverlay === 'moisture' ? '#22d3ee' : '#94a3b8',
              border: selectedOverlay === 'moisture' ? '1px solid rgba(6,182,212,0.4)' : '1px solid transparent',
              padding: '0.3rem 0.65rem',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            <Droplets size={13} />
            Soil Saturation Map
          </button>
        </div>
      </div>

      {/* Google Lat/Lon Input Control Panel */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.8)',
        border: '1px solid rgba(6, 182, 212, 0.3)',
        borderRadius: '10px',
        padding: '0.85rem',
        marginBottom: '1rem'
      }}>
        <div style={{ fontSize: '0.78rem', color: '#22d3ee', fontWeight: 600, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Globe size={15} color="#22d3ee" />
          <span>Google API Weather Location Selector (Input Latitude & Longitude):</span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Lat:</span>
            <input 
              type="text" 
              value={latInput} 
              onChange={(e) => setLatInput(e.target.value)}
              placeholder="e.g. 0.9821"
              style={{
                width: '90px',
                background: 'rgba(0,0,0,0.5)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#fff',
                padding: '0.35rem 0.5rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)'
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Lon:</span>
            <input 
              type="text" 
              value={lonInput} 
              onChange={(e) => setLonInput(e.target.value)}
              placeholder="e.g. 35.0029"
              style={{
                width: '90px',
                background: 'rgba(0,0,0,0.5)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#fff',
                padding: '0.35rem 0.5rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)'
              }}
            />
          </div>

          <button
            className="btn-primary"
            onClick={() => handleFetchWeather(latInput, lonInput)}
            disabled={isLoadingWeather}
            style={{ padding: '0.35rem 0.85rem', fontSize: '0.75rem' }}
          >
            {isLoadingWeather ? <RefreshCw size={13} className="pulsing-radar" /> : <Search size={13} />}
            <span>Fetch Google Satellite Telemetry</span>
          </button>
        </div>

        {/* Quick Location Presets */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Quick Presets:</span>
          {presets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectPreset(preset)}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#e2e8f0',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                fontSize: '0.68rem',
                cursor: 'pointer'
              }}
            >
              📍 {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Simulated Map Container with Satellite Canvas Visualizer */}
      <div className="radar-sweep" style={{
        position: 'relative',
        height: '280px',
        width: '100%',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        background: 'radial-gradient(circle at 50% 50%, #15233e 0%, #0b1329 100%)',
        backgroundImage: `
          radial-gradient(circle at 50% 50%, rgba(16, 185, 129, ${selectedOverlay === 'ndvi' ? (activeTrigger === 'drought' ? '0.1' : '0.25') : '0.05'}) 0%, transparent 60%),
          linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '100% 100%, 24px 24px, 24px 24px'
      }}>
        
        {/* Farm Boundary Polygon Overlay */}
        <svg style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}>
          <defs>
            <linearGradient id="ndviGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={currentNdvi < 0.4 ? '#f43f5e' : currentNdvi < 0.6 ? '#f59e0b' : '#10b981'} stopOpacity="0.45" />
              <stop offset="100%" stopColor={currentNdvi < 0.4 ? '#9f1239' : currentNdvi < 0.6 ? '#b45309' : '#059669'} stopOpacity="0.25" />
            </linearGradient>
          </defs>

          {/* Polygon Path representing Farm Plot */}
          <polygon 
            points="90,50 380,30 450,200 280,260 70,200" 
            fill="url(#ndviGradient)"
            stroke={currentNdvi < 0.4 ? '#f43f5e' : currentNdvi < 0.6 ? '#fbbf24' : '#34d399'} 
            strokeWidth="2.5"
            strokeDasharray="6 3"
          />

          {/* Geo-markers */}
          <circle cx="230" cy="140" r="6" fill="#34d399" />
          <circle cx="230" cy="140" r="14" fill="none" stroke="#34d399" strokeWidth="1.5" style={{ animation: 'pulseGlow 2s infinite' }} />

          {/* Text Labels inside map */}
          <text x="245" y="135" fill="#f8fafc" fontSize="12" fontWeight="600" fontFamily="var(--font-heading)">
            Google Earth Engine GIS Node
          </text>
          <text x="245" y="152" fill="#34d399" fontSize="11" fontFamily="var(--font-mono)">
            Lat: {currentCoordinates.lat}° N, Lon: {currentCoordinates.lon}° E
          </text>
        </svg>

        {/* Floating Satellite Status Badge */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.15)',
          padding: '0.4rem 0.85rem',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.75rem'
        }}>
          <Radio size={14} color="#06b6d4" className="pulsing-radar" />
          <span style={{ color: '#e2e8f0', fontWeight: 500 }}>
            Source: <strong>Google Earth Engine Telemetry</strong>
          </span>
        </div>

        {/* Live Map Legend */}
        <div style={{
          position: 'absolute',
          bottom: '12px',
          right: '12px',
          background: 'rgba(15, 23, 42, 0.88)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.15)',
          padding: '0.5rem 0.85rem',
          borderRadius: '8px',
          fontSize: '0.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
            <span style={{ color: '#94a3b8' }}>Crop Health Status:</span>
            <span className={`badge ${statusBadgeClass}`}>{healthStatus}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
            <span style={{ color: '#94a3b8' }}>Soil Saturation:</span>
            <span style={{ color: '#38bdf8', fontWeight: 600 }}>{currentMoisture}</span>
          </div>
        </div>

      </div>

      {/* NDVI Index Visual Bar below map */}
      <div style={{ marginTop: '1rem', background: 'rgba(255,255,255,0.03)', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Activity size={14} color="#34d399" />
            Vegetation Index (NDVI Metric):
          </span>
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: currentNdvi < 0.4 ? '#f43f5e' : '#34d399', fontFamily: 'var(--font-mono)' }}>
            {typeof currentNdvi === 'number' ? currentNdvi.toFixed(2) : currentNdvi} / 1.00
          </span>
        </div>
        
        {/* Color Gradient Bar */}
        <div style={{ height: '8px', width: '100%', background: 'linear-gradient(90deg, #f43f5e 0%, #fbbf24 40%, #10b981 80%, #047857 100%)', borderRadius: '4px', position: 'relative' }}>
          <div style={{
            position: 'absolute',
            left: `${(typeof currentNdvi === 'number' ? currentNdvi : 0.78) * 100}%`,
            top: '-4px',
            transform: 'translateX(-50%)',
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            background: '#ffffff',
            border: '2px solid #0f172a',
            boxShadow: '0 0 10px rgba(255,255,255,0.8)',
            transition: 'left 0.5s ease-in-out'
          }} />
        </div>
      </div>

    </div>
  );
}
