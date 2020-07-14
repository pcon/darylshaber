const config = require('./utils/config');
config.check();

const db = require('./utils/db');
const discord = require('./utils/discord');
const web = require('./utils/web');

db.connect()
  .then(discord.connect)
  .then(web.start)
  .catch(console.error);
