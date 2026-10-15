import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { fetchSectorAnalytics } from '../../services/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function SectorIntensityChart({ filters }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchSectorAnalytics(filters).then(setData).catch(console.error);
  }, [filters]);

  if (!data.length) return <div className="loading-spinner" />;

  const labels = data.slice(0, 10).map(d => d.sector || 'Unknown');
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Avg Intensity',
        data: data.slice(0, 10).map(d => d.avgIntensity),
        backgroundColor: 'rgba(108,99,255,0.75)',
        borderColor: '#6C63FF',
        borderWidth: 1,
        borderRadius: 6,
      },
      {
        label: 'Avg Relevance',
        data: data.slice(0, 10).map(d => d.avgRelevance),
        backgroundColor: 'rgba(255,107,157,0.75)',
        borderColor: '#FF6B9D',
        borderWidth: 1,
        borderRadius: 6,
      },
      {
        label: 'Avg Likelihood',
        data: data.slice(0, 10).map(d => d.avgLikelihood),
        backgroundColor: 'rgba(0,212,170,0.75)',
        borderColor: '#00D4AA',
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: 'var(--text-secondary)', font: { size: 11, family: 'Inter' }, boxWidth: 12 },
      },
      tooltip: {
        backgroundColor: 'var(--bg-elevated)',
        titleColor: 'var(--text-primary)',
        bodyColor: 'var(--text-secondary)',
        borderColor: 'var(--border)',
        borderWidth: 1,
        padding: 10,
      },
    },
    scales: {
      x: {
        ticks: { color: 'var(--text-muted)', font: { size: 10 }, maxRotation: 30 },
        grid: { color: 'var(--border)' },
      },
      y: {
        ticks: { color: 'var(--text-muted)', font: { size: 10 } },
        grid: { color: 'var(--border)' },
        beginAtZero: true,
        max: 10,
      },
    },
  };

  return (
    <div className="chart-container" style={{ height: 300 }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}
