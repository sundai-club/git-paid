const axios = require('axios');

// Configure Radius API client with base URL and auth
const radiusApi = axios.create({
  baseURL: process.env.RADIUS_API_URL,
  headers: {
    'Authorization': `Bearer ${process.env.RADIUS_API_KEY}`
  }
});

// Lock funds in escrow
async function createEscrow(fromId, amount) {
  const response = await radiusApi.post('/escrow', {
    from: fromId,
    amount: amount,
    currency: 'USD'
  });
  return response.data.escrow_id;
}

// Release funds to developer
async function releaseEscrow(escrowId, toId) {
  const response = await radiusApi.post(`/escrow/${escrowId}/release`, {
    to: toId
  });
  return response.data;
}

// Refund funds back to owner
async function refundEscrow(escrowId, toId) {
  const response = await radiusApi.post(`/escrow/${escrowId}/refund`, {
    to: toId
  });
  return response.data;
}

module.exports = { createEscrow, releaseEscrow, refundEscrow };
