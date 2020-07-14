const mongo = require('mongodb').MongoClient;

const config = require('./config');

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
    const opts = {
      useUnifiedTopology: true
    };

    mongo.connect(config.db.url(), opts, function (error, db) {
      if (error) {
        reject(error);
      } else {
        global.db = db.db(config.db.name());
        resolve();
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
    randomUserId: getRandomUserQuoteId
  }
};