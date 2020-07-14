const split = require('lodash/split');

const dbUtils = require('../../../utils/db');
const quoteUtils = require('../../../utils/quotes');

/**
 * Adds a quote from a URL
 * @param {Object} message The message
 * @param {Object} matcher The match
 * @returns {undefined}
 */
function addFromURL(message, matcher) {
  const message_id = matcher[3];

  message.channel.messages.fetch(message_id)
    .then(function (old_message) {
      if (old_message.author.bot) {
        message.reply('Sorry, I can\'t quote a bot');
        return;
      }

      const quote = {
        quote: old_message.content,
        channel: old_message.channel.id,
        quotee_id: old_message.author.id,
        quotee: old_message.author.username,
        quoter_id: message.author.id,
        quoter: message.author.username,
        timestamp: old_message.createdTimestamp
      };

      dbUtils.quote.add(quote)
        .then(function () {
          quoteUtils.outputQuote(message, quote);
        }).catch(console.error);
    }).catch(console.error);
}

/**
 * Adds a quote
 * @param {Object} message The message
 * @returns {undefined}
 */
function handler(message) {
  if (message.channel.type !== 'text') {
    message.reply('Sorry, can only use quotes in text channels');
    return;
  }

  const parts = split(message.content, ' ', 2);

  if (parts.length === 2) {
    const link_matcher = parts[1].match(/https?:\/\/discordapp\.com\/channels\/([0-9]+)\/([0-9]+)\/([0-9]+)\/?/);

    if (link_matcher) {
      addFromURL(message, link_matcher);
      return;
    }
  }

  message.reply('I\'m not very smart yet.  Please be patient');
}

module.exports = handler;