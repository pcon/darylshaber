const config = require('dotenv').config();

const COLLECTION_QUOTES = 'quotes';

/**
 * Gets the mongo db url
 * @returns {String} The db url
 */
function getDbUrl() {
  return process.env.DB_URL;
}

/**
 * Gets the db name
 * @returns {String} The db name
 */
function getDbName() {
  return process.env.DB_NAME;
}

/**
 * Gets the discord token
 * @returns {String} The discord token
 */
function getDiscordToken() {
  return process.env.DISCORD_TOKEN;
}

/**
 * Gets the discord playground channel
 * @returns {String} The playground channel id
 */
function getPlaygroundChannel() {
  return process.env.DISCORD_PLAYGROUND;
}

/**
 * Checks to see if the environment file was
 * loaded and if not prints any error messages
 * @returns {undefined}
 */
function check() {
  if (
    !inProduction() &&
    config.error
  ) {
    console.error(config.error);
  }
}

/**
 * If the bot is running in production
 * @returns {Boolean} if the bot is in production
 */
function inProduction() {
  return process.env.NODE_ENV === 'production';
}

module.exports = {
  check: check,
  db: {
    url: getDbUrl,
    name: getDbName,
    collections: {
      quotes: COLLECTION_QUOTES
    }
  },
  discord: {
    token: getDiscordToken,
    channels: {
      playground: getPlaygroundChannel
    }
  },
  inProduction: inProduction
};