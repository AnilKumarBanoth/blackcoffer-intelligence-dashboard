# Blackcoffer Intelligence Dashboard

> Enterprise-grade Data Visualization Dashboard built for the Blackcoffer Assignment

![Dashboard](https://img.shields.io/badge/Stack-MERN-blueviolet?style=flat-square)
![Charts](https://img.shields.io/badge/Charts-D3.js%20%7C%20ApexCharts%20%7C%20Chart.js-orange?style=flat-square)
![DB](https://img.shields.io/badge/Database-MongoDB%20%2B%20Fallback-green?style=flat-square)

---

## 🚀 Quick Start

```bash
# 1. Install all dependencies
npm run install:all

# 2. Start both frontend + backend concurrently
npm run dev
```

- **Frontend**: http://localhost:5173  
- **Backend API**: http://localhost:5000/api/health

---

## 🏗️ Architecture

```
blackcoffer-dashboard/
├── server/                 # Node.js / Express Backend
│   ├── src/
│   │   ├── server.js       # Express app & routes
│   │   ├── config/db.js    # MongoDB connection + in-memory fallback
│   │   ├── models/Insight.js       # Mongoose schema
│   │   ├── controllers/insightController.js  # API logic & aggregations
│   │   └── utils/seeder.js # JSON → DB seeder
│   └── data/jsondata.json  # Source dataset
│
└── client/                 # React + Vite Frontend
    └── src/
        ├── App.jsx          # Main dashboard layout
        ├── services/api.js  # API client
        ├── styles/dashboard.css   # Design system
        └── components/
            ├── Header.jsx
            ├── FilterBar.jsx
            ├── KPICards.jsx
            ├── DataTable.jsx
            ├── InsightModal.jsx
            └── charts/
                ├── D3TopicCluster.jsx       # D3.js force bubble
                ├── SectorIntensityChart.jsx # Chart.js grouped bars
                ├── RiskMatrixChart.jsx      # ApexCharts bubble
                ├── TimelineTrendChart.jsx   # ApexCharts mixed
                ├── PestleDistributionChart.jsx # Doughnut + Radar
                ├── GeographicChart.jsx      # Horizontal + column bar
                └── TopSourcesChart.jsx      # Colorful horizontal bar
```

---

## 📊 Visualizations

| Chart | Library | Description |
|-------|---------|-------------|
| Topic Intelligence Cluster | **D3.js** | Force-directed interactive bubble chart, draggable nodes |
| PESTLE Distribution | **Chart.js + ApexCharts** | Doughnut + Radar dual visualization |
| Sector Analytics | **Chart.js** | Grouped bar chart (Intensity, Relevance, Likelihood) |
| Risk Matrix | **ApexCharts** | Bubble scatter: Likelihood × Relevance, sized by Intensity |
| Temporal Trends | **ApexCharts** | Mixed bar + line: counts & avg metrics by year |
| Top Intelligence Sources | **ApexCharts** | Colorful distributed horizontal bar |
| Geographic Distribution | **ApexCharts** | Horizontal region bars + country intensity columns |

---

## 🎛️ Filters Available

| Filter | Type |
|--------|------|
| End Year | Dropdown |
| Start Year | Dropdown |
| Sector | Dropdown |
| Topic | Dropdown |
| Region | Dropdown |
| Country | Dropdown |
| PESTLE | Dropdown |
| Source | Dropdown |
| SWOT | Dropdown |
| City | Dropdown |
| Full-text Search | Text input (title / insight / topic) |

All filters are reactive — charts and data table update instantly.

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health + DB mode |
| GET | `/api/filters` | All distinct filter values |
| GET | `/api/data` | Paginated & filtered records |
| GET | `/api/insights/summary` | Executive KPI metrics |
| GET | `/api/insights/sector-analytics` | Sector aggregates |
| GET | `/api/insights/risk-matrix` | Raw likelihood/relevance data |
| GET | `/api/insights/temporal-trends` | Year-over-year metrics |
| GET | `/api/insights/pestle-breakdown` | PESTLE category counts |
| GET | `/api/insights/geographic` | Region + country distribution |
| GET | `/api/insights/topics` | Topic frequency & intensity |
| GET | `/api/insights/sources` | Source intelligence ranking |
| POST | `/api/seed` | Re-seed database from JSON |

### Query Parameters (applicable to all filtered endpoints)
```
?end_year=2030&sector=Energy&region=World&pestle=Environmental
&country=Germany&topic=solar&source=IEA&city=Berlin&page=1&limit=20
```

---

## 🗄️ Database

- **Primary**: MongoDB via Mongoose (configure `MONGODB_URI` in `server/.env`)
- **Fallback**: Automatic in-memory store — works with **zero setup**
- **Seeding**: Runs automatically on server start; can be triggered via `POST /api/seed` or the dashboard UI

---

## ✨ Features

- **Dark/Light Theme** toggle with glassmorphism accents
- **Live KPI cards** — total records, avg intensity/likelihood/relevance, top sector & region
- **Interactive D3.js force graph** — drag, hover tooltips, multi-color spectrum
- **Comprehensive filter bar** — collapsible with active pill badges and one-click reset
- **Paginated data table** — sortable columns, full-text search, CSV export
- **Insight detail modal** — full record view with external URL link
- **Responsive design** — mobile and desktop optimized

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite 5 |
| Visualization | D3.js v7, ApexCharts v4, Chart.js v4 |
| Backend | Node.js, Express 4 |
| Database | MongoDB, Mongoose 8 |
| HTTP Client | Axios |
| Icons | Lucide React |
| Font | Inter, Space Grotesk (Google Fonts) |
| Dev tools | Nodemon, Concurrently |

---

## 📁 Configuration

```env
# server/.env
MONGODB_URI=mongodb://localhost:27017/blackcoffer_dashboard
PORT=5000
NODE_ENV=development
```

---

*Blackcoffer Visualization Assignment — Built as a senior full-stack implementation*
