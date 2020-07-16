const {
  program
} = require('@caporal/core');
const fs = require('fs');
const path = require('path');
const has = require('lodash/has');

const db = require('../utils/db');

const user_map = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/usermap.json'), 'utf8'));

/**
 * Check the options and assign them to global variables
 * @param {Object} options The options
 * @returns {Promise<undefined|Error>} A promise for when the check has been done
 */
function checkAndAssignOptions(options) {
  return new Promise(function (resolve, reject) {
    if (!options.nick) {
      reject(new Error('Nick is required'));
      return;
    }

    global.target_nick = options.nick;

    if (!has(user_map, global.target_nick)) {
      reject(new Error('Could not find id for nick'));
      reject;
    }

    global.target_id = user_map[global.target_nick];

    resolve();
  });
}

/**
 * Finds quotes the user quoted
 * @returns {Promise<Object[]|Error>} A promise for updated results
 */
function updateQuoter() {
  return new Promise(function (resolve, reject) {
    const query = {
      quoter: global.target_nick
    };

    const value = {
      $set: {
        quoter_id: global.target_id
      }
    };

    const updateQuotes = db.quote.updateMany.bind(null, query, value);

    db.connect()
      .then(updateQuotes)
      .then(resolve)
      .catch(reject);
  });
}

/**
 * Finds quotes the user is the quotee
 * @returns {Promise<Object[]|Error>} A promise for updated results
 */
function updateQuotee() {
  return new Promise(function (resolve, reject) {
    const query = {
      quotee: global.target_nick
    };

    const value = {
      $set: {
        quotee_id: global.target_id
      }
    };

    const updateQuotes = db.quote.updateMany.bind(null, query, value);

    db.connect()
      .then(updateQuotes)
      .then(resolve)
      .catch(reject);
  });
}

/**
 * Runs the program
 * @param {Object} cmd The caporal command
 * @returns {undefined}
 */
function act(cmd) {
  return new Promise(function (resolve, reject) {
    checkAndAssignOptions(cmd.options)
      .then(updateQuoter)
      .then(updateQuotee)
      .then(function () {
        process.exit();
      })
      .catch(reject);
  });
}

program
  .option('--nick <nick>', 'The nick to find in the database')
  .action(act);

program.run();