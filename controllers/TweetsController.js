'use strict';
const client = require('../services/client');

const query = {
  track: 'Martinho Lutero,#ReformaProtestante,#ProtestantReform,#95teses,#5solas,#Reforma504Anos,-is:retweet',
};
class TweetsController {
  static stream;
  static counter = 0;

  getTweets(req, res) {
    TweetsController.counter++;
    if(TweetsController.counter > 1) {
      return res.status(420).send('Not permitted: there is another instance doing the same thing');
    }

    TweetsController.stream = client.stream('statuses/filter', query)
    TweetsController.stream
        .on("start", response => {
          console.log("start")
          res.status(200).json({message: "Inicializado corretamente", response})
        })
        .on("data", tweet => {
          const isReply = TweetsController.isReply(tweet);

          if(!isReply) {
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

  static isReply(tweet) {
    if (tweet.retweeted_status
      || tweet.in_reply_to_status_id
      || tweet.in_reply_to_status_id_str
      || tweet.in_reply_to_user_id
      || tweet.in_reply_to_user_id_str
      || tweet.in_reply_to_screen_name
      || tweet.retweeted_status
      || tweet.delete) {
        return true
      }
    return false
  }
}

module.exports = TweetsController;
