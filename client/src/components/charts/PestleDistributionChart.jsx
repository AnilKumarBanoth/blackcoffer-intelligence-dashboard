import { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ReactApexChart from 'react-apexcharts';
import { fetchPestle } from '../../services/api';

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = ['#6C63FF','#FF6B9D','#00D4AA','#FFB800','#4FACFE','#FF4D6D','#a855f7','#f97316'];

export default function PestleDistributionChart({ filters }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchPestle(filters).then(setData).catch(console.error);
  }, [filters]);

  if (!data.length) return <div className="loading-spinner" />;

  const labels = data.map(d => d.pestle);
  const counts = data.map(d => d.count);

  const donutData = {
    labels,
    datasets: [{
      data: counts,
      backgroundColor: COLORS.map(c => c + 'CC'),
      borderColor: COLORS,
      borderWidth: 2,
      hoverOffset: 8,
    }],
  };

  const donutOpts = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '62%',
    plugins: {
      legend: {
        position: 'right',
        labels: { color: 'var(--text-secondary)', font: { size: 11 }, padding: 12, boxWidth: 12 },
      },
      tooltip: {
        backgroundColor: '#1a1b2e',
        titleColor: '#F1F2FF',
        bodyColor: '#9BA3C4',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
      },
    },
  };

  const radarSeries = [{ name: 'Count', data: counts }];
  const radarOptions = {
    chart: { type: 'radar', background: 'transparent', toolbar: { show: false } },
    xaxis: { categories: labels, labels: { style: { colors: Array(labels.length).fill('var(--text-muted)'), fontSize: '10px' } } },
    yaxis: { show: false },
    fill: { opacity: 0.25, colors: ['#6C63FF'] },
    stroke: { width: 2, colors: ['#6C63FF'] },
    markers: { size: 4, colors: ['#6C63FF'] },
    grid: { show: false },
    tooltip: { theme: 'dark' },
  };

  return (
    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
      <div style={{ flex: 1.2, height: 260 }}>
        <Doughnut data={donutData} options={donutOpts} />
      </div>
      <div style={{ flex: 1 }}>
        <ReactApexChart type="radar" series={radarSeries} options={radarOptions} height={240} />
      </div>
    </div>
  );
}
