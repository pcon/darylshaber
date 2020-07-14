const express = require('express');

/**
 * Spit out some information so we can keep the dyno alive
 * @param {Object} req The request
 * @param {Object} res The result
 * @returns {undefined}
 */
function root(req, res) {
  const data = {
    timestamp: Date.now()
  };

  res.json(data);
}

/**
 * Starts the webserver
 * @returns {undefined}
 */
function start() {
  return new Promise(function (resolve) {
    const port = process.env.PORT || 8080;

    const app = express();

    app.get('/', root);
    app.listen(port, function () {
      console.log('HTTP server started');
      resolve();
    });
  });
}

module.exports = {
  start: start
};