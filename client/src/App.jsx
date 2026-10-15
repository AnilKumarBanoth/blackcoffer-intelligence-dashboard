import { useState, useEffect } from 'react';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import KPICards from './components/KPICards';
import DataTable from './components/DataTable';
import D3TopicCluster from './components/charts/D3TopicCluster';
import SectorIntensityChart from './components/charts/SectorIntensityChart';
import RiskMatrixChart from './components/charts/RiskMatrixChart';
import TimelineTrendChart from './components/charts/TimelineTrendChart';
import PestleDistributionChart from './components/charts/PestleDistributionChart';
import GeographicChart from './components/charts/GeographicChart';
import TopSourcesChart from './components/charts/TopSourcesChart';
import { fetchSummary } from './services/api';

const EMPTY_FILTERS = {
  end_year: '', start_year: '', sector: '', topic: '',
  region: '', country: '', pestle: '', source: '', swot: '', city: '',
};

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [summary, setSummary] = useState(null);

  // Apply theme to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Load summary
  useEffect(() => {
    fetchSummary().then(setSummary).catch(console.error);
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleReset = () => setFilters(EMPTY_FILTERS);

  return (
    <div className="app-shell">
      <Header theme={theme} setTheme={setTheme} summary={summary} />

      <main className="main-content">
        {/* KPI Overview */}
        <KPICards />

        {/* Filters */}
        <FilterBar filters={filters} onFilterChange={handleFilterChange} onReset={handleReset} />

        {/* Charts - Row 1 */}
        <div className="charts-section">
          {/* D3 Topic Bubble Cluster */}
          <div className="chart-card col-7">
            <div className="card-header">
              <div>
                <div className="card-title">🔵 Topic Intelligence Cluster</div>
                <div className="card-subtitle">D3.js force-directed bubble visualization · drag to explore</div>
              </div>
            </div>
            <D3TopicCluster filters={filters} />
          </div>

          {/* PESTLE Breakdown */}
          <div className="chart-card col-5">
            <div className="card-header">
              <div>
                <div className="card-title">🌐 PESTLE Distribution</div>
                <div className="card-subtitle">Political · Economic · Social · Technological · Legal · Environmental</div>
              </div>
            </div>
            <PestleDistributionChart filters={filters} />
          </div>
        </div>

        {/* Charts - Row 2 */}
        <div className="charts-section">
          {/* Sector Analytics */}
          <div className="chart-card col-6">
            <div className="card-header">
              <div>
                <div className="card-title">📊 Sector Analytics</div>
                <div className="card-subtitle">Intensity · Relevance · Likelihood by sector</div>
              </div>
            </div>
            <SectorIntensityChart filters={filters} />
          </div>

          {/* Risk Matrix */}
          <div className="chart-card col-6">
            <div className="card-header">
              <div>
                <div className="card-title">⚡ Risk Matrix</div>
                <div className="card-subtitle">Likelihood vs Relevance · bubble size = intensity</div>
              </div>
            </div>
            <RiskMatrixChart filters={filters} />
          </div>
        </div>

        {/* Charts - Row 3 */}
        <div className="charts-section">
          {/* Timeline Trend */}
          <div className="chart-card col-8">
            <div className="card-header">
              <div>
                <div className="card-title">📈 Temporal Intelligence Trends</div>
                <div className="card-subtitle">Year-over-year record counts & avg metric evolution</div>
              </div>
            </div>
            <TimelineTrendChart filters={filters} />
          </div>

          {/* Top Sources */}
          <div className="chart-card col-4">
            <div className="card-header">
              <div>
                <div className="card-title">🏆 Top Intelligence Sources</div>
                <div className="card-subtitle">Leading data publishers ranked by insight volume</div>
              </div>
            </div>
            <TopSourcesChart filters={filters} />
          </div>
        </div>

        {/* Charts - Row 4: Geographic */}
        <div className="charts-section">
          <div className="chart-card col-12">
            <div className="card-header">
              <div>
                <div className="card-title">🗺️ Geographic Distribution</div>
                <div className="card-subtitle">Regional insight volume and country-level average intensity</div>
              </div>
            </div>
            <GeographicChart filters={filters} />
          </div>
        </div>

        {/* Data Explorer Table */}
        <div className="section-heading">
          <span>📋 Insight Explorer</span>
        </div>
        <DataTable filters={filters} />
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
        background: 'var(--bg-glass)',
      }}>
        <span>Blackcoffer Intelligence Dashboard · Visualization Assignment</span>
        <span>Built with React · D3.js · ApexCharts · Chart.js · Node.js · MongoDB</span>
      </footer>
    </div>
  );
}
