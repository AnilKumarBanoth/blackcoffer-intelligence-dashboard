import { useEffect, useState } from 'react';
import { Filter, X, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { fetchFilters } from '../services/api';

const FILTER_DEFS = [
  { key: 'end_year',    label: 'End Year',  dataKey: 'end_years' },
  { key: 'start_year',  label: 'Start Year',dataKey: 'start_years' },
  { key: 'sector',      label: 'Sector',    dataKey: 'sectors' },
  { key: 'topic',       label: 'Topic',     dataKey: 'topics' },
  { key: 'region',      label: 'Region',    dataKey: 'regions' },
  { key: 'country',     label: 'Country',   dataKey: 'countries' },
  { key: 'pestle',      label: 'PEST',      dataKey: 'pestles' },
  { key: 'source',      label: 'Source',    dataKey: 'sources' },
  { key: 'swot',        label: 'SWOT',      dataKey: 'swots' },
  { key: 'city',        label: 'City',      dataKey: 'cities' },
];

export default function FilterBar({ filters, onFilterChange, onReset }) {
  const [options, setOptions] = useState({});
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    fetchFilters().then(setOptions).catch(console.error);
  }, []);

  const activeFilters = Object.entries(filters).filter(([, v]) => v && v !== 'all');

  return (
    <div className="filter-section">
      <div className="filter-header" onClick={() => setCollapsed(c => !c)}>
        <div className="filter-title">
          <Filter size={16} />
          <span>Filters & Controls</span>
          {activeFilters.length > 0 && (
            <span style={{
              background: 'var(--accent-primary)', color: 'white',
              borderRadius: '99px', padding: '0 6px', fontSize: '0.7rem', fontWeight: 700
            }}>{activeFilters.length}</span>
          )}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {activeFilters.length > 0 && (
            <button className="btn btn-ghost" onClick={e => { e.stopPropagation(); onReset(); }} style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
              <RotateCcw size={12} /> Reset
            </button>
          )}
          {collapsed ? <ChevronDown size={16} color="var(--text-muted)" /> : <ChevronUp size={16} color="var(--text-muted)" />}
        </div>
      </div>

      {!collapsed && (
        <>
          <div className="filter-grid">
            {FILTER_DEFS.map(({ key, label, dataKey }) => {
              const opts = options[dataKey] || [];
              return (
                <div className="filter-group" key={key}>
                  <label className="filter-label" htmlFor={`filter-${key}`}>{label}</label>
                  <select
                    id={`filter-${key}`}
                    className="filter-select"
                    value={filters[key] || 'all'}
                    onChange={e => onFilterChange(key, e.target.value === 'all' ? '' : e.target.value)}
                  >
                    <option value="all">All {label}s</option>
                    {opts.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              );
            })}
          </div>

          {/* Active filter pills */}
          {activeFilters.length > 0 && (
            <div className="filter-active-pills">
              {activeFilters.map(([key, val]) => (
                <button
                  key={key}
                  className="filter-pill"
                  onClick={() => onFilterChange(key, '')}
                  title={`Remove ${key} filter`}
                >
                  <span style={{ textTransform: 'capitalize', marginRight: '2px' }}>{key.replace('_', ' ')}:</span>
                  <strong>{val}</strong>
                  <X size={10} />
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
