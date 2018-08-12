'use strict';
function route (app) {
  let validateUser = require('./middleware/validateUser');
  
  app.get('/signup', (req, res) => {
    res.render('../views/signup.ejs', {});
  });

  app.get('/contacts', validateUser, (req, res) => {
    res.render('../views/contacts.ejs', {});
  });

  app.post('/api/signup', require('./users/signup'));
  app.post('/api/login', require('./users/login'));
  
  app.get('*', (req, res) => {
    res.render('../views/login.ejs', {});
  });
}

module.exports.route = route;
