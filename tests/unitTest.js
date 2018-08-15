process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');

let should = chai.should();
let username = process.env.username;
let password = process.env.password;
let baseUrl = '127.0.0.1:50000';
//This will be the contactId that will be created
let contactId = '';


chai.use(chaiHttp);
//Our parent block
describe('Contacts', () => {
    //TESTS for create new contact api
  describe('Test Authentication', () => {
    it('should fail if no auth is provided', (done) => {
      chai.request(baseUrl)
      .get('/api/v1/contacts/search')
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
    });
    it('should fail if invalid auth', (done) => {
      chai.request(baseUrl)
      .get('/api/v1/contacts/search')
      .auth('abc', 'abcd')
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
    });
  });

  //TESTS for create new contact api
  describe('/POST /api/v1/contacts', () => {
    it('should allow creating a contact', (done) => {
      chai.request(baseUrl)
      .post('/api/v1/contacts')
      .auth(username, password)
      .send({email: 'test@example.com', name: 'tester', phoneNumber: 12312344})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('Object');
        //Setting the contactId for further usage
        contactId = res.body.id;
        done();
      });
    });
    it('should disallow a contact if no name is provided during contact creation', (done) => {
      chai.request(baseUrl)
      .post('/api/v1/contacts')
      .auth(username, password)
      .send({email: 'test@example.com', phoneNumber: 12312344})
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('Object');
        res.body.should.have.property('message');
        done();
      });
    });
    it('should disallow a contact if no email is provided during contact creation', (done) => {
      chai.request(baseUrl)
      .post('/api/v1/contacts')
      .auth(username, password)
      .send({name: 'tester', phoneNumber: 12312344})
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('Object');
        res.body.should.have.property('message');
        done();
      });
    });
    it('should disallow if invalid email is provided during contact creation', (done) => {
      chai.request(baseUrl)
      .post('/api/v1/contacts')
      .auth(username, password)
      .send({email: 'test', name: 'tester', phoneNumber: 12312344})
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('Object');
        res.body.should.have.property('message');
        done();
      });
    });
    it('should throw error on duplicate email during contact creation', (done) => {
      chai.request(baseUrl)
      .post('/api/v1/contacts')
      .auth(username, password)
      .send({email: 'test@example.com', name: 'tester', phoneNumber: 12312344})
      .end((err, res) => {
        res.should.have.status(409);
        res.body.should.be.a('Object');
        res.body.should.have.property('message');
        done();
      });
    });
  });

  //TESTS for update contact api
  describe('/PUT /api/v1/contacts/:contactId', () => {
    it('should allow updating a contact', (done) => {
      chai.request(baseUrl)
      .put('/api/v1/contacts/'+ contactId)
      .auth(username, password)
      .send({email: 'test1@example.com', name: 'tester123', phoneNumber: 12312344})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('Object');
        done();
      });
    });
    it('should disallow a contact update if no id is provided', (done) => {
      chai.request(baseUrl)
      .put('/api/v1/contacts/')
      .auth(username, password)
      .send({email: 'test@example.com', phoneNumber: 12312344})
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
    });
    it('should disallow a contact update if no name is provided', (done) => {
      chai.request(baseUrl)
      .put('/api/v1/contacts/'+ contactId)
      .auth(username, password)
      .send({email: 'test@example.com', phoneNumber: 12312344})
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('Object');
        res.body.should.have.property('message');
        done();
      });
    });
    it('should disallow a contact update if no email is provided', (done) => {
      chai.request(baseUrl)
      .put('/api/v1/contacts/'+ contactId)
      .auth(username, password)
      .send({name: 'tester', phoneNumber: 12312344})
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('Object');
        res.body.should.have.property('message');
        done();
      });
    });
    it('should disallow contact update if invalid email is provided', (done) => {
      chai.request(baseUrl)
      .put('/api/v1/contacts/'+ contactId)
      .auth(username, password)
      .send({email: 'test', name: 'tester', phoneNumber: 12312344})
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('Object');
        res.body.should.have.property('message');
        done();
      });
    });
  });

  //Tests for search API
  describe('/GET /api/v1/contacts/search', () => {
    it('should be accessible', (done) => {
      chai.request(baseUrl)
      .get('/api/v1/contacts/search')
      .auth(username, password)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.greaterThan(0);
        done();
      });
    });
    it('should get results for a valid name', (done) => {
      chai.request(baseUrl)
      .get('/api/v1/contacts/search?name=tester')
      .auth(username, password)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.greaterThan(0);
        done();
      });
    });
    it('should get results for a valid email', (done) => {
      chai.request(baseUrl)
      .get('/api/v1/contacts/search?email=test')
      .auth(username, password)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.greaterThan(0);
        done();
      });
    });
    it('should get results for a valid name and email', (done) => {
      chai.request(baseUrl)
      .get('/api/v1/contacts/search?email=test&name=tester')
      .auth(username, password)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.greaterThan(0);
        done();
      });
    });
    it('should not get any results for a invalid name', (done) => {
      chai.request(baseUrl)
      .get('/api/v1/contacts/search?name=invalid')
      .auth(username, password)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(0);
        done();
      });
    });
    it('should not get results for an invalid email', (done) => {
      chai.request(baseUrl)
      .get('/api/v1/contacts/search?email=invalid')
      .auth(username, password)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(0);
        done();
      });
    });
    it('should not get results for an invalid email or invalid name', (done) => {
      chai.request(baseUrl)
      .get('/api/v1/contacts/search?email=invalid&name=invalid')
      .auth(username, password)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(0);
        done();
      });
    });
  });

  //TESTS for delete contact api
  describe('/DELETE /api/v1/contacts/:contactId', () => {
    it('should delete the specified contactId', (done) => {
      chai.request(baseUrl)
      .delete('/api/v1/contacts/'+contactId)
      .auth(username, password)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('Object');
        res.body.should.have.property('message');
        done();
      });
    });
  });
});