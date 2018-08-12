'use strict';

const users = require('../../models/users');
const _ = require('underscore');

module.exports = (req, res, next) => {
  var bag = {
    req: req,
    reqQuery: req.query || {},
    inputParams: req.params || {},
    reqPath: req.route.path,
  };
  req.shim = req.shim || {};

  bag.who = util.format('%s|%s|%s', req.method, req.url, 'validateUser');
  logger.debug(bag.who, 'Started');

  if (!req.cookies.authToken)
    return res.send('Unauthorized').status(401);

  let query = {
    where: {
      authToken: req.cookies.authToken
    }
  }
  //TODO: Replace this with redis
  users.findOne(query).asCallback(
    function (err, user) {
      if (err || _.isEmpty(user)) {
        return res.send('Unauthorized').status(401);
      }
      req.shim.userId = user.id;
      return next();
    }
  );
}
