import { useEffect, useState } from 'react';
import { fetchHealth, triggerSeed } from '../services/api';
import { Sun, Moon, RefreshCw, Download, BarChart3 } from 'lucide-react';

export default function Header({ theme, setTheme, summary }) {
  const [health, setHealth] = useState(null);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    fetchHealth().then(setHealth).catch(() => setHealth({ status: 'offline' }));
  }, []);

  const handleSeed = async () => {
    setSeeding(true);
    try {
      await triggerSeed();
      window.location.reload();
    } catch(e) { console.error(e); }
    finally { setSeeding(false); }
  };

  const exportCSV = () => {
    if (!summary) return;
    const blob = new Blob([JSON.stringify(summary, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'blackcoffer-summary.json';
    a.click();
  };

  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-brand">
          <div className="brand-logo">BC</div>
          <div>
            <div className="brand-title">Blackcoffer Intelligence</div>
            <div className="brand-subtitle">Data Visualization Dashboard</div>
          </div>
        </div>

        <div className="header-stats">
          <div className="header-stat">
            <div className="header-stat-value">{summary?.total?.toLocaleString() ?? '—'}</div>
            <div className="header-stat-label">Records</div>
          </div>
          <div style={{ width: 1, height: 32, background: 'var(--border)' }} />
          <div className="header-stat">
            <div className="header-stat-value">{summary?.avgIntensity ?? '—'}</div>
            <div className="header-stat-label">Avg Intensity</div>
          </div>
          <div style={{ width: 1, height: 32, background: 'var(--border)' }} />
          <div className="header-stat">
            <div className="header-stat-value">{summary?.avgLikelihood ?? '—'}</div>
            <div className="header-stat-label">Avg Likelihood</div>
          </div>
          <div style={{ width: 1, height: 32, background: 'var(--border)' }} />
          <div className="header-stat">
            <div className="header-stat-value">{summary?.avgRelevance ?? '—'}</div>
            <div className="header-stat-label">Avg Relevance</div>
          </div>
        </div>

        <div className="header-actions">
          {health && (
            <span className={`header-mode-badge ${health.mode === 'memory' ? 'mode-memory' : 'mode-mongodb'}`}>
              {health.mode === 'memory' ? '● Memory' : '● MongoDB'}
            </span>
          )}
          <button className="btn btn-ghost btn-icon" onClick={handleSeed} disabled={seeding} title="Re-seed database">
            <RefreshCw size={16} className={seeding ? 'animate-pulse' : ''} />
          </button>
          <button className="btn btn-ghost btn-icon" onClick={exportCSV} title="Export summary">
            <Download size={16} />
          </button>
          <button
            className="btn btn-ghost btn-icon"
            onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>
    </header>
  );
}
