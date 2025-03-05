const DHT = require('hyperdht');

async function startDHTBootstrap() {
  const bootstrapNode = new DHT({
    bootstrap: [],
    port: 30001,
    host: '127.0.0.1',
  });

  return new Promise(resolve => {
    bootstrapNode.on('listening', () => {
      console.log('Bootstrap node listening on port 30001');
      resolve();
    });
  });
}

module.exports = startDHTBootstrap;
