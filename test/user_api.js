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
      .get('/user/exists/'+encodeURI('existinguser'))
      .expect(200, {userExists: true})
      .end(done);
  });

  it('should be able to tell us if a user does not exist', function(done) {
    request(app)
      .get('/user/exists/'+encodeURI('nobody'))
      .expect(200, {userExists: false})
      .end(done);
  });

  var agent1 = request.agent(app);

  it('should log a user in and set a cookie', function(done) {
    agent1
      .post('/user/login/')
      .send({'signin-username': 'existinguser', 'signin-password': 'password'})
      .expect(200, {loggedIn: true, userHash: 'existinguser', username: 'existinguser'})
      .expect('set-cookie', /[.]+/)
      .end(done);
  });

  it('should send a cookie on subsequent requests', function(done) {
    agent1
      .get('/')
      .set('Accept', 'application/json')
      .expect(200)
      .expect(function(res) {
        assert.equal(res.body.user.hash, 'existinguser');
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
  var agent2Hash;

  it('should be able to create a new user with a unique name', function(done) {
    agent2
      .post('/user/new/')
      .send({'signup-username': 'newuser', 'signup-email': 'newuser@gmail.com', 'signup-password': 'whatever'})
      .expect(200)
      .expect(res => {
        assert.equal(res.body.loggedIn, true);
        assert.equal(res.body.username, 'newuser');
        agent2Hash = res.body.userHash;
      })
      .end(done);
  });

  it('should obtain the same hash on subsequent requests', function(done) {
    agent2
      .get('/user/')
      .set('Accept', 'application/json')
      .expect(200)
      .expect({loggedIn: true, username: 'newuser', userHash: agent2Hash})
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
      .expect(401)
      .end(done);
  });

  it('should still create a user if the username is not unique but the slug should be unique', function(done) {
    request(app)
      .post('/user/new/')
      .send({'signup-username': 'newuser', 'signup-email': 'newuser@gmail.com', 'signup-password': 'whatever'})
      .expect(200)
      .expect({loggedIn: true, username: 'newuser', userHash: 'newuser-2'})
      .end(done);
  });

});
