'use strict';
const twitterApi = require('../services/api');

const query = {
  q: 'Martinho Lutero OR Martin Luter OR #ReformaProtestante OR #ProtestantReform OR #95teses OR #5solas',
  result_type: 'recent',
  count: 500
};

const query2 = {
  track: 'Martinho Lutero',
  result_type: 'recent',
  language: 'pt'
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
            return;
          });

          if (unique.length > 0) {
            TweetsController.retweet(unique);
            TweetsController.comment(unique);
          }

          if(repeated.length > 0) {
            //TweetsController.retweet(repeated);
          }
          return res.json({repeated, unique})
          //return res.status(201).json(success);
        })
    } catch (error) {
      return res.status(500).send(error)
    }
  },
  comment: tweets => {
    tweets.map(async (tweet, key) => {
      if(key > 3) {
        return;
      }
      const user = tweet.user.screen_name

      const comment = {
        in_reply_to_status_id: tweet.id_str,
        status: `Dia de Martinho Lutero, @${user}! #ReformaProtestante #ProtestantReform #95teses #5Solas (Tweet by @BotLutero)`
      };
return
      await twitterApi.post('statuses/update', comment, (error, tweets, response) => {
        if (error) throw error;
      })
      .catch(error => res.status(500).send(error));
    });

  },
  retweet: tweets => {
    tweets.map(async tweet => {
      const {id} = tweet;

      await twitterApi.post(`statuses/retweet/${id}`, (error, tweets, response) => {
        if (error) throw error;
      })
      .catch(error => res.status(500).send(error));
    });
  }
}

function isReply(tweet) {
  if (tweet.retweeted_status
    || tweet.in_reply_to_status_id
    || tweet.in_reply_to_status_id_str
    || tweet.in_reply_to_user_id
    || tweet.in_reply_to_user_id_str
    || tweet.in_reply_to_screen_name)
    return true
}

module.exports = TweetsController;
