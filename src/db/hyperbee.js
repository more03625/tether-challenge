const Hyperbee = require('hyperbee');
const feed = require('./hypercore');

const db = new Hyperbee(feed, { keyEncoding: 'utf-8', valueEncoding: 'binary' });

module.exports = db;