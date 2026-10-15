import Insight from '../models/Insight.js';
import { memoryStore } from '../config/db.js';

// ── Helper: Build Mongoose filter from query params ──────────────────────────
const buildFilter = (query) => {
  const filter = {};
  if (query.end_year)  filter.end_year  = query.end_year;
  if (query.start_year) filter.start_year = query.start_year;
  if (query.sector)    filter.sector    = { $regex: query.sector, $options: 'i' };
  if (query.topic)     filter.topic     = { $regex: query.topic,  $options: 'i' };
  if (query.region)    filter.region    = { $regex: query.region, $options: 'i' };
  if (query.country)   filter.country   = { $regex: query.country,$options: 'i' };
  if (query.pestle)    filter.pestle    = { $regex: query.pestle, $options: 'i' };
  if (query.source)    filter.source    = { $regex: query.source, $options: 'i' };
  if (query.swot)      filter.swot      = { $regex: query.swot,   $options: 'i' };
  if (query.city)      filter.city      = { $regex: query.city,   $options: 'i' };
  if (query.search)    filter.$or = [
    { title:   { $regex: query.search, $options: 'i' } },
    { insight: { $regex: query.search, $options: 'i' } },
    { topic:   { $regex: query.search, $options: 'i' } },
  ];
  return filter;
};

// ── Helper: Apply filter to memory store ────────────────────────────────────
const applyMemoryFilter = (query) => {
  return memoryStore.data.filter(d => {
    if (query.end_year   && d.end_year   !== query.end_year)   return false;
    if (query.start_year && d.start_year !== query.start_year) return false;
    if (query.sector     && !d.sector?.toLowerCase().includes(query.sector.toLowerCase()))   return false;
    if (query.topic      && !d.topic?.toLowerCase().includes(query.topic.toLowerCase()))     return false;
    if (query.region     && !d.region?.toLowerCase().includes(query.region.toLowerCase()))   return false;
    if (query.country    && !d.country?.toLowerCase().includes(query.country.toLowerCase())) return false;
    if (query.pestle     && !d.pestle?.toLowerCase().includes(query.pestle.toLowerCase()))   return false;
    if (query.source     && !d.source?.toLowerCase().includes(query.source.toLowerCase()))   return false;
    if (query.swot       && !d.swot?.toLowerCase().includes(query.swot.toLowerCase()))       return false;
    if (query.city       && !d.city?.toLowerCase().includes(query.city.toLowerCase()))       return false;
    if (query.search) {
      const s = query.search.toLowerCase();
      if (!d.title?.toLowerCase().includes(s) && !d.insight?.toLowerCase().includes(s) && !d.topic?.toLowerCase().includes(s)) return false;
    }
    return true;
  });
};

// ── Distinct values for dropdown filters ─────────────────────────────────────
const distinct = (arr, key) => [...new Set(arr.map(d => d[key]).filter(Boolean))].sort();

// ═══════════════════════════════════════════════════════════════════
// CONTROLLER METHODS
// ═══════════════════════════════════════════════════════════════════

