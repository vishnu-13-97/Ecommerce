const Redis = require('ioredis');
const logger = require('./logger');

const redis = new Redis(process.env.REDIS_HOST);
logger.info('redis connected on port')
module.exports = redis;
