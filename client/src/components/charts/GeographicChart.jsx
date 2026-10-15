import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { fetchGeographic } from '../../services/api';

export default function GeographicChart({ filters }) {
  const [geoData, setGeoData] = useState({ regions: [], countries: [] });

  useEffect(() => {
    fetchGeographic(filters).then(setGeoData).catch(console.error);
  }, [filters]);

  const { regions, countries } = geoData;
  if (!regions.length && !countries.length) return <div className="loading-spinner" />;

  const regionSeries = [{
    name: 'Insights',
    data: regions.slice(0, 10).map(d => d.count),
  }];

  const regionOpts = {
    chart: { type: 'bar', background: 'transparent', toolbar: { show: false } },
    plotOptions: { bar: { horizontal: true, borderRadius: 4, barHeight: '65%' } },
    xaxis: {
      categories: regions.slice(0, 10).map(d => d.region || 'Unknown'),
      labels: { style: { colors: 'var(--text-muted)', fontSize: '10px' } },
    },
    yaxis: { labels: { style: { colors: 'var(--text-muted)', fontSize: '10px' } } },
    fill: {
      type: 'gradient',
      gradient: { gradientToColors: ['#6C63FF'], stops: [0, 100], shadeIntensity: 0.3 },
    },
    colors: ['#4FACFE'],
    grid: { borderColor: 'var(--border)' },
    tooltip: { theme: 'dark' },
    dataLabels: { enabled: false },
  };

  const countrySeries = [{
    name: 'Avg Intensity',
    data: countries.filter(c => c.country).slice(0, 10).map(d => d.avgIntensity),
  }];

  const countryOpts = {
    chart: { type: 'bar', background: 'transparent', toolbar: { show: false } },
    plotOptions: { bar: { borderRadius: 4, barHeight: '65%', columnWidth: '55%' } },
    xaxis: {
      categories: countries.filter(c => c.country).slice(0, 10).map(d => d.country),
      labels: { style: { colors: 'var(--text-muted)', fontSize: '9px' }, rotate: -30 },
    },
    yaxis: { labels: { style: { colors: 'var(--text-muted)', fontSize: '10px' } }, min: 0, max: 10 },
    colors: ['#FF6B9D'],
    fill: { type: 'gradient', gradient: { gradientToColors: ['#6C63FF'], stops: [0, 100] } },
    grid: { borderColor: 'var(--border)' },
    tooltip: { theme: 'dark' },
    dataLabels: { enabled: false },
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
      <div>
        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>By Region</div>
        <ReactApexChart type="bar" series={regionSeries} options={regionOpts} height={260} />
      </div>
      <div>
        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Avg Intensity by Country</div>
        <ReactApexChart type="bar" series={countrySeries} options={countryOpts} height={260} />
      </div>
    </div>
  );
}
