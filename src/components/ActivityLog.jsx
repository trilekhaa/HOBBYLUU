import React from 'react';
import { Bot, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

const AGENT_COLORS = {
  'Satellite Agent':    { icon: '🛰️', accent: '#22d3ee' },
  'Actuary Agent':      { icon: '⚖️', accent: '#fbbf24' },
  'Underwriting Agent': { icon: '🛡️', accent: '#818cf8' },
  'Disbursement Agent': { icon: '⚡', accent: '#34d399' },
};

export default function ActivityLog({ events }) {
  return (
    <div className="glass-panel" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Bot size={18} color="#818cf8" />
          <h3 style={{ fontSize: '1rem', color: '#fff', margin: 0, fontFamily: 'var(--font-heading)', fontWeight: 700 }}>
            Unified Agent Activity Log
          </h3>
        </div>
        <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>{events.length} decisions</span>
      </div>

      {events.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '1.5rem', color: '#475569', fontSize: '0.8rem' }}>
          No agent activity yet — start by scanning a document or triggering an event.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '280px', overflowY: 'auto' }}>
          {events.map((ev, i) => {
            const meta = AGENT_COLORS[ev.agent] ?? { icon: '🤖', accent: '#94a3b8' };
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: '0.6rem',
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
                borderLeft: `3px solid ${meta.accent}`,
                borderRadius: '8px', padding: '0.55rem 0.75rem'
              }}>
                <span style={{ fontSize: '16px', flexShrink: 0 }}>{meta.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.15rem' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: meta.accent }}>{ev.agent}</span>
                    {ev.status === 'warn' && <AlertTriangle size={11} color="#fbbf24" />}
                    {ev.status === 'ok' && <CheckCircle size={11} color="#34d399" />}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#e2e8f0', lineHeight: 1.4 }}>{ev.action}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#475569', fontSize: '0.67rem', flexShrink: 0 }}>
                  <Clock size={10} />
                  {ev.timestamp}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
