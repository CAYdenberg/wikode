/* eslint-env mocha, node */

const assert = require('assert');
const {expect} = require('chai');

const sinon = require('sinon');
require('sinon-mongoose');
require('sinon-as-promised');

const Wikode = require('../models/Wikode');

describe('Wikode Controller', () => {

  var req, res;


  beforeEach(() => {
    req = {
      user: {
        profile: {
          name: '@AUser'
        }
      },
      path: '/wikode/@AUser/my-slug',
      params: {user: '@AUser', slug: 'my-slug'},
      session: {
        returnTo: null
      }
    };
    res = {
      locals: {
        state: {}
      }
    };
  });


  it('GET existing wikode', (done) => {
    const wikodeMock = sinon.mock(Wikode);
    const expectedWikode = {
      title: 'My Title',
      slug: 'my-slug',
      content: 'Some content',
      datetime: 111,
      user: '@AnotherUser'
    }
    wikodeMock
      .expects('findOne').withArgs({
        user: '@AnotherUser',
        slug: 'my-slug'
      })
      .resolves(expectedWikode);

    const wikodeController = require('../controllers/wikode')(Wikode);
    req.path = '/wikode/@AnotherUser/my-slug',
    req.params = {
      user: '@AnotherUser',
      slug: 'my-slug'
    };

    wikodeController.get(req, res, (err) => {
      expect(err).to.be.undefined;
      assert(res.locals.view, 'Editor');
      assert(res.locals.state.wikode, expectedWikode);
      wikodeMock.verify();
      done();
    });
  });


  it('GET non-existing wikode (throw 404)', (done) => {
    const wikodeMock = sinon.mock(Wikode);
    wikodeMock
      .expects('findOne')
      .resolves(null);

    const wikodeController = require('../controllers/wikode')(Wikode);

    wikodeController.get(req, res, (err) => {
      assert.equal(err.status, 404);
      wikodeMock.verify();
      done();
    })
  });


  it('POST completely new Wikode', (done) => {
    const wikodeMock = sinon.mock(Wikode);
    const expectedWikode = {
      title: 'My Title',
      user: '@AUser',
      slug: 'my-title',
      datetime: 111,
      content: []
    };
    wikodeMock
      .expects('create').withArgs({
        user: '@AUser',
        title: 'My Title',
      }).resolves(expectedWikode);

    req.body = {
      'new-wikode-title': 'My Title'
    };
    req.path = '/wikode/';
    req.params = {};

    const wikodeController = require('../controllers/wikode')(Wikode);

    wikodeController.post(req, res, (err) => {
      expect(err).to.be.undefined;
      assert(res.locals.state.wikode, expectedWikode);
      expect(res.locals.redirect).to.equal('/wikode/@AUser/my-title/');
      wikodeMock.verify();
      done();
    })
  });


  it('POST wikode that is a copy of another users wikode', (done) => {
    const wikodeMock = sinon.mock(Wikode);

    const oldWikode = {
      title: 'My Title',
      user: '@OldUser',
      slug: 'my-slug',
      datetime: 111,
      content: ['Some existing content']
    }
    const expectedWikode = {
      title: 'My Title',
      user: '@AUser',
      slug: 'my-slug',
      datetime: 111,
      content: ['Some existing content']
    };

    wikodeMock.expects('findOne').withArgs({
      user: '@OldUser',
      slug: 'my-slug'
    }).resolves(oldWikode);
    wikodeMock.expects('create').withArgs({
      title: 'My Title',
      user: '@AUser',
      slug: 'my-slug',
      content: ['Some existing content']
    }).resolves(expectedWikode);

    req.body = {};
    req.path = '/wikode/@OldUser/my-slug';
    req.params = {
      user: '@OldUser',
      slug: 'my-slug'
    };

    const wikodeController = require('../controllers/wikode')(Wikode);

    wikodeController.fork(req, res, (err) => {
      expect(err).to.be.undefined;
      assert(res.locals.state.wikode, expectedWikode);
      expect(res.locals.redirect).to.equal('/wikode/@AUser/my-slug/');
      wikodeMock.verify();
      done();
    })
  });


  it('POST wikode that already exists (username + slug)', (done) => {
    const wikodeMock = sinon.mock(Wikode);

    const oldWikode = {
      title: 'My Title',
      user: '@OldUser',
      slug: 'my-slug',
      datetime: 111,
      content: ['Some existing content']
    }

    wikodeMock.expects('findOne').withArgs({
      user: '@OldUser',
      slug: 'my-slug'
    }).resolves(oldWikode);
    wikodeMock.expects('create').withArgs({
        title: 'My Title',
        user: '@AUser',
        slug: 'my-slug',
        content: ['Some existing content']
      }).rejects({
        name: 'MongoError',
        code: 11000
      });

    req.body = {};
    req.path = '/wikode/@OldUser/my-slug';
    req.params = {
      user: '@OldUser',
      slug: 'my-slug'
    };

    const wikodeController = require('../controllers/wikode')(Wikode);

    wikodeController.fork(req, res, (err) => {
      expect(err.status).to.equal(400);
      expect(err.message).to.equal('You already have a Wikode with the same or a similar title');
      wikodeMock.verify();
      done();
    })
  });


  it('PUT wikode (update content)', (done) => {
    const wikodeMock = sinon.mock(Wikode);
    const oldWikode = {
      title: 'My Title',
      user: '@AUser',
      slug: 'my-slug',
      datetime: 111,
      content: ['Some old content']
    };
    const newWikode = {
      title: 'My Title',
      user: '@AUser',
      slug: 'my-slug',
      datetime: 222,
      content: ['Some new content']
    };
    wikodeMock
      .expects('findOne').withArgs({
        user: '@AUser',
        slug: 'my-slug'
      }).resolves(oldWikode);
    oldWikode.save = sinon.stub().resolves(newWikode);

    req.body = {
      content: ['Some new content']
    };

    const wikodeController = require('../controllers/wikode')(Wikode);

    wikodeController.put(req, res, (err) => {
      expect(err).to.be.undefined;
      assert(res.locals.state.wikode, newWikode);
      wikodeMock.verify();
      done();
    })
  });
});
