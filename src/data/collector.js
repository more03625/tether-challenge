const axios = require('axios');
const { errorHandler, successHandler } = require('../utils/response');
const fs = require('fs').promises;
const path = require('path');
const { exchange } = require('./mock/exchanges');
const { market } = require('./mock/markets');

async function collectPrices() {
  try {
    // Step 1: Fetch top 3 exchanges by 24h BTC trade volume
    // const exchangesResponse = await axios.get('https://api.coingecko.com/api/v3/exchanges', {
    //   params: { per_page: 3 },
    // });

    const exchangesResponse = exchange
    const topExchanges = exchangesResponse.data
      .sort((a, b) => b.trade_volume_24h_btc - a.trade_volume_24h_btc)
      .map((exchange) => exchange.id); // Extract top 3 exchange IDs

    console.log("Top 3 Exchanges:", topExchanges);

    // Step 2: Fetch top 5 cryptocurrencies by market cap
    // const marketResponse = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
    //   params: {
    //     vs_currency: 'usd',
    //     order: 'market_cap_desc',
    //     per_page: 5,
    //     page: 1,
    //     sparkline: false,
    //   },
    // });

    const marketResponse = market

    const topCoins = marketResponse.data.map((coin) => coin.id);
    console.log("Top 5 Coins:", topCoins);

    let result = [];

    // Step 3: Fetch price data from the top 3 exchanges for each crypto
    for (const coin of topCoins) {
      // const tickersResponse = await axios.get(`https://api.coingecko.com/api/v3/coins/${coin}/tickers`);
      const tickersResponse = await getCoinData(coin);

      const exchangePrices = tickersResponse.data.tickers
        .filter((ticker) => ticker.target === 'USDT' && topExchanges.includes(ticker.market.identifier)) // Match only top exchanges
        .slice(0, 3) // Take prices from top 3 exchanges
        .map((ticker) => ({ exchange: ticker.market.name, price: ticker.last }));

      const prices = exchangePrices.map((entry) => entry.price);
      const averagePrice = prices.length ? prices.reduce((sum, price) => sum + price, 0) / prices.length : null;

      result.push({
        coin,
        average_price: averagePrice,
        exchanges: exchangePrices,
      });
    }

    // Mock Result here
    return successHandler(result);
  } catch (error) {
    return errorHandler(error)
  }
}

//  Function to get coins data from file, to save api calls.
async function getCoinData(coin) {
  const filePath = path.join(__dirname, 'mock', `${coin}.json`);

  try {
    // Check if cached file exists
    const fileData = await fs.readFile(filePath, 'utf-8');
    console.log(`Loaded ${coin} data from cache.`);
    return JSON.parse(fileData);
  } catch (error) {
    // If file doesn't exist, fetch data from API
    console.log(`Fetching ${coin} data from API...`);
    const tickersResponse = await axios.get(`https://api.coingecko.com/api/v3/coins/${coin}/tickers`);

    // Save response to file
    await fs.writeFile(filePath, JSON.stringify(tickersResponse.data), 'utf-8');

    return tickersResponse.data;
  }
}

collectPrices().then((data) => console.log(JSON.stringify(data, null, 2)));

module.exports = collectPrices;
