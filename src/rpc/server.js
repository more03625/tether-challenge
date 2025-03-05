// src/rpc/server.js

const RPC = require('@hyperswarm/rpc');
const DHT = require('hyperdht');
const db = require('../db/hyperbee');

let server;

async function startRPCServer() {
  const dht = new DHT({
    bootstrap: ['127.0.0.1:30001'],
    port: 40001,
  });

  const rpc = new RPC();
  server = rpc.createServer();

  await server.listen();
  console.log('RPC server started listening on public key:', server.publicKey.toString('hex'));

  // Bind handlers to RPC server
  server.respond('getLatestPrices', async (reqRaw) => {
    const req = JSON.parse(reqRaw.toString('utf-8'));
    const latestPrices = await db.get('latest-prices');
    const respRaw = Buffer.from(JSON.stringify(latestPrices), 'utf-8');
    return respRaw;
  });

  server.respond('getHistoricalPrices', async (reqRaw) => {
    const req = JSON.parse(reqRaw.toString('utf-8'));
    const historicalPrices = await db.get('historical-prices');
    const respRaw = Buffer.from(JSON.stringify(historicalPrices), 'utf-8');
    return respRaw;
  });

  // const client = rpc.connect(server.publicKey);

  // const payload = { pairs: ['BTC-USDt', 'ETH-USDt'] };
  // const payloadRaw = Buffer.from(JSON.stringify(payload), 'utf-8');
  // const respRaw = await rpc.request(server.publicKey, 'getLatestPrices', payloadRaw);
  // const clientRes = await client.request('getLatestPrices', Buffer.from(payloadRaw));


  // const resp = JSON.parse(respRaw.toString('utf-8'));

  // console.log('resp =========>', resp);
  // console.log('clientRes =========>', JSON.parse(clientRes.toString('utf-8')));
}

async function getRPCServerPublicKey() {
  if (!server) {
    await startRPCServer();
  }
  return server.publicKey;
}

module.exports = { startRPCServer, getRPCServerPublicKey };
