import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { fetchRiskMatrix } from '../../services/api';

export default function RiskMatrixChart({ filters }) {
  const [series, setSeries] = useState([]);

  useEffect(() => {
    fetchRiskMatrix(filters).then(raw => {
      // Group by sector
      const sectorMap = {};
      raw.forEach(d => {
        const sec = d.sector || 'Unknown';
        if (!sectorMap[sec]) sectorMap[sec] = [];
        sectorMap[sec].push({ x: d.likelihood || 0, y: d.relevance || 0, z: (d.intensity || 1) * 3, label: d.topic });
      });
      setSeries(Object.entries(sectorMap).map(([name, data]) => ({ name, data })));
    }).catch(console.error);
  }, [filters]);

  if (!series.length) return <div className="loading-spinner" />;

  const options = {
    chart: {
      type: 'bubble',
      background: 'transparent',
      toolbar: { show: false },
      zoom: { enabled: true },
    },
    dataLabels: { enabled: false },
    fill: { opacity: 0.7 },
    xaxis: {
      title: { text: 'Likelihood', style: { color: 'var(--text-muted)', fontSize: '11px' } },
      tickAmount: 5,
      min: 0, max: 6,
      labels: { style: { colors: 'var(--text-muted)', fontSize: '10px' } },
    },
    yaxis: {
      title: { text: 'Relevance', style: { color: 'var(--text-muted)', fontSize: '11px' } },
      min: 0, max: 6,
      labels: { style: { colors: 'var(--text-muted)', fontSize: '10px' } },
    },
    legend: {
      position: 'bottom',
      labels: { colors: 'var(--text-secondary)', useSeriesColors: false },
      fontSize: '11px',
    },
    tooltip: {
      theme: 'dark',
      custom: ({ series: s, seriesIndex, dataPointIndex, w }) => {
        const d = w.config.series[seriesIndex].data[dataPointIndex];
        return `<div class="custom-tooltip"><strong>${w.config.series[seriesIndex].name}</strong><br/>Likelihood: ${d.x}<br/>Relevance: ${d.y}<br/>Topic: ${d.label || ''}</div>`;
      },
    },
    colors: ['#6C63FF','#FF6B9D','#00D4AA','#FFB800','#4FACFE','#FF4D6D','#a855f7','#06b6d4'],
    grid: { borderColor: 'var(--border)' },
    theme: { mode: document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark' },
  };

  return (
    <div className="chart-container">
      <ReactApexChart type="bubble" series={series} options={options} height={320} />
    </div>
  );
}
