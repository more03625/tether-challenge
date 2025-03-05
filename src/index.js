const startDHTBootstrap = require('./dht/bootstrap');
const scheduleDataPipeline = require('./scheduler');
const startDHTNode = require('./dht/node');
const { getRPCServerPublicKey } = require('./rpc/server');
const logger = require('./utils/logging');
const { fetchPrices } = require('./rpc/client');

async function main() {
    try {
        await startDHTBootstrap();
        await startDHTNode()
        // await scheduleDataPipeline();
        const publicKey = await getRPCServerPublicKey();
        await fetchPrices(publicKey);

        // Start the scheduled execution
        scheduleRecurringDataPipeline(publicKey);
    } catch (error) {
        console.error('Error starting the application:', error);
    }
}

// Function to schedule execution without overlapping tasks
async function scheduleRecurringDataPipeline(publicKey) {
    while (true) {
        try {
            const response = await scheduleDataPipeline();
            if (!response.success) {
                throw response.error
            }
            logger.info('Data has been added in hyperbee');
            await fetchPrices(publicKey);
        } catch (error) {
            logger.error('Error in scheduled data pipeline:', { error });
        }
        await new Promise((resolve) => setTimeout(resolve, 30000)); // 30 seconds delay
    }
}

async function runMain() {
    try {
        await main();
        console.log('Bootstrap node started successfully.');
    } catch (error) {
        console.error('Error starting bootstrap node:', error);
    }
}

runMain();