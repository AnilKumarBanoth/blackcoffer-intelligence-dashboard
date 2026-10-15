import mongoose from 'mongoose';

const InsightSchema = new mongoose.Schema({
  end_year: { type: String, index: true },
  intensity: { type: Number, default: 0 },
  sector: { type: String, index: true },
  topic: { type: String, index: true },
  insight: { type: String },
  url: { type: String },
  region: { type: String, index: true },
  start_year: { type: String, index: true },
  impact: { type: String },
  added: { type: String },
  published: { type: String },
  country: { type: String, index: true },
  relevance: { type: Number, default: 0 },
  pestle: { type: String, index: true },
  source: { type: String, index: true },
  title: { type: String },
  likelihood: { type: Number, default: 0 },
  city: { type: String, index: true },
  swot: { type: String, index: true },
}, {
  timestamps: true,
  collection: 'insights'
});

// Compound index for common filter combos
InsightSchema.index({ sector: 1, region: 1, country: 1 });
InsightSchema.index({ pestle: 1, topic: 1 });
InsightSchema.index({ end_year: 1, intensity: 1 });

const Insight = mongoose.model('Insight', InsightSchema);
export default Insight;
