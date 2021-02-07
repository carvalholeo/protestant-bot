'use strict';
require('dotenv').config();
const internal = require('./services/internal');
const client = require('./services/client');
const fs = require('fs');
const path = require('path');
const TweetsController = require('./controllers/TweetsController');
const bot_timeout = Number(process.env.BOT_TIMEOUT);

async function BotRetweet() {
    internal.post('/')
      .then(response => {
        try {
          //const tweets = await client.get("statuses/home_timeline");
          console.log(`Rate: ${tweets._headers.get('x-rate-limit-remaining')} / ${tweets._headers.get('x-rate-limit-limit')}`);
          const delta = (tweets._headers.get('x-rate-limit-reset') * 1000) - Date.now()
          console.log(`Reset: ${Math.ceil(delta / 1000 / 60)} minutes`);
        } catch (e) {
          if ('errors' in e) {
            if (e.errors[0].code === 88) {
              console.log("Rate limit will reset on", new Date(e._headers.get("x-rate-limit-reset") * 1000));
            }
          }
        }
      })
      .catch(error => {
        setTimeout(() => {
          const shutdownTime = new Date().toLocaleString("pt-BR");
          fs.appendFileSync(path.join(__dirname, 'logs', 'shutdown.txt'), `App shut down at ${shutdownTime}. Reason: ${error.response.data}\n`, { encoding: 'utf-8', flag: 'a' });

          clearInterval(initializeBot);
          process.exit(1);
        }, 0);
        console.error(error.response.data)
      });
}

// const exitApp = () => {
//   setTimeout(() => {
//     const shutdownTime = new Date().toLocaleString("pt-BR");
//     fs.appendFileSync(path.join(__dirname, 'logs', 'shutdown.txt'), `App shutdown at ${shutdownTime}\n`, { encoding: 'utf-8', flag: 'a' });

//     clearInterval(initializeBot);
//     process.exit(1);
//   }, 0);
// }

const initializeBot = setInterval(BotRetweet, 1000);


module.exports = BotRetweet;
