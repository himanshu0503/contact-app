'use strict';

const async = require('async');
const contacts = require('../../models/contacts');

module.exports = (req, res) => {
  var bag = {
    reqBody: req.body,
    userId: req.shim.userId,
    reqParams: req.params,
    contacts: []
  };

  bag.who = 'contacts|getS';
  logger.info(bag.who, 'Starting');

  async.series([
    _checkInputParams.bind(null, bag),
    _getContacts.bind(null, bag)
    ],
    function (err) {
      logger.info(bag.who, 'Completed');
      if (err) {
        return res.status(500).json(err);
      }
      let previousPage = '';
      if (req.params.pageOffset > 1) {
        previousPage = req.params.pageOffset - 1;
      }
      res.render('../../views/contacts.ejs', {
        contacts: bag.contacts,
        currentPage: req.params.pageOffset || 1,
        nextPage: parseInt(req.params.pageOffset) + 1 || 2,
        previousPage
      });
    }
  );
}

function _checkInputParams(bag, next) {
  var who = bag.who + '|' + _checkInputParams.name;
  logger.debug(who, 'Inside');

  return next();
}

function _getContacts(bag, next) {
  var who = bag.who + '|' + _getContacts.name;
  logger.debug(who, 'Inside');

  let limit = 1;
  let offset = (bag.reqParams.pageOffset - 1 )* limit || 0;
  var query = {
    where: {
      userId: bag.userId
    },
    offset: offset,
    limit: limit,
    order: [
      ['name', 'ASC']
    ]
  };

  contacts.findAll(query).asCallback(
    function (err, contacts) {
      if (err)
        return next('contacts.findOne failed with error: ' + err.message);
      bag.contacts = contacts;
      return next();
    }
  );
}
