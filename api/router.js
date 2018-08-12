'use strict';
function route (app) {
  let validateUser = require('./middleware/validateUser');
  
  app.get('/signup', (req, res) => {
    res.render('../views/signup.ejs', {});
  });

  app.get('/newContact', (req, res) => {
    res.render('../views/newContact.ejs', {});
  });

  app.get(['/contacts', '/contacts/:pageOffset'], validateUser, require('./contacts/getS'));


  app.post('/api/contacts', validateUser, require('./contacts/post'));

  app.post('/api/signup', require('./users/signup'));
  app.post('/api/login', require('./users/login'));
  
  app.get('*', (req, res) => {
    res.render('../views/login.ejs', {});
  });
}

module.exports.route = route;
