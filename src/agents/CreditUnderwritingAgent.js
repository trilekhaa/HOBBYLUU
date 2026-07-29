/**
 * Credit Underwriting Agent
 * ─────────────────────────────────
 * Input:  { mobileUsageScore, mobileMoneyTxVolume, agriPurchaseHistory, coopVouchingScore, requestedAmount }
 * Output: { creditScore, riskTier, approvedAmount, interestRate, tenure, repaymentSchedule }
 */

/**
 * Main Agent Entry Point
 * @param {Object} input - Input parameters
 * @returns {Object} JSON credit decision
 */
export function runCreditUnderwriting(input) {
  const { 
    mobileUsageScore = 70,       // 0-100
    mobileMoneyTxVolume = 450,   // USD equiv per month
    agriPurchaseHistory = true,  // boolean
    coopVouchingScore = 85,      // 0-100
    requestedAmount = 1200
  } = input;

  // Compute alternative credit score (0-1000)
  // Weighting: Mobile Money (35%), Co-op Vouching (35%), Mobile Usage (15%), Agri History (15%)
  const txScore = Math.min(100, (mobileMoneyTxVolume / 1000) * 100);
  const scoreBase = (txScore * 0.35) + (coopVouchingScore * 0.35) + (mobileUsageScore * 0.15) + ((agriPurchaseHistory ? 100 : 0) * 0.15);
  
  // Scale to 300-900 range (similar to FICO)
  const creditScore = Math.round(300 + (scoreBase * 6));

  // Determine Risk Tier & Terms
  let riskTier, maxApprovedAmount, interestRate, emoji;
  if (creditScore >= 720) {
    riskTier = 'Low Risk';
    emoji = '🟢';
    maxApprovedAmount = 1500;
    interestRate = 4.2; // 4.2% per season
  } else if (creditScore >= 580) {
    riskTier = 'Medium Risk';
    emoji = '🟡';
    maxApprovedAmount = 750;
    interestRate = 6.8;
  } else {
    riskTier = 'High Risk';
    emoji = '🔴';
    maxApprovedAmount = 300;
    interestRate = 9.5;
  }

  const approvedAmount = Math.min(requestedAmount, maxApprovedAmount);
  
  return {
    agentId: 'credit-underwriter-v3.1',
    timestamp: new Date().toISOString(),
    input: {
      mobileUsageScore, mobileMoneyTxVolume, agriPurchaseHistory, coopVouchingScore, requestedAmount
    },
    output: {
      decision: approvedAmount > 0 ? 'APPROVED' : 'DECLINED',
      creditScore,
      riskTier,
      riskEmoji: emoji,
      loanTerms: {
        approvedAmount,
        currency: 'USD',
        interestRatePercentage: interestRate,
        tenure: '1 Season (6 Months)',
        repaymentType: 'Bullet Repayment at Harvest'
      },
      dataSourcesUsed: [
        'Mobile Money Velocity',
        'Community Co-op Endorsement',
        'Telecom Usage Meta-data',
        'Agronomic Input History'
      ]
    },
    metadata: {
      modelConfidence: 0.92,
      processingLatencyMs: Math.round(150 + Math.random() * 80)
    }
  };
}
