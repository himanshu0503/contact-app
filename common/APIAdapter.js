'use strict';

var self = APIAdapter;
module.exports = self;

var async = require('async');
var request = require('request');

function APIAdapter() {
  logger.debug('Initializing', self.name);

  let port = process.env.port || 50000;
  this.baseUrl = 'http://localhost:50000';
  this.headers = {
    'Content-Type': 'application/json; charset=utf-8'
  };
}

APIAdapter.prototype.get = function (relativeUrl, callback) {
  logger.debug('GET', relativeUrl);
  var opts = {
    method: 'GET',
    url: relativeUrl.indexOf('http') === 0 ?
      relativeUrl : this.baseUrl + relativeUrl,
    headers: this.headers
  };

  var bag = {
    opts: opts,
    relativeUrl: relativeUrl,
    token: this.token
  };

  async.series([
      _performCall.bind(null, bag),
      _parseResponse.bind(null, bag)
    ],
    function () {
      callback(bag.err, bag.parsedBody, bag.res);
    }
  );
};

APIAdapter.prototype.post = function (relativeUrl, json, callback) {
  logger.debug('POST', relativeUrl);
  var opts = {
    method: 'POST',
    url: relativeUrl.indexOf('http') === 0 ?
      relativeUrl : this.baseUrl + relativeUrl,
    headers: this.headers,
    json: json
  };
  var bag = {
    opts: opts,
    relativeUrl: relativeUrl,
    token: this.token
  };

  async.series([
      _performCall.bind(null, bag),
      _parseResponse.bind(null, bag)
    ],
    function () {
      callback(bag.err, bag.parsedBody, bag.res);
    }
  );
};

APIAdapter.prototype.put = function (relativeUrl, json, callback) {
  logger.debug('PUT', relativeUrl);
  var opts = {
    method: 'PUT',
    url: relativeUrl.indexOf('http') === 0 ?
      relativeUrl : this.baseUrl + relativeUrl,
    headers: this.headers,
    json: json
  };
  var bag = {
    opts: opts,
    relativeUrl: relativeUrl,
    token: this.token
  };

  async.series([
      _performCall.bind(null, bag),
      _parseResponse.bind(null, bag)
    ],
    function () {
      callback(bag.err, bag.parsedBody, bag.res);
    }
  );
};

APIAdapter.prototype.delete = function (relativeUrl, callback) {
  var opts = {
    method: 'DELETE',
    url: relativeUrl.indexOf('http') === 0 ?
      relativeUrl : this.baseUrl + relativeUrl,
    headers: this.headers
  };

  var bag = {
    opts: opts,
    relativeUrl: relativeUrl,
    token: this.token
  };

  async.series([
      _performCall.bind(null, bag),
      _parseResponse.bind(null, bag)
    ],
    function () {
      callback(bag.err, bag.parsedBody, bag.res);
    }
  );
};

// common helper methods
function _performCall(bag, next) {
  var who = self.name + '|' + _performCall.name;
  logger.debug('Inside', who);

  bag.startedAt = Date.now();

  request(bag.opts,
    function (err, res, body) {
      var interval = Date.now() - bag.startedAt;
      logger.debug(bag.opts.method, bag.relativeUrl, 'took', interval,
        'ms and returned HTTP status', (res && res.statusCode));

      bag.res = res;
      bag.body = body;
      bag.statusCode = res && res.statusCode;
      if (res && res.statusCode > 299)
        err = err || res.statusCode;
      if (err) {
        logger.error('API returned status', err,
          'for request', bag.relativeUrl);
        bag.err = err;
      }
      return next();
    }
  );
}

function _parseResponse(bag, next) {
  /* jshint maxcomplexity:15 */
  var who = self.name + '|' + _parseResponse.name;
  logger.debug('Inside', who);

  if (bag.err) {
    // Return something with an ActErr error ID
    var newErr = {
      id: 500,
      message: bag.opts.method + ' ' + bag.relativeUrl + ' returned ' + bag.err
    };
    if (299 < bag.err && bag.err < 400)
      newErr.id = 300;
    else if (399 < bag.err && bag.err < 500)
      newErr.id = 400;
    else if (499 < bag.err && bag.err < 600)
      newErr.id = 500;
    bag.err = newErr;
  }

  if (bag.body) {
    if (typeof bag.body === 'object') {
      bag.parsedBody = bag.body;
      if (bag.err && bag.parsedBody && bag.parsedBody.id)
        bag.err = bag.parsedBody;
    } else {
      try {
        bag.parsedBody = JSON.parse(bag.body);
        if (bag.err && bag.parsedBody && bag.parsedBody.id)
          bag.err = bag.parsedBody;
      } catch (e) {
        if (!bag.err)
          logger.error('Unable to parse bag.body', bag.body, e);
        bag.err = bag.err || {
          id: 500,
          message: 'Could not parse response'
        };
      }
    }
  }

  if (bag.err)
    bag.err.statusCode = bag.statusCode;

  return next();
}
