'use strict';
require('dotenv').config();
const internal = require('./services/internal');
const bot_timeout = Number(process.env.BOT_TIMEOUT);

function BotRetweet() {
  internal.post('/')
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.error(error);
    });
}

setInterval(BotRetweet, bot_timeout);


module.exports = BotRetweet;
