'use strict';
function route (app) {
  let validateUser = require('./middleware/validateUser');

  app.post('/api/v1/contacts', require('./contacts/post'));
  app.put('/api/v1/contacts/:contactId', require('./contacts/put'));
  app.delete('/api/v1/contacts/:contactId', require('./contacts/delete'));
  app.get('/api/v1/contacts/search/', require('./contacts/getS'));
}

module.exports.route = route;
