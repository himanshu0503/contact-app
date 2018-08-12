'use strict';

var self = post;
module.exports = self;

var async = require('async');
var customers = require('../Models/customers.js');

function post(req, res) {
  var bag = {
    resBody: {},
    reqBody: req.body
  };

  bag.who = util.format('customers|%s', self.name);
  logger.info(bag.who, 'Starting');

  async.series([
    _checkInputParams.bind(null, bag),
    _post.bind(null, bag)
  ],
    function (err) {
      logger.info(bag.who, 'Completed');
      if (err)
        return res.status(500).json(err);

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

  var newCustomer = {
    name: bag.reqBody.name,
    email: bag.reqBody.email
  };

  customers.create(newCustomer).asCallback(
    function (err, customer) {
      if (err)
        return next(
            'customers.create failed with error: ' + err.message
        );

      bag.resBody = customer;
      return next();
    }
  );
}
