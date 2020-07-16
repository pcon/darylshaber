const has = require('lodash/has');
const split = require('lodash/split');

const secondary_handlers = {
  'findchannel': findChannel,
  'finduser': findUser,
  'dump': dumpMessage
};

/**
 * Prints the channel to the console
 * @param {Object} message The message
 * @param {String} name The channel name
 * @returns {undefined}
 */
function findChannel(message, name) {
  const channel = global.client.channels.cache.find(c => c.name === name);

  if (channel) {
    console.log(`ID: ${channel.id}`);
  } else {
    console.log(`Could not find channel named "${name}"`);
  }
}

/**
 * Prints the channel to the console
 * @param {Object} message The message
 * @param {String} username The user name
 * @returns {undefined}
 */
function findUser(message, username) {
  const user = global.client.users.cache.find(u => u.username === username);

  if (user) {
    console.log(`Id: ${user.id} - ${user.username}#${user.discriminator}`);
  } else {
    console.log(`Could not find user named "${username}"`);
  }
}

/**
 * Dumps the message to the console
 * @param {Object} message The message
 * @returns {undefined}
 */
function dumpMessage(message) {
  console.log(message.content);
}

/**
 * Handles the debug message
 * @param {Object} message The message
 * @returns {undefined}
 */
function handler(message) {
  const parts = split(message.content, ' ', 3);
  const secondary_command = parts[1];

  if (has(secondary_handlers, secondary_command)) {
    try {
      secondary_handlers[secondary_command](message, parts[2]);
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = {
  commands: [ '!debug' ],
  handler: handler
};