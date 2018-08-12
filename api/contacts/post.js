'use strict';

const async = require('async');
const contacts = require('../../models/contacts');

module.exports = (req, res) => {
  var bag = {
    resBody: {},
    reqBody: req.body,
    userId: req.shim.userId
  };

  bag.who = 'contacts|post';
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

  var newContact = {
    name: bag.reqBody.name,
    userId: bag.userId,
    phoneNumber: bag.reqBody.phoneNumber
  };

  contacts.create(newContact).asCallback(
    function (err, contact) {
      if (err)
        return next('contacts.create failed with error: ' + err.message);
      bag.resBody = contact;
      return next();
    }
  );
}
