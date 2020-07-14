const keys = require('lodash/keys');
const has = require('lodash/has');
const split = require('lodash/split');

const get = require('./get');
const add = require('./add');

const secondary_handlers = {
  '!addquote': add,
  '!quote': get
};

/**
 * Handles the message
 * @param {Object} message The message
 * @returns {undefined}
 */
function handler(message) {
  const parts = split(message.content, ' ', 2);
  const command = parts[0];

  if (has(secondary_handlers, command)) {
    secondary_handlers[command](message);
  }
}

module.exports = {
  commands: keys(secondary_handlers),
  handler: handler
};