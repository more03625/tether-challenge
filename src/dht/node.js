// src/dht/node.js

const DHT = require('hyperdht');
const crypto = require('crypto');

async function startDHTNode() {
  const node = new DHT({
    bootstrap: ['127.0.0.1:30001'],
    port: 61655,
    host: '127.0.0.1',
  });

  const keyPair = DHT.keyPair();
  await new Promise(resolve => {
    node.on('listening', () => {
      console.log('Regular node listening on port 61655');
      resolve();
    });
  });
}

module.exports = startDHTNode;
