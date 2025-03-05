const collectPrices = require('./data/collector');
const db = require('./db/hyperbee');
const { errorHandler, successHandler } = require('./utils/response');

async function scheduleDataPipeline() {
  try {
    const prices = await collectPrices();
    if (!prices.success) {
      throw new Error("Failed to fetch prices or empty response");
    }
    console.log('prices ===>', prices);

    // Store latest prices
    await db.put('latest-prices', Buffer.from(JSON.stringify(prices.data), 'utf-8'));

    // Store historical prices with timestamp
    const timestamp = Date.now(); // Current timestamp in milliseconds
    await db.put(`historical-prices:${timestamp}`, Buffer.from(JSON.stringify(prices.data), 'utf-8'));

    return successHandler({ message: 'Latest and historical prices stored successfully' });
  } catch (error) {
    return errorHandler(error)
  }
}

module.exports = scheduleDataPipeline;
