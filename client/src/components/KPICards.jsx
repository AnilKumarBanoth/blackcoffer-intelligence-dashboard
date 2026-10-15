import { useEffect, useState } from 'react';
import { Activity, Zap, Target, TrendingUp, BarChart2, Layers } from 'lucide-react';
import { fetchSummary } from '../services/api';

const KPI_CONFIG = [
  { key: 'total',        label: 'Total Records',       icon: Layers,    cls: 'kpi-card-1', iconCls: 'kpi-icon-1', color: '#6C63FF', format: v => v.toLocaleString() },
  { key: 'avgIntensity', label: 'Avg Intensity',       icon: Zap,       cls: 'kpi-card-2', iconCls: 'kpi-icon-2', color: '#FF6B9D', format: v => v.toFixed(1) },
  { key: 'avgLikelihood',label: 'Avg Likelihood',      icon: TrendingUp,cls: 'kpi-card-3', iconCls: 'kpi-icon-3', color: '#00D4AA', format: v => v.toFixed(1) },
  { key: 'avgRelevance', label: 'Avg Relevance',       icon: Target,    cls: 'kpi-card-4', iconCls: 'kpi-icon-4', color: '#FFB800', format: v => v.toFixed(1) },
  { key: 'topSectors',   label: 'Top Sector',          icon: BarChart2, cls: 'kpi-card-5', iconCls: 'kpi-icon-5', color: '#4FACFE', format: v => (v && v.length ? v[0]._id || '—' : '—') },
  { key: 'topRegions',   label: 'Top Region',          icon: Activity,  cls: 'kpi-card-6', iconCls: 'kpi-icon-6', color: '#FF4D6D', format: v => (v && v.length ? v[0]._id || '—' : '—') },
];

export default function KPICards() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchSummary().then(setData).catch(console.error);
  }, []);

  return (
    <div className="kpi-grid">
      {KPI_CONFIG.map(({ key, label, icon: Icon, cls, iconCls, color, format }) => {
        const rawVal = data ? data[key] : null;
        const formatted = rawVal !== null && rawVal !== undefined ? format(rawVal) : '—';

        return (
          <div key={key} className={`kpi-card ${cls}`}>
            <div className={`kpi-icon ${iconCls}`}>
              <Icon size={20} color={color} />
            </div>
            <div className="kpi-value" style={{ color }}>
              {data ? formatted : <span className="animate-pulse" style={{ color: 'var(--border)' }}>—</span>}
            </div>
            <div className="kpi-label">{label}</div>
            {key === 'total' && data && (
              <div className="kpi-trend trend-up">↑ Live data</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
