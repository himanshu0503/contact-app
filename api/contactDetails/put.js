'use strict';

const async = require('async');
const contactDetails = require('../../models/contactDetails');

module.exports = (req, res) => {
  var bag = {
    resBody: {},
    reqBody: req.body,
    reqParams: req.params,
    userId: req.shim.userId
  };

  bag.who = 'contactDetails|post';
  logger.info(bag.who, 'Starting');

  async.series([
    _checkInputParams.bind(null, bag),
    _put.bind(null, bag)
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

//TODO: Add logic to check if a user can actually edit this thing.

function _put(bag, next) {
  var who = bag.who + '|' + _put.name;
  logger.debug(who, 'Inside');

  var newContactDetail = {
    skypeId: bag.reqBody.skypeId,
    contactId: bag.reqParams.contactId,
    address: bag.reqBody.address
  };

  contactDetails.upsert(newContactDetail).asCallback(
    function (err, contactDetail) {
      if (err)
        return next('contactDetails.create failed with error: ' + err.message);
      bag.resBody = contactDetail;
      return next();
    }
  );
}
