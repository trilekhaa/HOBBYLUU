import React from 'react';
import { 
  Building2, 
  TrendingUp, 
  ShieldAlert, 
  Users, 
  CheckCircle, 
  DollarSign, 
  MapPin, 
  PieChart as PieChartIcon, 
  BarChart3, 
  Award,
  Globe,
  Radio
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function InsurerDashboard() {
  
  // Chart Data: Portfolio Credit Disbursement & Parametric Claims Over Time
  const performanceData = [
    { month: 'Jan', microloans: 420, claimsPaid: 12 },
    { month: 'Feb', microloans: 580, claimsPaid: 18 },
    { month: 'Mar', microloans: 890, claimsPaid: 45 },
    { month: 'Apr', microloans: 1240, claimsPaid: 22 },
    { month: 'May', microloans: 1680, claimsPaid: 110 }, // Rainy season flood claim
    { month: 'Jun', microloans: 2100, claimsPaid: 35 },
    { month: 'Jul', microloans: 2650, claimsPaid: 85 }
  ];

  const regionalRisk = [
    { region: 'Rift Valley / Kitale', crop: 'Maize & Beans', farmers: 5840, riskScore: 'Low (0.24)', status: 'Healthy', payoutRatio: '2.1%' },
    { region: 'Eastern / Machakos', crop: 'Sorghum & Millet', farmers: 3410, riskScore: 'Elevated (0.68)', status: 'Drought Watch', payoutRatio: '14.8%' },
    { region: 'Western / Bungoma', crop: 'Sugarcane & Maize', farmers: 2950, riskScore: 'Low (0.18)', status: 'Optimal', payoutRatio: '1.2%' },
    { region: 'Central / Nyeri', crop: 'Coffee & Tea', farmers: 2000, riskScore: 'Medium (0.42)', status: 'Normal', payoutRatio: '4.5%' }
  ];

  const impactStats = [
    { label: 'Avg Approval Time', value: '< 2 min', sub: 'vs 14-day traditional bank', color: '#34d399', icon: '⚡' },
    { label: 'Auto-Paid Claims %', value: '100%',   sub: 'zero manual claims filed', color: '#22d3ee', icon: '🤖' },
    { label: 'Avg Payout Speed',   value: '328ms',  sub: 'sub-second via Edge relay', color: '#fbbf24', icon: '🚀' },
    { label: 'Fraud Flags Raised', value: '14',     sub: 'out of 14,200 farmers (0.1%)', color: '#f43f5e', icon: '🚩' },
  ];

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1.5rem 0' }}>

      {/* ── Agent Automation Impact Dashboard ── */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem', borderLeft: '4px solid #818cf8' }}>
        <div style={{ fontSize: '0.7rem', color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem', fontWeight: 700 }}>
          🤖 Agent Automation — Aggregate Impact Dashboard
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          {impactStats.map((s, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${s.color}22`, borderRadius: '12px', padding: '0.85rem 1rem' }}>
              <div style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{s.icon}</div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#e2e8f0', marginTop: '0.15rem' }}>{s.label}</div>
              <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '0.15rem' }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem', borderLeft: '4px solid #6366f1' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Building2 size={24} color="#818cf8" />
              <h2 style={{ fontSize: '1.4rem', color: '#fff', margin: 0 }}>
                Agro Finance Capital — Insurer & Lender Underwriting Hub
              </h2>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '4px 0 0 0' }}>
              Institutional Liquidity Pool • Satellite Risk Telemetry • ESG Impact Dashboard
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <div className="badge badge-cyan" style={{ padding: '0.5rem 1rem' }}>
              <Radio size={14} className="pulsing-radar" />
              14,200 Farmers Monitored
            </div>
            <div className="badge badge-emerald" style={{ padding: '0.5rem 1rem' }}>
              Solvency Ratio: 242%
            </div>
          </div>
        </div>
      </div>

      {/* Top Level Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
        
        {/* Card 1: Active Loan Book */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
            <span>Active Microcredit Book</span>
            <DollarSign size={18} color="#34d399" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-heading)' }}>
            $4,850,200
          </div>
          <div style={{ fontSize: '0.75rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.4rem' }}>
            <TrendingUp size={14} />
            +18.4% growth this quarter
          </div>
        </div>

        {/* Card 2: Microcredit Default Rate */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
            <span>Loan Default Rate (NPL)</span>
            <CheckCircle size={18} color="#34d399" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399', fontFamily: 'var(--font-heading)' }}>
            1.42%
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.4rem' }}>
            vs 14.5% Traditional Unbanked Avg
          </div>
        </div>

        {/* Card 3: Parametric Claims Disbursed */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
            <span>Auto Parametric Claims Disbursed</span>
            <ShieldAlert size={18} color="#22d3ee" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#22d3ee', fontFamily: 'var(--font-heading)' }}>
            $312,400
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.4rem' }}>
            100% Instant Mobile Disbursements
          </div>
        </div>

        {/* Card 4: Unbanked Inclusion Rate */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
            <span>Previously Unbanked Smallholders</span>
            <Users size={18} color="#fbbf24" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fbbf24', fontFamily: 'var(--font-heading)' }}>
            89.6%
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.4rem' }}>
            First-time credit & insurance users
          </div>
        </div>

      </div>

      {/* Grid Row: Chart & Regional Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        
        {/* Chart Card */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.05rem', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BarChart3 size={18} color="#818cf8" />
              Microcredit Disbursement Volume vs Parametric Payouts ($K)
            </h3>
          </div>

          <div style={{ height: '280px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorCredit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorClaims" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="microloans" name="Microcredit ($K)" stroke="#10b981" fillOpacity={1} fill="url(#colorCredit)" />
                <Area type="monotone" dataKey="claimsPaid" name="Parametric Payouts ($K)" stroke="#06b6d4" fillOpacity={1} fill="url(#colorClaims)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ESG Social Impact Card */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.05rem', color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={18} color="#fbbf24" />
            ESG Social Impact Metrics
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, justifyContent: 'center' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.85rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Women Farmer Inclusion Rate</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#34d399' }}>54.2% Female Farmers</div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.85rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Climate Smart Input Adoption</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#22d3ee' }}>78% Organic Fertilizer Vouchers</div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.85rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Average Farmer Income Uplift</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fbbf24' }}>+34.8% Crop Yield Margin</div>
            </div>
          </div>
        </div>

      </div>

      {/* Regional Risk & Underwriting Table */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.05rem', color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MapPin size={18} color="#34d399" />
          Regional Risk Underwriting & Satellite Cluster Analytics
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}>
                <th style={{ padding: '0.75rem' }}>Agricultural Region</th>
                <th style={{ padding: '0.75rem' }}>Primary Crops</th>
                <th style={{ padding: '0.75rem' }}>Onboarded Farmers</th>
                <th style={{ padding: '0.75rem' }}>Satellite Risk Index</th>
                <th style={{ padding: '0.75rem' }}>Status</th>
                <th style={{ padding: '0.75rem' }}>Parametric Claims Ratio</th>
              </tr>
            </thead>
            <tbody>
              {regionalRisk.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 600, color: '#fff' }}>{row.region}</td>
                  <td style={{ padding: '0.75rem', color: '#94a3b8' }}>{row.crop}</td>
                  <td style={{ padding: '0.75rem', color: '#e2e8f0' }}>{row.farmers.toLocaleString()}</td>
                  <td style={{ padding: '0.75rem', color: '#22d3ee', fontFamily: 'var(--font-mono)' }}>{row.riskScore}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <span className={`badge ${row.status === 'Drought Watch' ? 'badge-rose' : 'badge-emerald'}`}>
                      {row.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem', fontWeight: 600, color: '#fff' }}>{row.payoutRatio}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
