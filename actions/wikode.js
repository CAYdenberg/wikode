const popsicle = require('popsicle');
const {
  SET_UI,
  NEW_WIKODE,
  SAVE_WIKODE
} = require('../store/constants');

const {slugify} = require('../lib/');

const actions = module.exports = {

  /**
   *  SAVING A DOCUMENT
   */
  saveResponse: function(res) {
    switch(res.status) {

      case 200:
        return {type: SAVE_WIKODE, datetime: res.datetime};

      default:
        return {type: SET_UI, el: 'save-btn', value: 'The document could not be saved'};

    }
  },

  save: function(url, content) {
    return function(dispatch) {
      // dispatch(actions.saveRequest());
      popsicle.request({
        method: 'PUT',
        url: url,
        body: content
      }).then((res) => {
        dispatch(actions.saveResponse(res));
      });
    }
  },

  new: function(title, user) {
    user = user || 'local';
    window.triggerLocalNavigation('Editor', title, '/' + user + '/' + slugify(title));
    return {type: NEW_WIKODE, user: user, title: title, slug: slugify(title)}
  }

}
