const Hypercore = require('hypercore');
const ram = require('random-access-memory');

const feed = new Hypercore(ram);

module.exports = feed;
