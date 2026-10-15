import { useEffect, useState, useCallback } from 'react';
import { ChevronUp, ChevronDown, Search, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { fetchData } from '../services/api';
import InsightModal from './InsightModal';

const COLUMNS = [
  { key: 'title',     label: 'Title',     width: '220px' },
  { key: 'sector',    label: 'Sector',    width: '120px', badge: 'tag-sector' },
  { key: 'topic',     label: 'Topic',     width: '130px', badge: 'tag-topic' },
  { key: 'pestle',    label: 'PESTLE',    width: '110px', badge: 'tag-pestle' },
  { key: 'region',    label: 'Region',    width: '150px', badge: 'tag-region' },
  { key: 'country',   label: 'Country',   width: '120px' },
  { key: 'intensity', label: 'Intensity', width: '90px',  numeric: true },
  { key: 'likelihood',label: 'Likelihood',width: '100px', numeric: true },
  { key: 'relevance', label: 'Relevance', width: '100px', numeric: true },
  { key: 'end_year',  label: 'Year',      width: '75px' },
];

const MetricBadge = ({ value, cls }) => (
  <span className={`metric-badge ${cls}`}>{value || '—'}</span>
);

export default function DataTable({ filters }) {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('intensity');
  const [sortDir, setSortDir] = useState('desc');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const LIMIT = 15;

  const loadData = useCallback(() => {
    setLoading(true);
    fetchData({ ...filters, search }, page, LIMIT)
      .then(res => { setRows(res.data); setTotal(res.total); setTotalPages(res.pages); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filters, page, search]);

  useEffect(() => { setPage(1); }, [filters]);
  useEffect(() => { loadData(); }, [loadData]);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  // Client-side sort on current page
  const sortedRows = [...rows].sort((a, b) => {
    const av = a[sortKey], bv = b[sortKey];
    if (typeof av === 'number') return sortDir === 'asc' ? av - bv : bv - av;
    return sortDir === 'asc'
      ? String(av || '').localeCompare(String(bv || ''))
      : String(bv || '').localeCompare(String(av || ''));
  });

  const exportCSV = () => {
    const headers = COLUMNS.map(c => c.label).join(',');
    const csvRows = sortedRows.map(r =>
      COLUMNS.map(c => `"${String(r[c.key] || '').replace(/"/g, '""')}"`).join(',')
    );
    const blob = new Blob([[headers, ...csvRows].join('\n')], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'blackcoffer-insights.csv';
    a.click();
  };

  return (
    <>
      <div className="table-card">
        <div className="table-toolbar">
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Insight Records
            <span style={{ background: 'rgba(108,99,255,0.15)', color: 'var(--accent-primary)', borderRadius: '99px', padding: '0 8px', fontSize: '0.75rem', fontWeight: 700 }}>
              {total.toLocaleString()}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="search-input"
                placeholder="Search insights…"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            <button className="btn btn-ghost" onClick={exportCSV} style={{ fontSize: '0.8rem' }}>
              <Download size={14} /> Export CSV
            </button>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                {COLUMNS.map(col => (
                  <th key={col.key} style={{ minWidth: col.width }} onClick={() => handleSort(col.key)}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {col.label}
                      {sortKey === col.key
                        ? sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                        : <span style={{ opacity: 0.3 }}><ChevronDown size={12} /></span>
                      }
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={COLUMNS.length} style={{ textAlign: 'center', padding: '2rem' }}>
                  <div className="loading-spinner" style={{ margin: '0 auto' }} />
                </td></tr>
              ) : sortedRows.length === 0 ? (
                <tr><td colSpan={COLUMNS.length}>
                  <div className="empty-state"><div className="empty-state-icon">🔍</div>No results found</div>
                </td></tr>
              ) : sortedRows.map((row, i) => (
                <tr key={i} onClick={() => setSelected(row)}>
                  {COLUMNS.map(col => (
                    <td key={col.key} title={String(row[col.key] || '')}>
                      {col.numeric ? (
                        <MetricBadge
                          value={row[col.key]}
                          cls={col.key === 'intensity' ? 'intensity-badge' : col.key === 'likelihood' ? 'likelihood-badge' : 'relevance-badge'}
                        />
                      ) : col.badge ? (
                        row[col.key] ? <span className={`tag ${col.badge}`}>{row[col.key]}</span> : '—'
                      ) : (
                        row[col.key] || '—'
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <span>Showing {Math.min((page - 1) * LIMIT + 1, total)}–{Math.min(page * LIMIT, total)} of {total.toLocaleString()}</span>
          <div className="pagination-controls">
            <button className="page-btn" disabled={page <= 1} onClick={() => setPage(p => p - 1)}><ChevronLeft size={14} /></button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
              return (
                <button key={p} className={`page-btn ${p === page ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
              );
            })}
            <button className="page-btn" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}><ChevronRight size={14} /></button>
          </div>
        </div>
      </div>

      {selected && <InsightModal insight={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
