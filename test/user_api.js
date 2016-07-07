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
          hash: 'abcd1234',
          name: 'user',
          email: 'user@gmail.com',
          password: 'password'
        }).save(resolve);
      });

      Promise.all([user1]).then(() => done());
    });
  });


  it('should be able to tell us if a user exists', function(done) {
    request(app)
      .get('/user/exists/'+encodeURI('user'))
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
      .send({'signin-username': 'user', 'signin-password': 'password'})
      .expect(200, {loggedIn: true, userHash: 'abcd1234', username: 'user'})
      .expect('set-cookie', /[.]+/)
      .end(done);
  });

  it('should send a cookie on subsequent requests', function(done) {
    agent1
      .get('/')
      .set('Accept', 'application/json')
      .expect(200)
      .expect(function(res) {
        assert.equal(res.body.user.hash, 'abcd1234');
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
      .send({'signin-username': 'user', 'signin-password': 'wrong'})
      .expect(401)
      .end(done);
  });

  var agent2 = request.agent(app);
  var agent2Hash;

  it('should obtain a user hash even if the user is not logged in', function(done) {
    agent2
      .get('/')
      .set('Accept', 'application/json')
      .expect(200)
      .expect(res => {
        agent2Hash = res.body.user.hash;
        assert(agent2Hash);
      })
      .end(done);
  });

  it('should obtain the same hash on subsequent requests', function(done) {
    agent2
      .get('/')
      .set('Accept', 'application/json')
      .expect(200)
      .expect(res => {
        assert.equal(agent2Hash, res.body.user.hash);
      })
      .end(done);
  });

  it('should not create a new user if the session hash does not match the submitted hash', function(done) {
    agent2
      .post('/user/new/')
      .send({'hash': 'badhash', 'signup-username': 'user', 'signup-email': 'user@gmail.com', 'signup-password': 'whatever'})
      .expect(400)
      .end(done);
  });

  it('should not create a user if the username is not unique', function(done) {
    agent2
      .post('/user/new/')
      .send({'hash': agent2Hash, 'signup-username': 'user', 'signup-email': 'user@gmail.com', 'signup-password': 'whatever'})
      .expect(401)
      .expect(res => {
        assert.equal(res.body.error, 'User could not be created')
      })
      .end(done);
  });

  it('should be able to create a new user with a unique name', function(done) {
    agent2
      .post('/user/new/')
      .send({'hash': agent2Hash, 'signup-username': 'newuser', 'signup-email': 'newuser@gmail.com', 'signup-password': 'whatever'})
      .expect(200)
      .expect({loggedIn: true, userHash: agent2Hash, username: 'newuser'})
      .end(done);
  });

  it('should not create a user if the hash has already been assigned', function(done) {
    agent2
      .post('/user/new/')
      .send({'hash': agent2Hash, 'signup-username': 'user', 'signup-email': 'newuser@gmail.com', 'signup-password': 'whatever'})
      .expect(401)
      .expect(res => {
        assert.equal(res.body.error, 'A user is already logged in');
      })
      .end(done);
  });

});
