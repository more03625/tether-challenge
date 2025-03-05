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

module.exports = {
    errorHandler,
    successHandler
}