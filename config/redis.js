const Redis = require('ioredis');
const logger = require('./logger');

const redis = new Redis(process.env.REDIS_HOST);
logger.info('redis connected')
module.exports = redis;
