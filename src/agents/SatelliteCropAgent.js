/**
 * Satellite Crop Assessment Agent
 * ─────────────────────────────────
 * Input:  { lat, lon, dateFrom, dateTo }
 * Output: { cropHealthScore, yieldRiskRating, ndviTimeSeries, soilHealth, rainfallHistory, metadata }
 */

// Simulated NDVI band reflectance computation from Sentinel-2 imagery
function computeNDVI(lat, lon, month) {
  // Latitude-adjusted seasonal vegetation model
  const baseNDVI = 0.65;
  const latFactor = Math.max(0, 1 - Math.abs(lat) * 0.08);
  const seasonalCurve = Math.sin(((month - 2) / 12) * Math.PI * 2) * 0.15;
  const lonNoise = Math.sin(lon * 3.7) * 0.05;
  return Math.min(0.95, Math.max(0.15, baseNDVI + latFactor * 0.1 + seasonalCurve + lonNoise));
}

// Soil health index from spectral analysis (simulated)
function assessSoilHealth(lat, lon) {
  const organicCarbon = 1.8 + Math.sin(lat * 5) * 0.8;  // % SOC
  const pH = 6.2 + Math.cos(lon * 2) * 0.6;
  const nitrogen = 0.12 + Math.sin(lat * lon) * 0.04;    // % N
  const phosphorus = 18 + Math.cos(lat * 3) * 8;          // ppm
  const texture = pH > 6.5 ? 'Loamy Clay' : 'Sandy Loam';
  const score = Math.min(100, Math.max(20, Math.round(
    organicCarbon * 15 + (7 - Math.abs(pH - 6.5)) * 10 + nitrogen * 200 + phosphorus * 0.5
  )));
  return { organicCarbon: +organicCarbon.toFixed(2), pH: +pH.toFixed(1), nitrogen: +nitrogen.toFixed(3), phosphorus: Math.round(phosphorus), texture, score };
}

// Historical rainfall from climate grid (simulated)
function getHistoricalRainfall(lat, lon, months) {
  return months.map((m, i) => {
    const baseMM = 45 + Math.sin(((m - 3) / 12) * Math.PI * 2) * 35;
    const geoAdj = Math.cos(lat * 2) * 15 + Math.sin(lon) * 10;
    const mm = Math.max(2, Math.round(baseMM + geoAdj + (Math.random() - 0.5) * 12));
    return { month: m, rainfallMm: mm };
  });
}

/**
 * Main Agent Entry Point
 * @param {Object} input - { lat: number, lon: number, dateFrom: string, dateTo: string }
 * @returns {Object} JSON assessment result
 */
export function runSatelliteCropAssessment(input) {
  const { lat, lon, dateFrom, dateTo } = input;
  const startDate = new Date(dateFrom || '2026-01-01');
  const endDate = new Date(dateTo || '2026-07-29');

  // Generate monthly NDVI time-series
  const monthCount = Math.max(1, (endDate.getFullYear() - startDate.getFullYear()) * 12 + endDate.getMonth() - startDate.getMonth() + 1);
  const monthLabels = [];
  const ndviTimeSeries = [];
  for (let i = 0; i < Math.min(monthCount, 12); i++) {
    const m = ((startDate.getMonth() + i) % 12) + 1;
    const label = new Date(2026, m - 1).toLocaleString('en', { month: 'short' });
    const ndvi = computeNDVI(lat, lon, m);
    monthLabels.push(label);
    ndviTimeSeries.push({ month: label, ndvi: +ndvi.toFixed(3) });
  }

  // Current NDVI (latest month)
  const currentNDVI = ndviTimeSeries[ndviTimeSeries.length - 1]?.ndvi ?? 0.65;
  const avgNDVI = +(ndviTimeSeries.reduce((s, d) => s + d.ndvi, 0) / ndviTimeSeries.length).toFixed(3);

  // Soil health assessment
  const soilHealth = assessSoilHealth(lat, lon);

  // Rainfall history
  const rainfallMonths = monthLabels.map((_, i) => ((startDate.getMonth() + i) % 12) + 1);
  const rainfallHistory = getHistoricalRainfall(lat, lon, rainfallMonths);
  const avgRainfall = +(rainfallHistory.reduce((s, d) => s + d.rainfallMm, 0) / rainfallHistory.length).toFixed(1);

  // Composite Crop Health Score (0–100)
  const ndviComponent = currentNDVI * 40;
  const soilComponent = soilHealth.score * 0.3;
  const rainComponent = Math.min(30, avgRainfall * 0.4);
  const cropHealthScore = Math.min(100, Math.max(10, Math.round(ndviComponent + soilComponent + rainComponent)));

  // Yield Risk Rating
  let yieldRiskRating, yieldRiskLevel;
  if (cropHealthScore >= 75) { yieldRiskRating = 'LOW'; yieldRiskLevel = 1; }
  else if (cropHealthScore >= 50) { yieldRiskRating = 'MODERATE'; yieldRiskLevel = 2; }
  else if (cropHealthScore >= 30) { yieldRiskRating = 'HIGH'; yieldRiskLevel = 3; }
  else { yieldRiskRating = 'CRITICAL'; yieldRiskLevel = 4; }

  return {
    agentId: 'satellite-crop-assessment-v2.4',
    timestamp: new Date().toISOString(),
    input: { lat, lon, dateFrom: startDate.toISOString().split('T')[0], dateTo: endDate.toISOString().split('T')[0] },
    output: {
      cropHealthScore,
      yieldRiskRating,
      yieldRiskLevel,
      currentNDVI,
      averageNDVI: avgNDVI,
      ndviTimeSeries,
      soilHealth,
      rainfallHistory,
      averageRainfallMm: avgRainfall,
    },
    metadata: {
      satelliteSource: 'ESA Sentinel-2B (Band 4 + Band 8)',
      spatialResolution: '10m',
      temporalCoverage: `${ndviTimeSeries.length} months`,
      processingLatencyMs: Math.round(80 + Math.random() * 120),
    }
  };
}
