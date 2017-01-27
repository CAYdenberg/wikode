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

  it('should get a Wikode from the database', (done) => {
    const wikodeMock = sinon.mock(Wikode);
    const expectedWikode = {
      title: 'My Title',
      slug: 'my-slug',
      content: 'Some content',
      datetime: '111',
      user: '@AnotherUser'
    }
    wikodeMock
      .expects('find')
      .chain('sort').withArgs({datetime: -1})
      .chain('limit').withArgs(1)
      .resolves([expectedWikode]);

    const wikodeController = require('../controllers/wikode')(Wikode);

    wikodeController.get(req, res, () => {
      assert(res.locals.view, 'Editor');
      assert(res.locals.state.wikode, expectedWikode);
      wikodeMock.restore();
      done();
    });
  });

  it('should produce 404 if the wikode does not exist', (done) => {
    const wikodeMock = sinon.mock(Wikode);
    wikodeMock
      .expects('find')
      .chain('sort').withArgs({datetime: -1})
      .chain('limit').withArgs(1)
      .resolves([]);

    const wikodeController = require('../controllers/wikode')(Wikode);

    wikodeController.get(req, res, (err) => {
      assert.equal(err.status, 404);
      wikodeMock.restore();
      done();
    })
  });

  it('should save an existing wikode to the database', (done) => {
    const wikodeMock = sinon.mock(Wikode);
    const expectedWikode = {
      user: '@AUser',
      title: 'My Title',
      slug: 'my-title',
      content: 'Some content',
      datetime: '111'
    };
    wikodeMock
      .expects('create')
      .resolves(expectedWikode);

    const wikodeController = require('../controllers/wikode')(Wikode);

    req.path = '/wikode/my-title';
    req.body = {
      title: 'My Title',
      slug: 'my-title',
      content: 'Some content'
    };
    wikodeController.put(req, res, (err) => {
      expect(res.locals.state.wikode).to.deep.equal(expectedWikode);
      expect(err).to.be.undefined;
      expect(res.locals.view).to.equal('Editor');
      wikodeMock.restore();
      done();
    });
  });
});
