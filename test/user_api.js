/* eslint-env mocha, node */

var request = require('supertest');
var app = require('../app')({test: true});

const User = require('../models/User');

describe('Users API', function(){
  this.timeout(10000);

  before(function(done) {
    User.remove({}).then(() => {

      const user1 = new Promise((resolve) => {
        new User({
          hash: 'hash1',
          name: 'user',
          email: 'user@gmail.com',
          password: 'password'
        }).save(resolve);
      });

      const user2 = new Promise((resolve) => {
        new User({
          hash: 'hash2'
        }).save(resolve);
      });

      Promise.all([user1, user2]).then(() => done());
    });
  });

  it('should return 401 if the user already exists', function(done) {
    request(app)
      .post('/user/new/')
      .send({hash: 'hash1', name: 'user', email: 'user@gmail.com', password: 'whatever'})
      .expect(401)
      .end(done);
  });

  it('should create a user and log them in', function(done) {
    request(app)
      .post('/user/new/')
      .send({hash: 'hash2', name: 'newuser', email: 'newuser@gmail.com', password: 'whatever'})
      .expect(200, {loggedIn: true, hash: 'newuser@hotmail.com' })
      .expect('set-cookie', /[.]+/)
      .end(done);
  });
  //
  // it('should be able to tell us if a user exists', function(done) {
  //   request(app)
  //     .get('/user/exists/'+encodeURI('newuser'))
  //     .expect(200, {userExists: true})
  //     .end(done);
  // });
  //
  // it('should be able to tell us if a user does not exist', function(done) {
  //   request(app)
  //     .get('/user/exists/'+encodeURI('nobody@gmail.com'))
  //     .expect(200, {userExists: false})
  //     .end(done);
  // });
  //
  // //tests to make sure that sessions persist
  //
  // var agent = request.agent(app);
  //
  // it('should log a user in and set a cookie', function(done) {
  //   agent
  //     .post('/user/login/')
  //     .send({email: 'user@gmail.com', password: 'password'})
  //     .expect(200, {loggedIn: true, email: 'user@gmail.com'})
  //     .expect('set-cookie', /[.]+/)
  //     .end(done);
  // });
  //
  // it('should send a cookie on subsequent requests', function(done) {
  //   agent
  //     .get('/')
  //     .expect(200)
  //     .end(done);
  // });
  //
  // it('it should log a user out', function(done) {
  //   agent
  //     .get('/user/logout/')
  //     .expect(200, {loggedIn: false, email: ''})
  //     .end(done);
  // });
  //
  // it('should not be able to log in if the password is wrong', function(done) {
  //   request(app)
  //     .post('/user/login/')
  //     .send({email: 'user@gmail.com', password: 'wrong'})
  //     .expect(401)
  //     .end(done);
  // });

});
