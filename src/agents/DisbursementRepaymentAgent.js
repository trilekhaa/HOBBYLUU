/**
 * Disbursement & Repayment Agent
 * ─────────────────────────────────
 * Input:  { eventType ('loan' | 'insurance_payout'), amount, recipientPhone, isOnline }
 * Output: { transactionId, status, networkLatencyMs, scheduledRepayment }
 */

// Mock M-Pesa API SDK
const MpesaEdgeSDK = {
  async triggerB2CPayment(phone, amount, isOnline) {
    return new Promise((resolve) => {
      // Simulate sub-second edge processing
      const baseLatency = isOnline ? 250 : 0; // Offline queues instantly locally
      const jitter = Math.random() * 150;
      const totalLatencyMs = Math.round(baseLatency + jitter);
      
      setTimeout(() => {
        resolve({
          txHash: `MPESA-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random()*1000)}`,
          status: isOnline ? 'CONFIRMED' : 'QUEUED_OFFLINE',
          networkLatencyMs: totalLatencyMs
        });
      }, totalLatencyMs);
    });
  }
};

/**
 * Main Agent Entry Point
 * @param {Object} input - Input parameters
 * @returns {Promise<Object>} JSON transaction details
 */
export async function runDisbursementAgent(input) {
  const { 
    eventType = 'loan', 
    amount, 
    recipientPhone = '+254700000000',
    isOnline = true,
    interestRate = 0
  } = input;

  // Trigger Mock Mobile Money API
  const paymentResult = await MpesaEdgeSDK.triggerB2CPayment(recipientPhone, amount, isOnline);

  // Schedule Repayment (if it's a loan)
  let scheduledRepayment = null;
  if (eventType === 'loan') {
    const totalDue = amount * (1 + (interestRate / 100));
    // Assume harvest is 6 months from now
    const harvestDate = new Date();
    harvestDate.setMonth(harvestDate.getMonth() + 6);
    
    scheduledRepayment = {
      collectionDate: harvestDate.toISOString().split('T')[0],
      amountDue: +totalDue.toFixed(2),
      collectionMethod: 'Auto-deduction via Smart Contract upon Harvest Sale'
    };
  }

  return {
    agentId: 'disbursement-gateway-v4.0',
    timestamp: new Date().toISOString(),
    input: {
      eventType, amount, recipientPhone, isOnline
    },
    output: {
      transactionId: paymentResult.txHash,
      status: paymentResult.status,
      disbursementMethod: isOnline ? 'Edge Mobile Gateway (M-Pesa)' : 'Local Cache (Sync Pending)',
      amountDisbursed: amount,
      currency: 'USD',
      scheduledRepayment
    },
    metadata: {
      networkLatencyMs: paymentResult.networkLatencyMs,
      edgeNodeId: 'node-kitale-07'
    }
  };
}
