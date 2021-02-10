'use strict';
const client = require('../services/client');
const isReply = require('../utils/isReply');

const query = {
  track: 'Martinho Lutero,#ReformaProtestante,#ProtestantReform,#95teses,#5solas,#Reforma504Anos,-is:retweet',
};
class TweetsController {
  static stream;

  getTweets(req, res) {
    TweetsController.stream = client.stream('statuses/filter', query)
    TweetsController.stream
        .on("start", response => {
          console.log("start")
          res.status(200).json({message: "Inicializado corretamente", response})
        })
        .on("data", tweet => {
          const isTweetReply = isReply(tweet);

          if(!isTweetReply) {
            console.log(`Tweet de @${tweet.user.screen_name}: "${tweet.text}".`)
            TweetsController.retweet(tweet);
          }
        })
        .on("ping", ping => console.log("ping"))
        .on("end", response => {
          TweetsController.produceError(response, res)
        })
        .on("error", error => {
          TweetsController.produceError(error, res);
        })
  }

  static produceError(error, response) {
    process.nextTick(() => TweetsController.stream.destroy());
    console.error(error);
    response.status(500).json(error);
    process.exit(1);
  }

  static async retweet(tweet) {
    try {
      await client.post(`statuses/retweet/${tweet.id_str}`, (error, tweets, response) => {
        if(error) {
          throw new Error(error)
        }
      });
    } catch (error) {
      console.error(error)
      //throw new Error(error)
     }
  }
}

module.exports = TweetsController;
