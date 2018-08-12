'use strict';
function route (app) {
  let validateUser = require('./middleware/validateUser');
  
  app.get('/signup', (req, res) => {
    res.render('../views/signup.ejs', {});
  });

  app.get('/newContact', validateUser, (req, res) => {
    res.render('../views/newContact.ejs', {});
  });

  app.get('/contactDetails/:contactId/edit', validateUser, require('./contactDetails/getById'));

  app.get(['/contacts', '/contacts/:pageOffset'], validateUser, require('./contacts/getS'));

  app.put('/api/contactDetails/:contactId/edit', validateUser, require('./contactDetails/post'));
  app.post('/api/contacts', validateUser, require('./contacts/post'));

  app.post('/api/signup', require('./users/signup'));
  app.post('/api/login', require('./users/login'));
  
  app.get('*', (req, res) => {
    res.render('../views/login.ejs', {});
  });
}

module.exports.route = route;
