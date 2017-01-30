"use strict";

const userHelper    = require("../lib/util/user-helper");

const express       = require('express');
const usersRoutes  = express.Router();

module.exports = function(DataHelpers) {
  // USER routes
  usersRoutes.post("/register", (req, res) => {
    DataHelpers.hasHandle(req.body.handle, function(match) {
      if (match) {
        res.status(403).send('handle already exists; try a different handle');
      } else {
        const user = userHelper.createUser(req.body);
        DataHelpers.saveUser(user);
        req.session.userHandle = user.handle;
        res.status(200).send(user.handle);
      }
    })
  });

  usersRoutes.post("/login", (req, res) => {
    DataHelpers.hasHandle(req.body.handle, function(match) {
      if (match) {
        req.session.userHandle = match.handle;
        res.status(200).send(match.handle);
      } else {
        res.status(403).send('your handle was not found, consider registering');
      }
    });
  });

  usersRoutes.post("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
  });

usersRoutes.get("/gethandle", (req, res) => {
  if (req.session && req.session.userHandle) {
    res.status(200).send(req.session.userHandle);
  } else {
    res.status(201).send();
  }
});

  return usersRoutes;

}
