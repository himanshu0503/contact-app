'use strict';

const users = require('../../models/users');
const _ = require('underscore');

module.exports = (req, res, next) => {
  req.shim = {};

  //LOGIC to parse basicAuth
  var auth = req.headers['authorization'];
  if (!auth)
    return res.status(401).send('Unauthorized');
  var tmp = auth.split(' ');
  var buf = new Buffer(tmp[1], 'base64');
  var plain_auth = buf.toString();
  var creds = plain_auth.split(':');
  var username = creds[0];
  var password = creds[1];

  let query = {
    where: {
      email: username,
      password: password
    }
  };
  console.log('query');
  //TODO: Replace this with redis
  users.findOne(query).asCallback(
    function (err, user) {
      if (err || _.isEmpty(user)) {
        res.status(401).send('Unauthorized');
      }
      console.log(user.id);
      req.shim.userId = user.id;
      req.shim.user = user;
      return next();
    }
  );
}
