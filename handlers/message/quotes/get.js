const split = require('lodash/split');
const trim = require('lodash/trim');

const dbUtils = require('../../../utils/db');
const quoteUtils = require('../../../utils/quotes');
const msgUtils = require('../../../utils/discord/message');

/**
 * Gets a random quote
 * @param {Object} message The message
 * @returns {undefined}
 */
function randomQuote(message) {
  const outputter = quoteUtils.outputQuote.bind(null, message);

  dbUtils.quote.random(message.channel.id)
    .then(outputter)
    .catch(console.error);
}

/**
 * Gets a random quote
 * @param {Object} message The message
 * @param {Object} user The user
 * @returns {undefined}
 */
function randomUserQuoteId(message, user) {
  const outputter = quoteUtils.outputQuote.bind(null, message);

  dbUtils.quote.randomUserId(message.channel.id, user)
    .then(outputter)
    .catch(console.error);
}

/**
 * Gets a random quote
 * @param {Object} message The message
 * @param {Object} user The user
 * @returns {undefined}
 */
function randomUserQuote(message, user) {
  const outputter = quoteUtils.outputQuote.bind(null, message);

  dbUtils.quote.randomUser(message.channel.id, user)
    .then(outputter)
    .catch(console.error);
}

/**
 * Prints a quote to the channel the message came from
 * @param {Object} message The message
 * @returns {undefined}
 */
function handler(message) {
  if (message.channel.type !== 'text') {
    message.reply('Sorry, can only use quotes in text channels');
    return;
  }

  if (trim(message.content) === '!quote') {
    randomQuote(message);
    return;
  }

  const parts = split(message.content, ' ', 2);
  const user_identifier = msgUtils.getUserId(parts[1]);

  if (user_identifier) {
    randomUserQuoteId(message, user_identifier);
    return;
  }

  randomUserQuote(message, parts[1]);
}

module.exports = handler;