const discord = require('discord.js');

/**
 * Outputs the quote to the message's channel
 * @param {Object} message The initial message
 * @param {Object} quote The quote
 * @returns {undefined}
 */
function outputQuote(message, quote) {
  if (!quote) {
    message.reply('Unable to find a quote');
  } else {
    message.channel.send(formatQuote(message.guild, quote));
  }
}

/**
 * Formats a quote for output
 * @param {Object} guild The guild
 * @param {Object} quote The quote
 * @returns {String|Object} The formatted quote
 */
function formatQuote(guild, quote) {
  const guild_user = guild.members.cache.find(u => u.id === quote.quotee_id);
  const quote_user = guild_user ? guild_user.user : global.client.users.cache.find(u => u.id === quote.quotee_id);

  const msg = new discord.MessageEmbed()
    .setDescription(quote.quote)
    .setTimestamp(quote.timestamp);

  if (quote_user) {
    const display_name = guild_user ? guild_user.displayName : quote_user.username;
    msg.setFooter(display_name, quote_user.avatarURL());
  } else {
    msg.setFooter(quote.quotee);
  }

  return msg;
}

module.exports = {
  formatQuote: formatQuote,
  outputQuote: outputQuote
};