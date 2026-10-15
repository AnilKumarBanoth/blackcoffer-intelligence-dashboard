import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { fetchTemporalTrends } from '../../services/api';

export default function TimelineTrendChart({ filters }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchTemporalTrends(filters).then(setData).catch(console.error);
  }, [filters]);

  if (!data.length) return <div className="loading-spinner" />;

  const years = data.map(d => d.year);
  const series = [
    { name: 'Count', type: 'bar',  data: data.map(d => d.count) },
    { name: 'Avg Intensity',   type: 'line', data: data.map(d => d.avgIntensity) },
    { name: 'Avg Likelihood',  type: 'line', data: data.map(d => d.avgLikelihood) },
    { name: 'Avg Relevance',   type: 'line', data: data.map(d => d.avgRelevance) },
  ];

  const options = {
    chart: { type: 'line', background: 'transparent', toolbar: { show: false }, stacked: false },
    stroke: { curve: 'smooth', width: [0, 2.5, 2.5, 2.5] },
    fill: { type: ['solid', 'solid', 'solid', 'solid'], opacity: [0.75, 1, 1, 1] },
    colors: ['rgba(108,99,255,0.6)', '#6C63FF', '#00D4AA', '#FF6B9D'],
    plotOptions: { bar: { borderRadius: 4 } },
    xaxis: {
      categories: years,
      labels: { style: { colors: 'var(--text-muted)', fontSize: '10px' } },
    },
    yaxis: [
      {
        title: { text: 'Record Count', style: { color: 'var(--text-muted)', fontSize: '11px' } },
        labels: { style: { colors: 'var(--text-muted)', fontSize: '10px' } },
      },
      {
        opposite: true,
        min: 0, max: 10,
        title: { text: 'Avg Metrics', style: { color: 'var(--text-muted)', fontSize: '11px' } },
        labels: { style: { colors: 'var(--text-muted)', fontSize: '10px' } },
        seriesName: 'Avg Intensity',
      },
      { opposite: true, show: false, min: 0, max: 10, seriesName: 'Avg Likelihood' },
      { opposite: true, show: false, min: 0, max: 10, seriesName: 'Avg Relevance' },
    ],
    legend: {
      position: 'top',
      labels: { colors: 'var(--text-secondary)' },
      fontSize: '11px',
    },
    grid: { borderColor: 'var(--border)' },
    tooltip: { theme: 'dark', shared: true, intersect: false },
  };

  return (
    <div className="chart-container">
      <ReactApexChart type="line" series={series} options={options} height={300} />
    </div>
  );
}
