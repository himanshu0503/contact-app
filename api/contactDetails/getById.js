'use strict';

const async = require('async');
const contacts = require('../../models/contacts');
const contactDetails = require('../../models/contactDetails');

module.exports = (req, res) => {
  var bag = {
    reqBody: req.body,
    userId: req.shim.userId,
    reqParams: req.params,
    contactDetails: [],
    displayNext: false
  };

  bag.who = 'contactDetails|getById';
  logger.info(bag.who, 'Starting');

  async.series([
    _checkInputParams.bind(null, bag),
    _getContact.bind(null, bag),
    _getContactDetails.bind(null, bag)
    ],
    function (err) {
      logger.info(bag.who, 'Completed');
      if (err) {
        return res.status(500).json(err);
      }
      res.render('../../views/contactDetails.ejs', {
        contactDetail: bag.contactDetail,
        contact: bag.contact
      });
    }
  );
}

function _checkInputParams(bag, next) {
  var who = bag.who + '|' + _checkInputParams.name;
  logger.debug(who, 'Inside');

  return next();
}

function _getContact(bag, next) {
  var who = bag.who + '|' + _getContact.name;
  logger.debug(who, 'Inside');

  var query = {
    where: {
      id: bag.reqParams.contactId
    }
  };

  contacts.findOne(query).asCallback(
    function (err, contact) {
      if (err)
        return next('contacts.findOne failed with error: ' + err.message);

      bag.contact = contact;
      return next();
    }
  );
}

function _getContactDetails(bag, next) {
  var who = bag.who + '|' + _getContactDetails.name;
  logger.debug(who, 'Inside');

  var query = {
    where: {
      contactId: bag.reqParams.contactId
    }
  };

  contactDetails.findOne(query).asCallback(
    function (err, contactDetail) {
      if (err)
        return next('contactDetails.findOne failed with error: ' + err.message);

      bag.contactDetail = contactDetail || {};
      return next();
    }
  );
}
