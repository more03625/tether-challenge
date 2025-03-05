const RPC = require('@hyperswarm/rpc');

async function fetchPrices(serverPublicKey) {
  try {
    const rpc = new RPC();
    const client = rpc.connect(serverPublicKey);

    // Request latest prices
    const payloadLatest = { pairs: ['BTC-USDt', 'ETH-USDt'] };
    const responseLatest = await client.request('getLatestPrices', Buffer.from(JSON.stringify(payloadLatest), 'utf-8'));
    console.log('Latest Prices:', JSON.parse(responseLatest.toString('utf-8')));

    // Request historical prices (last 24 hours)
    const from = Date.now() - 24 * 60 * 60 * 1000; // 24 hours ago
    const to = Date.now();
    const payloadHistorical = { pairs: ['BTC-USDt', 'ETH-USDt'], from, to };
    const responseHistorical = await client.request('getHistoricalPrices', Buffer.from(JSON.stringify(payloadHistorical), 'utf-8'));
    console.log('Historical Prices:', JSON.parse(responseHistorical.toString('utf-8')));
    
  } catch (error) {
    console.error('Error calling RPC:', error);
  }
}

// Call fetchPrices with the correct public key
module.exports = {
    fetchPrices
}
