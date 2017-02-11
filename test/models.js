/* eslint-env mocha */

const {expect} = require('chai');
const sinon = require('sinon');
require('sinon-mongoose');
require('sinon-as-promised');

const User = require('../models/User');
const Wikode = require('../models/Wikode');

describe('User Model', () => {
  it('should create a new user', (done) => {
    const UserMock = sinon.mock(new User({ email: 'test@gmail.com', password: 'root' }));
    const user = UserMock.object;

    UserMock
      .expects('save')
      .yields(null);

    user.save(function (err) {
      UserMock.verify();
      UserMock.restore();
      expect(err).to.be.null;
      done();
    });
  });

  it('should return error if user is not created', (done) => {
    const UserMock = sinon.mock(new User({ email: 'test@gmail.com', password: 'root' }));
    const user = UserMock.object;
    const expectedError = {
      name: 'ValidationError'
    };

    UserMock
      .expects('save')
      .yields(expectedError);

    user.save((err, result) => {
      UserMock.verify();
      UserMock.restore();
      expect(err.name).to.equal('ValidationError');
      expect(result).to.be.undefined;
      done();
    });
  });

  it('should not create a user with the unique email', (done) => {
    const UserMock = sinon.mock(User({ email: 'test@gmail.com', password: 'root' }));
    const user = UserMock.object;
    const expectedError = {
      name: 'MongoError',
      code: 11000
    };

    UserMock
      .expects('save')
      .yields(expectedError);

    user.save((err, result) => {
      UserMock.verify();
      UserMock.restore();
      expect(err.name).to.equal('MongoError');
      expect(err.code).to.equal(11000);
      expect(result).to.be.undefined;
      done();
    });
  });

  it('should find user by email', (done) => {
    const userMock = sinon.mock(User);
    const expectedUser = {
      _id: '5700a128bd97c1341d8fb365',
      email: 'test@gmail.com'
    };

    userMock
      .expects('findOne')
      .withArgs({ email: 'test@gmail.com' })
      .yields(null, expectedUser);

    User.findOne({ email: 'test@gmail.com' }, (err, result) => {
      userMock.verify();
      userMock.restore();
      expect(result.email).to.equal('test@gmail.com');
      done();
    })
  });

  it('should remove user by email', (done) => {
    const userMock = sinon.mock(User);
    const expectedResult = {
      nRemoved: 1
    };

    userMock
      .expects('remove')
      .withArgs({ email: 'test@gmail.com' })
      .yields(null, expectedResult);

    User.remove({ email: 'test@gmail.com' }, (err, result) => {
      userMock.verify();
      userMock.restore();
      expect(err).to.be.null;
      expect(result.nRemoved).to.equal(1);
      done();
    })
  });
});

describe('Wikode Model', () => {

  it('should create a wikode with a defined slug and datetime', (done) => {

    const wikode = new Wikode({
      title: 'My Slug',
      slug: 'my-slug',
      user: '@AUser'
    });
    wikode.validate((err) => {
      expect(err).to.be.null;
      expect(wikode.slug).to.equal('my-slug');
      expect(wikode.datetime).to.be.ok;
      done();
    });

  });

  it('should create a slug from the title if the slug is not provided', (done) => {

    const wikode = new Wikode({
      title: 'My Slug',
      user: '@AUser'
    });
    wikode.validate((err) => {
      expect(err).to.be.null;
      expect(wikode.slug).to.equal('my-slug');
      done();
    });

  });

  it('should not create a wikode if the title is not provided', (done) => {

    const wikode = new Wikode({
      user: '@AUser'
    });
    wikode.validate((err) => {
      expect(err.errors.title).to.be.ok;
      done();
    });

  });

  it('should not create a wikode if the user is not provided', (done) => {
    const wikode = new Wikode({
      title: 'My Title',
      slug: 'my-slug'
    });
    wikode.validate((err) => {
      expect(err.errors.user).to.be.ok;
      done();
    });

  });

  it('should not create a wikode if the combination of the user and the slug is not unique');

})
