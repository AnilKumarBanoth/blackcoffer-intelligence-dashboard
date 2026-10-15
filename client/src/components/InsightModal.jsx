import { X, ExternalLink } from 'lucide-react';

const getIntensityColor = (v) => {
  if (v >= 8) return '#FF4D6D';
  if (v >= 5) return '#FFB800';
  return '#00D4AA';
};

export default function InsightModal({ insight, onClose }) {
  if (!insight) return null;

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-content">
        <div className="modal-header">
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px' }}>
              {insight.title || 'Insight Detail'}
            </h2>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {insight.sector && <span className="tag tag-sector">{insight.sector}</span>}
              {insight.pestle && <span className="tag tag-pestle">{insight.pestle}</span>}
              {insight.region && <span className="tag tag-region">{insight.region}</span>}
              {insight.topic  && <span className="tag tag-topic">{insight.topic}</span>}
            </div>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="modal-body">
          {/* Metrics row */}
          <div className="modal-metrics">
            <div className="modal-metric">
              <div className="modal-metric-value" style={{ color: getIntensityColor(insight.intensity) }}>{insight.intensity ?? '—'}</div>
              <div className="modal-metric-label">Intensity</div>
            </div>
            <div style={{ width: 1, background: 'var(--border)', alignSelf: 'stretch' }} />
            <div className="modal-metric">
              <div className="modal-metric-value" style={{ color: '#00D4AA' }}>{insight.likelihood ?? '—'}</div>
              <div className="modal-metric-label">Likelihood</div>
            </div>
            <div style={{ width: 1, background: 'var(--border)', alignSelf: 'stretch' }} />
            <div className="modal-metric">
              <div className="modal-metric-value" style={{ color: '#FF6B9D' }}>{insight.relevance ?? '—'}</div>
              <div className="modal-metric-label">Relevance</div>
            </div>
          </div>

          <div className="modal-field full">
            <span className="modal-field-label">Insight</span>
            <span className="modal-field-value" style={{ lineHeight: 1.7 }}>{insight.insight || '—'}</span>
          </div>

          <div className="modal-field">
            <span className="modal-field-label">Start Year</span>
            <span className="modal-field-value">{insight.start_year || '—'}</span>
          </div>
          <div className="modal-field">
            <span className="modal-field-label">End Year</span>
            <span className="modal-field-value">{insight.end_year || '—'}</span>
          </div>
          <div className="modal-field">
            <span className="modal-field-label">Country</span>
            <span className="modal-field-value">{insight.country || '—'}</span>
          </div>
          <div className="modal-field">
            <span className="modal-field-label">City</span>
            <span className="modal-field-value">{insight.city || '—'}</span>
          </div>
          <div className="modal-field">
            <span className="modal-field-label">Source</span>
            <span className="modal-field-value">{insight.source || '—'}</span>
          </div>
          <div className="modal-field">
            <span className="modal-field-label">Impact</span>
            <span className="modal-field-value">{insight.impact || '—'}</span>
          </div>
          <div className="modal-field">
            <span className="modal-field-label">Published</span>
            <span className="modal-field-value">{insight.published || '—'}</span>
          </div>
          <div className="modal-field">
            <span className="modal-field-label">SWOT</span>
            <span className="modal-field-value">{insight.swot || '—'}</span>
          </div>

          {insight.url && (
            <div className="modal-field full">
              <span className="modal-field-label">Source URL</span>
              <a
                href={insight.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
                style={{ marginTop: '4px', fontSize: '0.8rem', alignSelf: 'flex-start' }}
              >
                <ExternalLink size={14} /> Open Source
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
