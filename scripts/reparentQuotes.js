const {
  program
} = require('@caporal/core');

const db = require('../utils/db');

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

    if (!options.id) {
      reject(new Error('Id is required'));
      return;
    }

    global.target_nick = options.nick;
    global.target_id = options.id;
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
        quoter_id: `${global.target_id}`
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
        quotee_id: `${global.target_id}`
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
      .then(resolve)
      .catch(reject);
  });
}

program
  .option('--nick <nick>', 'The nick to find in the database')
  .option('--id <id>', 'The user id to reparent to')
  .action(act);

program.run();