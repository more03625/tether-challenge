const cron = require('node-cron');
const readline = require('readline');

const scheduleDataPipeline = require('./scheduler');
const { getRPCServerPublicKey } = require('./rpc/server');
const { fetchPrices } = require('./rpc/client');

// Function to execute the data pipeline
async function executePipeline() {
    console.log("Executing data pipeline...");
    await scheduleDataPipeline();
    const publicKey = await getRPCServerPublicKey();
    await fetchPrices(publicKey);
}

// Schedule the function to run every 30 seconds
cron.schedule('*/1 * * * *', async () => {
    console.log("Running scheduled data pipeline...");
    await executePipeline();
});

// Allow manual execution via CLI
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', async (input) => {
    if (input.trim() === 'run') {
        console.log("Manually executing data pipeline...");
        await executePipeline();
    }
});

console.log("Scheduler started. Type 'run' and press Enter to execute manually.");