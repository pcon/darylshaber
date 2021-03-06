const mongo = require('mongodb').MongoClient;

const config = require('./config');
const isempty = require('lodash/isEmpty');

const DEFAULT_OPTS = {
  useUnifiedTopology: true
};

/**
 * Adds a quote to the database
 * @param {Object} quote The quote
 * @returns {Promise} A promise for when the quote has been added
 */
function addQuote(quote) {
  return new Promise(function (resolve, reject) {
    global.db.collection(config.db.collections.quotes).insertOne(quote, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

/**
 * Gets a random sample for given options
 * @param {Function} resolve The resolve function
 * @param {Function} reject The reject function
 * @param {Object} opts The options
 * @returns {undefined}
 */
function getRandomSample(resolve, reject, opts) {
  const global_opts = [
    opts,
    {
      $sample: {
        size: 1
      }
    }
  ];
  global.db.collection(config.db.collections.quotes).aggregate(global_opts)
    .toArray(function (err, docs) {
      if (err) {
        reject(err);
      } else {
        resolve(docs[0]);
      }
    });
}

/**
 * Gets a random quote for a given channel
 * @param {String} channel The channel id
 * @returns {Promise} A promise for the quote
 */
function getRandomQuote(channel) {
  return new Promise(function (resolve, reject) {
    const opts = {
      $match: {
        channel: channel
      }
    };

    getRandomSample(resolve, reject, opts);
  });
}

/**
 * Gets a random quote for a user
 * @param {String} channel The channel id
 * @param {Promise} user The user identifier
 * @returns {Promise} A promise for the quote
 */
function getRandomUserQuote(channel, user) {
  return new Promise(function (resolve, reject) {
    const opts = {
      $match: {
        quotee: user,
        channel: channel
      }
    };

    getRandomSample(resolve, reject, opts);
  });
}

/**
 * Gets a random quote for a user
 * @param {String} channel The channel id
 * @param {Promise} id The user identifier
 * @returns {Promise} A promise for the quote
 */
function getRandomUserQuoteId(channel, id) {
  return new Promise(function (resolve, reject) {
    const opts = {
      $match: {
        quotee_id: id,
        channel: channel
      }
    };

    getRandomSample(resolve, reject, opts);
  });
}

/**
 * Connects to the database
 * @returns {Promise} A promise for when the database connects
 */
function connect() {
  return new Promise(function (resolve, reject) {
    mongo.connect(config.db.url(), DEFAULT_OPTS, function (error, db) {
      if (error) {
        reject(error);
      } else {
        global.db = db.db(config.db.name());
        resolve();
      }
    });
  });
}

/**
 * Connects to the database and inserts multiple records
 * @param {Object[]} records The records to insert
 * @param {String} collection The collection to insert into
 * @returns {Promise} A promise for when the records have been updated
 */
function connectAndInsertMany(records, collection) {
  return new Promise(function (resolve, reject) {
    if (isempty(records)) {
      resolve({
        insertedCount: 0
      });
      return;
    }

    mongo.connect(config.db.url(), function (error, db) {
      if (error) {
        reject(error);
      } else {
        const db_collection = db.db(config.db.name()).collection(collection);

        try {
          db_collection.insertMany(records, function (insert_error, results) {
            if (insert_error) {
              reject(insert_error);
            } else {
              resolve(results);
            }
          });
        } catch (insert_error) {
          reject(insert_error);
        }
      }
    });
  });
}

/**
 * Find quotes for a given query
 * @param {Object} query The query
 * @return {Promise<Object[]>|Error} The results
 */
function findQuotes(query) {
  return new Promise(function (resolve, reject) {
    global.db.collection(config.db.collections.quotes)
      .find(query)
      .toArray(function (error, results) {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
  });
}

/**
 * Updates multiple records
 * @param {Object} query The query
 * @param {Object} value The new value to set
 * @returns {Promise<Object[]>|Error} A promise for the results
 */
function updateMany(query, value) {
  return new Promise(function (resolve, reject) {
    global.db.collection(config.db.collections.quotes)
      .updateMany(query, value, function (error, results) {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
  });
}

module.exports = {
  connect: connect,
  quote: {
    add: addQuote,
    random: getRandomQuote,
    randomUser: getRandomUserQuote,
    randomUserId: getRandomUserQuoteId,
    find: findQuotes,
    updateMany: updateMany
  },
  utils: {
    connectAndInsertMany: connectAndInsertMany
  }
};