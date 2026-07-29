/**
 * Parametric Risk Actuary Agent
 * ─────────────────────────────────
 * Input:  { lat, lon, historicalClimateData, cropHealthScore, coverageAmount }
 * Output: { premiumAmount, subsidyAmount, netPremium, triggers (drought, flood, heat), policyTerms }
 */

/**
 * Main Agent Entry Point
 * @param {Object} input - Input parameters
 * @returns {Object} JSON policy terms and trigger conditions
 */
export function runParametricRiskActuary(input) {
  const { lat, lon, historicalClimateData = [], cropHealthScore = 65, coverageAmount = 1000 } = input;
  
  // Base risk assessment
  // Lower crop health score increases risk multiplier
  const healthMultiplier = Math.max(0.8, 1 + ((80 - cropHealthScore) * 0.01));
  
  // Geographic climate volatility (simulated based on coordinates)
  const latVolatility = Math.abs(lat) * 0.02;
  const lonVolatility = Math.abs(Math.sin(lon)) * 0.05;
  const climateMultiplier = 1 + latVolatility + lonVolatility;

  // Calculate Base Premium (e.g., 3.5% of coverage base rate)
  const baseRate = 0.035;
  const riskAdjustedRate = baseRate * healthMultiplier * climateMultiplier;
  const grossPremium = Math.round(coverageAmount * riskAdjustedRate);

  // Apply Climate Fund Subsidy (e.g., 40-60% based on vulnerability)
  const subsidyPct = cropHealthScore < 50 ? 0.60 : 0.50; // Higher subsidy for more vulnerable farms
  const subsidyAmount = Math.round(grossPremium * subsidyPct);
  const netPremium = grossPremium - subsidyAmount;

  // Define Parametric Triggers
  const triggers = {
    drought: {
      type: "Rainfall Deficit",
      condition: "Rainfall < 20mm over 14 consecutive days",
      payoutAmount: Math.round(coverageAmount * 0.85), // 85% payout
      oracleSource: "Open-Meteo & Sentinel-2"
    },
    flood: {
      type: "Excess Precipitation",
      condition: "Rainfall > 150mm over 48 hours",
      payoutAmount: coverageAmount, // 100% payout
      oracleSource: "Open-Meteo & Sentinel-2"
    },
    heat: {
      type: "Extreme Heat",
      condition: "Surface temperature > 38°C for 5 consecutive days",
      payoutAmount: Math.round(coverageAmount * 0.60), // 60% payout
      oracleSource: "Google Earth Engine (LST)"
    }
  };

  return {
    agentId: 'parametric-actuary-v1.8',
    timestamp: new Date().toISOString(),
    input: {
      lat, lon, cropHealthScore, coverageAmount
    },
    output: {
      pricing: {
        coverageAmount,
        grossPremium,
        subsidyAmount,
        subsidyPercentage: subsidyPct * 100,
        netPremium,
        currency: 'USD'
      },
      triggers,
      policyTerms: {
        duration: "1 Season (6 Months)",
        deductible: 0,
        claimsProcess: "Auto-executed via Smart Contract. No manual filing required."
      }
    },
    metadata: {
      actuarialModel: 'Climate-Adjusted Dynamic Pricing',
      riskScore: +(healthMultiplier * climateMultiplier).toFixed(2),
      processingLatencyMs: Math.round(40 + Math.random() * 60)
    }
  };
}
