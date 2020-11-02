'use strict';
const twitterApi = require('../services/api');

const query = {
  q: 'Martinho Lutero OR Martin Luter OR #ReformaProtestante OR #ProtestantReform OR #95teses OR #5solas OR #Reforma503Anos from:_carvalho_leo',
  result_type: 'recent',
  count: 1000
};

const TweetsController = {
  getTweets: (req, res) => {
    try {
      return twitterApi.get('search/tweets', query)
        .then(response => response.data)
        .then(({ statuses }) => {
          const repeated = [];
          const unique = [];

          statuses.map(tweet => {
            if (isReply(tweet)) {
              repeated.push(tweet);
              return;
            }
            unique.push(tweet);
          });

          if (unique.length > 0) {
            TweetsController.retweet(unique);
          }
          return res.json({ repeated, unique });
        });

    } catch (error) {
      return res.status(500).send(error);
    }
  },
  retweet: tweets => {
    try {
      tweets.map(async tweet => {
        const id = tweet.id_str;
        try {
          twitterApi.post(`statuses/retweet/${id}`, (error, tweets, response) => {
          });
        } catch (error) { }
      });
    } catch (error) {
      return res.status(500).send(error);
    }
  }
}

function isReply(tweet) {
  if (tweet.retweeted_status
    || tweet.in_reply_to_status_id
    || tweet.in_reply_to_status_id_str
    || tweet.in_reply_to_user_id
    || tweet.in_reply_to_user_id_str
    || tweet.in_reply_to_screen_name) {
      return true
    }
  return false
}

module.exports = TweetsController;
