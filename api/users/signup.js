'use strict';

const async = require('async');
const users = require('../../Models/users');

module.exports = (req, res) => {
  var bag = {
    resBody: {},
    reqBody: req.body
  };

  bag.who = 'users|signup';
  logger.info(bag.who, 'Starting');

  async.series([
    _checkInputParams.bind(null, bag),
    _post.bind(null, bag)
    ],
    function (err) {
      logger.info(bag.who, 'Completed');
      if (err) {
        return res.status(500).json(err);
      }
      res.status(200).json(bag.resBody);
    }
    );
}

function _checkInputParams(bag, next) {
  var who = bag.who + '|' + _checkInputParams.name;
  logger.debug(who, 'Inside');

  return next();
}

function _post(bag, next) {
  var who = bag.who + '|' + _post.name;
  logger.debug(who, 'Inside');

  var newUser = {
    name: bag.reqBody.name,
    email: bag.reqBody.email,
    password: bag.reqBody.password,
    phoneNumber: bag.reqBody.phoneNumber,
    authToken: Math.floor(Math.random(10000) * 1000000)
  };

  users.create(newUser).asCallback(
    function (err, user) {
      if (err)
        return next('users.create failed with error: ' + err.message);
      bag.resBody = user;
      return next();
    }
  );
}
