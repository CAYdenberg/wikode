/* eslint-env mocha, node */

var request = require('supertest');
var app = require('../app')({test: true});
var assert = require('assert');

const User = require('../models/User');

describe('Users API', function(){
  this.timeout(10000);

  before(function(done) {
    User.remove({}).then(() => {

      const user1 = new Promise((resolve) => {
        new User({
          name: 'existinguser',
          email: 'user@gmail.com',
          password: 'password'
        }).save(resolve);
      });

      Promise.all([user1]).then(() => done());
    });
  });


  it('should be able to tell us if a user exists', function(done) {
    request(app)
      .get('/user/exists/existinguser')
      .expect(200, {userExists: true})
      .end(done);
  });

  it('should be able to tell us if a user does not exist', function(done) {
    request(app)
      .get('/user/exists/nobody')
      .expect(200, {userExists: false})
      .end(done);
  });

  var agent1 = request.agent(app);

  it('should log a user in and set a cookie', function(done) {
    agent1
      .post('/user/login/')
      .send({'signin-username': 'existinguser', 'signin-password': 'password'})
      .expect(200, {user: 'existinguser'})
      .expect('set-cookie', /[.]+/)
      .end(done);
  });

  it('should send a cookie on subsequent requests', function(done) {
    agent1
      .get('/')
      .set('Accept', 'application/json')
      .expect(200)
      .expect(function(res) {
        assert.equal(res.body.user, 'existinguser');
      })
      .end(done);
  });

  it('it should log a user out and redirect them back to the homepage', function(done) {
    agent1
      .get('/user/logout/')
      .expect(302)
      .expect('Location', '/')
      .end(done);
  });

  it('should not be able to log in if the password is wrong', function(done) {
    agent1
      .post('/user/login/')
      .send({'signin-username': 'existinguser', 'signin-password': 'wrong'})
      .expect(401)
      .end(done);
  });

  var agent2 = request.agent(app);
  var agent2Name;

  it('should be able to create a new user with a unique name', function(done) {
    agent2
      .post('/user/new/')
      .send({'signup-username': 'newuser', 'signup-email': 'newuser@gmail.com', 'signup-password': 'whatever'})
      .expect(200)
      .expect(res => {
        assert.equal(res.body.user, 'newuser');
        agent2Name = res.body.user;
      })
      .end(done);
  });

  it('should not be able to create a user if the username is not unique', function(done) {
    agent2
      .post('/user/new/')
      .send({'signup-username': 'existinguser', 'signup-email': 'email@hotmail.com', 'signup-password': 'password'})
      .expect(400)
      .expect(res => {
        assert.equal(res.body.error, 'Username must be unique');
      })
      .end(done);
  });

  it('should obtain the same hash on subsequent requests', function(done) {
    agent2
      .get('/user/')
      .set('Accept', 'application/json')
      .expect(200)
      .expect({user: agent2Name})
      .end(done);
  });

  it('should not create a user if the information is incomplete', function(done) {
    agent2
      .post('/user/new/')
      .send({'signup-username': 'anothernewuser', 'signup-email': 'anothernewuser@gmail.com', 'signup-password': ''})
      .expect(400)
      .end(done);
  });

  it('should not create a new user if the username is "local"', function(done) {
    request(app)
      .post('/user/new/')
      .send({'signup-username': 'local', 'signup-email': 'newuser@gmail.com', 'signup-password': 'whatever'})
      .expect(400)
      .end(done);
  });

});
