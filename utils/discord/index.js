const Discord = require('discord.js');
const forEach = require('lodash/forEach');

const config = require('../config');

const handlers = {
  'message': require('../../handlers/message') //eslint-disable-line global-require
};

/**
 * Connects to the discord server and sets up the handlers
 * @returns {Promise} A promise for when discord has been connected
 */
function connect() {
  return new Promise(function (resolve, reject) {
    global.client = new Discord.Client();

    global.client.on('ready', function () {
      console.log(`Logged in as ${global.client.user.tag}`);
    });

    forEach(handlers, function (fn, key) {
      global.client.on(key, fn);
    });

    global.client.login(config.discord.token())
      .then(resolve)
      .catch(reject);
  });
}

module.exports = {
  connect: connect
};