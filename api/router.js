'use strict';
function route (app) {
  let validateUser = require('./middleware/validateUser');

  app.post('/api/v1/contacts', require('./contacts/post'));
  //app.put('/api/v1/contacts/:contactId', validateUser, require('./contacts/put'));
  //app.delete('/api/v1/contacts/:contactId', validateUser, require('./contacts/delete'));
  //app.get('/api/v1/contacts/search/', validateUser, require('./contacts/search'));
}

module.exports.route = route;
