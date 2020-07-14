const startsWith = require('lodash/startsWith');
const forEach = require('lodash/forEach');

const config = require('../../utils/config');

const modules = [
  require('./quotes'), //eslint-disable-line global-require
  require('./debug') //eslint-disable-line global-require
];

const starts_with_handlers = {};

modules.forEach(function (module) {
  module.commands.forEach(function (command) {
    starts_with_handlers[command] = module.handler;
  });
});

/**
 * Checks to make sure we care about the meassage based on
 * if we're in production or not
 * @param {Object} message The message
 * @return {Boolean} If we care about the message
 */
function caresAboutMessage(message) {
  const channel = message.channel.id;

  if (
    config.inProduction() &&
    channel !== config.discord.channels.playground()
  ) {
    return true;
  }

  if (
    !config.inProduction() &&
    channel === config.discord.channels.playground()
  ) {
    return true;
  }

  return false;
}

/**
 * Handler for messages
 * @param {object} message The message
 * @returns {undefined}
 */
function messageHandler(message) {
  if (!caresAboutMessage(message)) {
    return;
  }

  forEach(starts_with_handlers, function (fn, key) {
    if (startsWith(message.content, key)) {
      fn(message);
    }
  });
}

module.exports = messageHandler;