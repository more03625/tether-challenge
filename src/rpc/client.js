const RPC = require('@hyperswarm/rpc');

async function fetchPrices(serverPublicKey) {
  try {
    const rpc = new RPC();
    const client = rpc.connect(serverPublicKey);

    // Request latest prices
    const payloadLatest = { pairs: ['BTC-USDt', 'ETH-USDt'] };
    const responseLatest = await client.request('getLatestPrices', Buffer.from(JSON.stringify(payloadLatest), 'utf-8'));

    // Convert Buffer to JSON
    const latestPricesRaw = responseLatest.toString('utf-8');
    const latestPrices = JSON.parse(latestPricesRaw);

    if (latestPrices?.value?.type === 'Buffer') {
      latestPrices.value = JSON.parse(Buffer.from(latestPrices.value.data).toString('utf-8'));
    }

    console.log('Decoded Latest Prices:', latestPrices);

    // Request historical prices
    const from = Date.now() - 24 * 60 * 60 * 1000; // 24 hours ago
    const to = Date.now();
    const payloadHistorical = { pairs: ['BTC-USDt', 'ETH-USDt'], from, to };
    const responseHistorical = await client.request('getHistoricalPrices', Buffer.from(JSON.stringify(payloadHistorical), 'utf-8'));

    const historicalPricesRaw = responseHistorical.toString('utf-8');
    console.log('Historical Prices (Raw):', historicalPricesRaw); // Debug

    let historicalPrices = null;
    if (historicalPricesRaw !== 'null') {
      historicalPrices = JSON.parse(historicalPricesRaw);

      if (historicalPrices?.value?.type === 'Buffer') {
        historicalPrices.value = JSON.parse(Buffer.from(historicalPrices.value.data).toString('utf-8'));
      }
    }

    console.log('Decoded Historical Prices:', historicalPrices);
  } catch (error) {
    console.error('Error calling RPC:', error);
  }
}


// Call fetchPrices with the correct public key
module.exports = {
  fetchPrices
}
