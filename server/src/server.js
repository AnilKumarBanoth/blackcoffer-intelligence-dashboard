import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, memoryStore } from './config/db.js';
import { seedData } from './utils/seeder.js';
import {
  getData, getFilters, getSummary, getSectorAnalytics, getRiskMatrix,
  getTemporalTrends, getPestleBreakdown, getGeographicDistribution,
  getTopicFrequency, getSourceAnalytics,
} from './controllers/insightController.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5174'] }));
app.use(express.json());

// ── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', mode: memoryStore.isActive ? 'memory' : 'mongodb', records: memoryStore.isActive ? memoryStore.data.length : '(mongodb)', timestamp: new Date().toISOString() });
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.get('/api/data',                       getData);
app.get('/api/filters',                    getFilters);
app.get('/api/insights/summary',           getSummary);
app.get('/api/insights/sector-analytics',  getSectorAnalytics);
app.get('/api/insights/risk-matrix',       getRiskMatrix);
app.get('/api/insights/temporal-trends',   getTemporalTrends);
app.get('/api/insights/pestle-breakdown',  getPestleBreakdown);
app.get('/api/insights/geographic',        getGeographicDistribution);
app.get('/api/insights/topics',            getTopicFrequency);
app.get('/api/insights/sources',           getSourceAnalytics);

// Re-seed endpoint
app.post('/api/seed', async (req, res) => {
  try {
    const result = await seedData(memoryStore.isActive);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── 404 Handler ────────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ error: 'Endpoint not found' }));

// ── Error Handler ──────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

// ── Bootstrap ─────────────────────────────────────────────────────────────
const bootstrap = async () => {
  const connected = await connectDB();
  await seedData(!connected);
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📊 Mode: ${memoryStore.isActive ? 'In-Memory Store' : 'MongoDB'}`);
    console.log(`🔗 API: http://localhost:${PORT}/api/health`);
  });
};

bootstrap().catch(console.error);
