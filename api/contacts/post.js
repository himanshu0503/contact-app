'use strict';

const async = require('async');
const contacts = require('../../models/contacts');

module.exports = (req, res) => {
  var bag = {
    resBody: {},
    reqBody: req.body
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

function _post(bag, next) {
  var who = bag.who + '|' + _post.name;
  logger.debug(who, 'Inside');

  var newContact = {
    name: bag.reqBody.name,
    email: bag.reqBody.email,
    phoneNumber: bag.reqBody.phoneNumber
  };

  contacts.create(newContact).asCallback(
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
