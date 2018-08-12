'use strict';

const async = require('async');
const users = require('../../Models/users');

module.exports = (req, res) => {
  var bag = {
    resBody: {},
    reqBody: req.body
  };

  bag.who = 'users|login';
  logger.info(bag.who, 'Starting');

  async.series([
    _checkInputParams.bind(null, bag),
    _getUserDetails.bind(null, bag)
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

function _getUserDetails(bag, next) {
  var who = bag.who + '|' + _getUserDetails.name;
  logger.debug(who, 'Inside');

  var query = {
    where: {
      phoneNumber: bag.reqBody.phoneNumber
    }
  };

  users.findOne(query).asCallback(
    function (err, user) {
      if (err)
        return next('users.findOne failed with error: ' + err.message);
      if (user.password !== bag.reqBody.password)
        return next('Wrong phoneNumber/password');
      bag.resBody = {
        authToken: user.authToken
      };
      return next();
    }
  );
}
