'use strict';

const async = require('async');
const contacts = require('../../models/contacts');

module.exports = (req, res) => {
  console.log('insdie delete');
  var bag = {
    resBody: {},
    reqBody: req.body,
    inputParams: req.params,
  };

  bag.who = 'contacts|delete';
  logger.info(bag.who, 'Starting');

  async.series([
    _checkInputParams.bind(null, bag),
    _delete.bind(null, bag)
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

  return next();
}

function _delete(bag, next) {
  var who = bag.who + '|' + _delete.name;
  logger.debug(who, 'Inside');

  let query = {
    where: {
      id: bag.reqBody.contactId
    }
  }
  contacts.destroy(query).asCallback(
    function(err, contact) {
      if (err) {
        return next(err);
      }
      bag.resBody = {
        message: 'Contact Deleted Successfully'
      };
      return next();
    }
  );
}
