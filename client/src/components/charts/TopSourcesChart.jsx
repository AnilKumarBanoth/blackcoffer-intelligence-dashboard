import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { fetchSources } from '../../services/api';

export default function TopSourcesChart({ filters }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchSources(filters).then(setData).catch(console.error);
  }, [filters]);

  if (!data.length) return <div className="loading-spinner" />;

  const sorted = [...data].sort((a, b) => b.count - a.count).slice(0, 12);
  const series = [{ name: 'Insight Count', data: sorted.map(d => d.count) }];

  const options = {
    chart: { type: 'bar', background: 'transparent', toolbar: { show: false }, animations: { enabled: true, speed: 600 } },
    plotOptions: { bar: { horizontal: true, borderRadius: 5, barHeight: '60%', distributed: true } },
    colors: ['#6C63FF','#FF6B9D','#00D4AA','#FFB800','#4FACFE','#a855f7','#f97316','#06b6d4','#FF4D6D','#10b981','#8b5cf6','#ec4899'],
    dataLabels: {
      enabled: true,
      style: { fontSize: '10px', colors: ['var(--text-primary)'] },
      formatter: v => v,
      offsetX: 5,
    },
    xaxis: {
      categories: sorted.map(d => d.source),
      labels: { style: { colors: 'var(--text-muted)', fontSize: '10px' } },
    },
    yaxis: { labels: { style: { colors: 'var(--text-secondary)', fontSize: '11px' } } },
    grid: { borderColor: 'var(--border)', xaxis: { lines: { show: true } }, yaxis: { lines: { show: false } } },
    tooltip: {
      theme: 'dark',
      y: { formatter: v => `${v} insights` },
    },
    legend: { show: false },
  };

  return (
    <div className="chart-container">
      <ReactApexChart type="bar" series={series} options={options} height={320} />
    </div>
  );
}