// GET /api/data
export const getData = async (req, res) => {
  try {
    const page  = Math.max(parseInt(req.query.page)  || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const skip  = (page - 1) * limit;

    if (memoryStore.isActive) {
      const filtered = applyMemoryFilter(req.query);
      const data = filtered.slice(skip, skip + limit);
      return res.json({ data, total: filtered.length, page, pages: Math.ceil(filtered.length / limit) });
    }

    const filter = buildFilter(req.query);
    const [data, total] = await Promise.all([
      Insight.find(filter).sort({ intensity: -1 }).skip(skip).limit(limit),
      Insight.countDocuments(filter),
    ]);
    res.json({ data, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/filters
export const getFilters = async (req, res) => {
  try {
    if (memoryStore.isActive) {
      const d = memoryStore.data;
      return res.json({
        end_years:  distinct(d, 'end_year').filter(Boolean),
        start_years: distinct(d, 'start_year').filter(Boolean),
        sectors:    distinct(d, 'sector'),
        topics:     distinct(d, 'topic'),
        regions:    distinct(d, 'region'),
        countries:  distinct(d, 'country').filter(Boolean),
        pestles:    distinct(d, 'pestle'),
        sources:    distinct(d, 'source'),
        swots:      distinct(d, 'swot').filter(Boolean),
        cities:     distinct(d, 'city').filter(Boolean),
      });
    }

    const [end_years, start_years, sectors, topics, regions, countries, pestles, sources, swots, cities] = await Promise.all([
      Insight.distinct('end_year'),
      Insight.distinct('start_year'),
      Insight.distinct('sector'),
      Insight.distinct('topic'),
      Insight.distinct('region'),
      Insight.distinct('country'),
      Insight.distinct('pestle'),
      Insight.distinct('source'),
      Insight.distinct('swot'),
      Insight.distinct('city'),
    ]);

    res.json({
      end_years:  end_years.filter(Boolean).sort(),
      start_years: start_years.filter(Boolean).sort(),
      sectors:    sectors.filter(Boolean).sort(),
      topics:     topics.filter(Boolean).sort(),
      regions:    regions.filter(Boolean).sort(),
      countries:  countries.filter(Boolean).sort(),
      pestles:    pestles.filter(Boolean).sort(),
      sources:    sources.filter(Boolean).sort(),
      swots:      swots.filter(Boolean).sort(),
      cities:     cities.filter(Boolean).sort(),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/insights/summary
export const getSummary = async (req, res) => {
  try {
    if (memoryStore.isActive) {
      const d = memoryStore.data;
      const avg = key => d.reduce((s, r) => s + (r[key] || 0), 0) / (d.length || 1);
      const topBy = (key) => {
        const freq = {}; d.forEach(r => { if (r[key]) freq[r[key]] = (freq[r[key]] || 0) + 1; });
        return Object.entries(freq).sort((a,b) => b[1]-a[1]).slice(0, 5).map(([k, v]) => ({ _id: k, count: v }));
      };
      return res.json({
        total: d.length,
        avgIntensity: +avg('intensity').toFixed(2),
        avgLikelihood: +avg('likelihood').toFixed(2),
        avgRelevance: +avg('relevance').toFixed(2),
        topSectors: topBy('sector'),
        topRegions: topBy('region'),
        topTopics: topBy('topic'),
      });
    }

    const [agg, topSectors, topRegions, topTopics] = await Promise.all([
      Insight.aggregate([{
        $group: {
          _id: null,
          total: { $sum: 1 },
          avgIntensity: { $avg: '$intensity' },
          avgLikelihood: { $avg: '$likelihood' },
          avgRelevance: { $avg: '$relevance' },
        }
      }]),
      Insight.aggregate([{ $group: { _id: '$sector', count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 5 }]),
      Insight.aggregate([{ $group: { _id: '$region', count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 5 }]),
      Insight.aggregate([{ $group: { _id: '$topic', count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 10 }]),
    ]);

    const stats = agg[0] || {};
    res.json({
      total: stats.total || 0,
      avgIntensity: +(stats.avgIntensity || 0).toFixed(2),
      avgLikelihood: +(stats.avgLikelihood || 0).toFixed(2),
      avgRelevance: +(stats.avgRelevance || 0).toFixed(2),
      topSectors, topRegions, topTopics,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/insights/sector-analytics
export const getSectorAnalytics = async (req, res) => {
  try {
    if (memoryStore.isActive) {
      const d = applyMemoryFilter(req.query);
      const sectorMap = {};
      d.forEach(r => {
        if (!r.sector) return;
        if (!sectorMap[r.sector]) sectorMap[r.sector] = { count: 0, intensity: 0, relevance: 0, likelihood: 0 };
        sectorMap[r.sector].count++;
        sectorMap[r.sector].intensity += r.intensity || 0;
        sectorMap[r.sector].relevance += r.relevance || 0;
        sectorMap[r.sector].likelihood += r.likelihood || 0;
      });
      return res.json(Object.entries(sectorMap).map(([sector, v]) => ({
        sector,
        count: v.count,
        avgIntensity: +(v.intensity / v.count).toFixed(2),
        avgRelevance: +(v.relevance / v.count).toFixed(2),
        avgLikelihood: +(v.likelihood / v.count).toFixed(2),
      })).sort((a, b) => b.count - a.count));
    }

    const filter = buildFilter(req.query);
    const result = await Insight.aggregate([
      { $match: filter },
      { $group: {
          _id: '$sector',
          count: { $sum: 1 },
          avgIntensity: { $avg: '$intensity' },
          avgRelevance: { $avg: '$relevance' },
          avgLikelihood: { $avg: '$likelihood' },
      }},
      { $sort: { count: -1 } },
    ]);
    res.json(result.map(r => ({ sector: r._id, count: r.count, avgIntensity: +r.avgIntensity.toFixed(2), avgRelevance: +r.avgRelevance.toFixed(2), avgLikelihood: +r.avgLikelihood.toFixed(2) })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/insights/risk-matrix
export const getRiskMatrix = async (req, res) => {
  try {
    let data;
    if (memoryStore.isActive) {
      data = applyMemoryFilter(req.query).map(d => ({
        topic: d.topic, sector: d.sector, likelihood: d.likelihood, relevance: d.relevance, intensity: d.intensity,
      }));
    } else {
      const filter = buildFilter(req.query);
      data = await Insight.find(filter, 'topic sector likelihood relevance intensity').lean();
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/insights/temporal-trends
export const getTemporalTrends = async (req, res) => {
  try {
    if (memoryStore.isActive) {
      const d = applyMemoryFilter(req.query);
      const yearMap = {};
      d.forEach(r => {
        const yr = r.end_year || r.start_year; if (!yr) return;
        if (!yearMap[yr]) yearMap[yr] = { count: 0, intensity: 0, likelihood: 0, relevance: 0 };
        yearMap[yr].count++;
        yearMap[yr].intensity += r.intensity || 0;
        yearMap[yr].likelihood += r.likelihood || 0;
        yearMap[yr].relevance += r.relevance || 0;
      });
      return res.json(Object.entries(yearMap).sort((a,b) => a[0]-b[0]).map(([year, v]) => ({
        year, count: v.count,
        avgIntensity: +(v.intensity / v.count).toFixed(2),
        avgLikelihood: +(v.likelihood / v.count).toFixed(2),
        avgRelevance: +(v.relevance / v.count).toFixed(2),
      })));
    }

    const filter = buildFilter(req.query);
    const result = await Insight.aggregate([
      { $match: { ...filter, $or: [{ end_year: { $ne: '' } }, { start_year: { $ne: '' } }] } },
      { $addFields: { year: { $cond: [{ $ne: ['$end_year', ''] }, '$end_year', '$start_year'] } } },
      { $group: { _id: '$year', count: { $sum: 1 }, avgIntensity: { $avg: '$intensity' }, avgLikelihood: { $avg: '$likelihood' }, avgRelevance: { $avg: '$relevance' } } },
      { $sort: { _id: 1 } },
    ]);
    res.json(result.map(r => ({ year: r._id, count: r.count, avgIntensity: +r.avgIntensity.toFixed(2), avgLikelihood: +r.avgLikelihood.toFixed(2), avgRelevance: +r.avgRelevance.toFixed(2) })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/insights/pestle-breakdown
export const getPestleBreakdown = async (req, res) => {
  try {
    if (memoryStore.isActive) {
      const d = applyMemoryFilter(req.query);
      const map = {};
      d.forEach(r => { if (r.pestle) { map[r.pestle] = (map[r.pestle] || 0) + 1; } });
      return res.json(Object.entries(map).map(([pestle, count]) => ({ pestle, count })).sort((a,b) => b.count-a.count));
    }

    const filter = buildFilter(req.query);
    const result = await Insight.aggregate([
      { $match: filter },
      { $group: { _id: '$pestle', count: { $sum: 1 }, avgIntensity: { $avg: '$intensity' } } },
      { $sort: { count: -1 } },
    ]);
    res.json(result.map(r => ({ pestle: r._id, count: r.count, avgIntensity: +r.avgIntensity.toFixed(2) })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/insights/geographic-distribution
export const getGeographicDistribution = async (req, res) => {
  try {
    if (memoryStore.isActive) {
      const d = applyMemoryFilter(req.query);
      const rMap = {}, cMap = {};
      d.forEach(r => {
        if (r.region)  { if (!rMap[r.region])  rMap[r.region]  = { count: 0, intensity: 0 }; rMap[r.region].count++; rMap[r.region].intensity += r.intensity || 0; }
        if (r.country) { if (!cMap[r.country]) cMap[r.country] = { count: 0, intensity: 0 }; cMap[r.country].count++; cMap[r.country].intensity += r.intensity || 0; }
      });
      return res.json({
        regions:   Object.entries(rMap).map(([k,v]) => ({ region: k, count: v.count, avgIntensity: +(v.intensity/v.count).toFixed(2) })).sort((a,b)=>b.count-a.count),
        countries: Object.entries(cMap).map(([k,v]) => ({ country: k, count: v.count, avgIntensity: +(v.intensity/v.count).toFixed(2) })).sort((a,b)=>b.count-a.count),
      });
    }

    const filter = buildFilter(req.query);
    const [regions, countries] = await Promise.all([
      Insight.aggregate([{ $match: filter }, { $group: { _id: '$region', count: { $sum: 1 }, avgIntensity: { $avg: '$intensity' } } }, { $sort: { count: -1 } }]),
      Insight.aggregate([{ $match: filter }, { $group: { _id: '$country', count: { $sum: 1 }, avgIntensity: { $avg: '$intensity' } } }, { $sort: { count: -1 } }, { $limit: 20 }]),
    ]);
    res.json({
      regions: regions.map(r => ({ region: r._id, count: r.count, avgIntensity: +r.avgIntensity.toFixed(2) })),
      countries: countries.map(r => ({ country: r._id, count: r.count, avgIntensity: +r.avgIntensity.toFixed(2) })).filter(c => c.country),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/insights/topic-frequency
export const getTopicFrequency = async (req, res) => {
  try {
    if (memoryStore.isActive) {
      const d = applyMemoryFilter(req.query);
      const map = {};
      d.forEach(r => { if (r.topic) { if (!map[r.topic]) map[r.topic] = { count: 0, intensity: 0 }; map[r.topic].count++; map[r.topic].intensity += r.intensity || 0; } });
      return res.json(Object.entries(map).map(([t,v]) => ({ topic: t, count: v.count, avgIntensity: +(v.intensity/v.count).toFixed(2) })).sort((a,b)=>b.count-a.count).slice(0,30));
    }

    const filter = buildFilter(req.query);
    const result = await Insight.aggregate([
      { $match: filter },
      { $group: { _id: '$topic', count: { $sum: 1 }, avgIntensity: { $avg: '$intensity' } } },
      { $sort: { count: -1 } },
      { $limit: 30 },
    ]);
    res.json(result.map(r => ({ topic: r._id, count: r.count, avgIntensity: +r.avgIntensity.toFixed(2) })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/insights/sources
export const getSourceAnalytics = async (req, res) => {
  try {
    if (memoryStore.isActive) {
      const d = applyMemoryFilter(req.query);
      const map = {};
      d.forEach(r => { if (r.source) { if (!map[r.source]) map[r.source] = { count: 0, intensity: 0 }; map[r.source].count++; map[r.source].intensity += r.intensity || 0; } });
      return res.json(Object.entries(map).map(([s,v]) => ({ source: s, count: v.count, avgIntensity: +(v.intensity/v.count).toFixed(2) })).sort((a,b)=>b.count-a.count).slice(0,15));
    }

    const filter = buildFilter(req.query);
    const result = await Insight.aggregate([
      { $match: filter },
      { $group: { _id: '$source', count: { $sum: 1 }, avgIntensity: { $avg: '$intensity' } } },
      { $sort: { count: -1 } },
      { $limit: 15 },
    ]);
    res.json(result.map(r => ({ source: r._id, count: r.count, avgIntensity: +r.avgIntensity.toFixed(2) })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
