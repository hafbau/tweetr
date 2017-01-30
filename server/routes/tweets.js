"use strict";

const userHelper    = require("../lib/util/user-helper");

const express       = require('express');
const tweetsRoutes  = express.Router();

// const cookieSession = require("cookie-session");
// tweetsRoutes.use(cookieSession({signed: false}));

module.exports = function(DataHelpers) {
  
  // updating tweet's likes counter
  tweetsRoutes.post("/:tweet/likes", function(req, res) {
    const handle = req.session.userHandle;
    const tweetID = req.params.tweet;
    if (handle) {
      DataHelpers.updateTweetAction(tweetID, handle, function(err, arr) {
        const likes = arr[0]['likes'];
        const len = likes ? likes.length : 0;
        res.status(200).send(`${len}`);
      });
    } else {
      res.status(403).send();
    }
  })

  tweetsRoutes.get("/", function(req, res) {
    let pagenum = req.query.page; //my edit used for infinite scrolling
    DataHelpers.getTweets((err, tweets) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(tweets);
      }
    }, pagenum);
  });

  tweetsRoutes.post("/", function(req, res) {
    if (!req.body.text) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    }
    const userHandle = req.session.userHandle;
    if (userHandle) {
      DataHelpers.hasHandle(userHandle, function(match) {
        const user = {
          name: match.name,
          handle: match.handle,
          avatars: match.avatars 
        };
        const tweet = {
          user: user,
          content: {
            text: req.body.text
          },
          created_at: Date.now()
        };

        DataHelpers.saveTweet(tweet, (err) => {
          if (err) {
            res.status(500).json({ error: err.message });
          } else {
            res.status(201).send(tweet); // avoiding loading all db
          }
        });
      });
    } else {
      res.status(403).json({ error: err.message });
    }
  });

  return tweetsRoutes;

}
