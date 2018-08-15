process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');

let should = chai.should();
let username = process.env.username;
let password = process.env.password;
let baseUrl = '127.0.0.1:50000';

chai.use(chaiHttp);
//Our parent block
describe('Contacts', () => {
  describe('/GET /api/v1/contacts/search', () => {
    //TEST 1
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
    //TEST 2
    it('should get results for a valid name', (done) => {
      chai.request(baseUrl)
      .get('/api/v1/contacts/search?name=himanshu')
      .auth(username, password)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.greaterThan(0);
        done();
      });
    });
    //TEST 3
    it('should get results for a valid email', (done) => {
      chai.request(baseUrl)
      .get('/api/v1/contacts/search?email=hemanshu')
      .auth(username, password)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.greaterThan(0);
        done();
      });
    });
    //TEST 4
    it('should get results for a valid name and email', (done) => {
      chai.request(baseUrl)
      .get('/api/v1/contacts/search?email=hemanshu&name=himanshu')
      .auth(username, password)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.greaterThan(0);
        done();
      });
    });
    //TEST 5
    it('should not get any results for a invalid name', (done) => {
      chai.request(baseUrl)
      .get('/api/v1/contacts/search?name=test')
      .auth(username, password)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(0);
        done();
      });
    });
    //TEST 6
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
    //TEST 7
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
});