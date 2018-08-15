'use strict';

const async = require('async');
const Sequelize = require('sequelize');

const contacts = require('../../models/contacts');

const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 10;
const DEFAULT_OFFSET = 0;

module.exports = (req, res) => {
  var bag = {
    reqQuery: req.query,
    resBody: [],
    query: {}
  };

  bag.who = 'contacts|getS';
  logger.info(bag.who, 'Starting');

  async.series([
    _checkInputParams.bind(null, bag),
    _constructQuery.bind(null, bag),
    //_getContacts.bind(null, bag)
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

  return next();
}

//TODO: This needs to be replaced with ES
function _constructQuery(bag, next) {
  let limit = bag.reqQuery.limit;
  if (!limit)
    limit = DEFAULT_LIMIT;
  else if (limit > MAX_LIMIT)
    limit = MAX_LIMIT;

  let query = 'select * from contacts ';

  if (bag.reqQuery.name && bag.reqQuery.email) {
    query += `where name like '%${bag.reqQuery.name}%' and email like '%${bag.reqQuery.email}%' `
  } else if (bag.reqQuery.name) {
    query += `where name like '%${bag.reqQuery.name}%' `;
  } else if (bag.reqQuery.email) {
    query += `where email like '%${bag.reqQuery.email}%' `;
  }

  query += `limit ${limit} offset ${bag.reqQuery.offset * limit || 0}`;

  sequelize.query(query).asCallback(
    function (err, contacts) {
      if (err)
        return next({
          message: 'Unable to search with err: ' + err.message
        });
      bag.resBody = contacts[0];
      return next();
    }
  );
}
