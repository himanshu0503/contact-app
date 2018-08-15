'use strict';

const async = require('async');
const contacts = require('../../models/contacts');

module.exports = (req, res) => {
  var bag = {
    resBody: {},
    reqBody: req.body,
    inputParams: req.params,
  };

  bag.who = 'contacts|put';
  logger.info(bag.who, 'Starting');

  async.series([
    _checkInputParams.bind(null, bag),
    _getContact.bind(null, bag),
    _put.bind(null, bag)
    ],
    function (err) {
      logger.info(bag.who, 'Completed');
      if (err) {
        let errCode = err.statusCode || 500;
        let errMsg = err.message || 'Internal Server Error';
        return res.status(errCode).json({message: errMsg});
      }
      res.status(200).json(bag.resBody);
    }
  );
}

function _checkInputParams(bag, next) {
  var who = bag.who + '|' + _checkInputParams.name;
  logger.debug(who, 'Inside');

  if (!bag.inputParams.contactId) {
    return next({
      statusCode: 400,
      message: 'Please provide a contactId'
    });
  }

  if (!bag.reqBody.name) {
    return next({
      statusCode: 400,
      message: 'Please provide a valid name'
    });
  }

  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!bag.reqBody.email || !re.test(String(bag.reqBody.email).toLowerCase())) {
    return next({
      statusCode: 400,
      message: 'Please provide a valid email'
    });
  }

  return next();
}

function _getContact(bag, next) {
  var who = bag.who + '|' + _getContact.name;
  logger.debug(who, 'Inside');

  var query = {
    where: {
      id: bag.inputParams.contactId
    }
  };

  contacts.findOne(query).asCallback(
    function (err, contact) {
      if (err || !contact) {
        return next({
          statusCode: 404,
          message: `No contact found for contactId: ${bag.inputParams.contactId}`
        });
      }

      bag.contact = contact;
      return next();
    }
  );
}
//TODO: All logic to update address
function _put(bag, next) {
  var who = bag.who + '|' + _put.name;
  logger.debug(who, 'Inside');

  var update = {
    name: bag.reqBody.name,
    email: bag.reqBody.email,
    phoneNumber: bag.reqBody.phoneNumber
  };

  bag.contact.update(update).asCallback(
    function (err, contact) {
      if (err) {
        if (err.errors[0].type === 'unique violation') {
          return next({
            statusCode: 409,
            message: 'Email already exists, please try with another email'
          });
        }
        return next(err);
      }
      bag.resBody = contact;
      return next();
    }
  );
}
