import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

import Insight from '../models/Insight.js';
import { memoryStore } from '../config/db.js';

const cleanRecord = (record) => ({
  end_year: record.end_year ? String(record.end_year).trim() : '',
  intensity: Number(record.intensity) || 0,
  sector: record.sector ? record.sector.trim() : '',
  topic: record.topic ? record.topic.trim() : '',
  insight: record.insight ? record.insight.trim() : '',
  url: record.url ? record.url.trim() : '',
  region: record.region ? record.region.trim() : '',
  start_year: record.start_year ? String(record.start_year).trim() : '',
  impact: record.impact ? String(record.impact).trim() : '',
  added: record.added ? record.added.trim() : '',
  published: record.published ? record.published.trim() : '',
  country: record.country ? record.country.trim() : '',
  relevance: Number(record.relevance) || 0,
  pestle: record.pestle ? record.pestle.trim() : '',
  source: record.source ? record.source.trim() : '',
  title: record.title ? record.title.trim() : '',
  likelihood: Number(record.likelihood) || 0,
  city: record.city ? record.city.trim() : '',
  swot: record.swot ? record.swot.trim() : '',
});

export const seedData = async (usingMemory = false) => {
  try {
    const dataPath = path.join(__dirname, '../../data/jsondata.json');
    const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    const cleanedData = rawData.map(cleanRecord);

    if (usingMemory) {
      memoryStore.data = cleanedData;
      console.log(`✅ In-memory store seeded with ${cleanedData.length} records`);
      return { count: cleanedData.length, mode: 'memory' };
    } else {
      await Insight.deleteMany({});
      const result = await Insight.insertMany(cleanedData);
      console.log(`✅ MongoDB seeded with ${result.length} records`);
      return { count: result.length, mode: 'mongodb' };
    }
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    throw error;
  }
};

// Run standalone
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/blackcoffer_dashboard';
  mongoose.connect(uri).then(async () => {
    await seedData(false);
    mongoose.connection.close();
  }).catch(err => {
    console.error(err);
    process.exit(1);
  });
}
