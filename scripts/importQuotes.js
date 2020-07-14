const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const mongo = require('mongodb').MongoClient;

const has = require('lodash/has');
const isempty = require('lodash/isEmpty');
const lowercase = require('lodash/toLower');

const config = require('../config');
const channel_map = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/channelmap.json'), 'utf8'));
const user_map = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/usermap.json'), 'utf8'));

const records = [];

/**
 * Add user data to the object
 * @param {Object} obj The object to write to the database
 * @param {Object} data The source object
 * @returns {undefined}
 */
function addUserData(obj, data) {
  const quotee = lowercase(data.quotee);
  const quoter = lowercase(data.quoter);

  obj.quotee = quotee;
  obj.quoter = quoter;

  if (has(user_map, quotee)) {
    obj.quotee_id = user_map[quotee];
  }

  if (has(user_map, quoter)) {
    obj.quoter_id = user_map[quoter];
  }
}

/**
 * Handles the data
 * @param {Object} data The quote data
 * @returns {undefined}
 */
function dataHandler(data) {
  const channel = lowercase(data.channel);
  console.log(channel);

  if (!has(channel_map, channel)) {
    return;
  }

  const obj = {
    quote: data.quote,
    timestamp: moment(data.timestamp).unix() * 1000,
    channel: channel_map[channel]
  };

  addUserData(obj, data);
  records.push(obj);
}

/**
 * End handler
 * @returns {undefined}
 */
function endHandler() {
  if (!isempty(records)) {
    mongo.connect(config.database.url, function (error, db) {
      if (error) {
        console.log(error);
      } else {
        const discord = db.db(config.database.name).collection('quotes');
        try {
          discord.insertMany(records, function (err, results) {
            if (err) {
              console.error(err);
            } else {
              console.log(results.insertedCount);
              db.close();
            }
          });
        } catch (err) {
          console.error(err);
        }
      }
    });
  } else {
    console.log('No records to insert');
  }
}

fs.createReadStream(path.join(__dirname, '../data/quotes.csv'))
  .pipe(csv())
  .on('data', dataHandler)
  .on('end', endHandler)
  .on('error', console.error);