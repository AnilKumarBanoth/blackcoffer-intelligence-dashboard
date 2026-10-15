import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

const api = axios.create({ baseURL: API_BASE, timeout: 15000 });

const paramsFromFilters = (filters) => {
  const params = {};
  Object.entries(filters).forEach(([k, v]) => { if (v && v !== 'all') params[k] = v; });
  return params;
};

export const fetchHealth      = ()         => api.get('/health').then(r => r.data);
export const fetchFilters     = ()         => api.get('/filters').then(r => r.data);
export const fetchSummary     = ()         => api.get('/insights/summary').then(r => r.data);
export const fetchData        = (filters, page = 1, limit = 20) => api.get('/data', { params: { ...paramsFromFilters(filters), page, limit } }).then(r => r.data);
export const fetchSectorAnalytics = (filters) => api.get('/insights/sector-analytics', { params: paramsFromFilters(filters) }).then(r => r.data);
export const fetchRiskMatrix  = (filters)  => api.get('/insights/risk-matrix', { params: paramsFromFilters(filters) }).then(r => r.data);
export const fetchTemporalTrends = (filters) => api.get('/insights/temporal-trends', { params: paramsFromFilters(filters) }).then(r => r.data);
export const fetchPestle      = (filters)  => api.get('/insights/pestle-breakdown', { params: paramsFromFilters(filters) }).then(r => r.data);
export const fetchGeographic  = (filters)  => api.get('/insights/geographic', { params: paramsFromFilters(filters) }).then(r => r.data);
export const fetchTopics      = (filters)  => api.get('/insights/topics', { params: paramsFromFilters(filters) }).then(r => r.data);
export const fetchSources     = (filters)  => api.get('/insights/sources', { params: paramsFromFilters(filters) }).then(r => r.data);
export const triggerSeed      = ()         => api.post('/seed').then(r => r.data);
