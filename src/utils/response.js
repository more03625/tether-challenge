const logger = require('./logging');

const errorHandler = (error) => {
    return {
        success: false,
        error: error.message || '',
    };
};

const successHandler = (data) => {
    return {
        success: true,
        data,
    };
};

function logAxiosError(error, contextMessage = 'Error fetching data') {
    if (error.response) {
        logger.error(`${contextMessage}: ${error.response.status} - ${error.response.statusText}`);
    } else {
        logger.error(`${contextMessage}: ${error.message}`);
    }
}

module.exports = {
    errorHandler,
    successHandler,
    logAxiosError
}