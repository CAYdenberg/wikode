const popsicle = require('popsicle');
const update = require('react-addons-update');
const {
  SAVE_WIKODE
} = require('../store/constants');


const actions = module.exports = {

  /**
   *  SAVING A DOCUMENT
   */
  saveResponse: function(res) {
    switch(res.status) {

      case 200:
        return {type: SAVE_WIKODE, datetime: res.body.wikode.datetime, user: res.body.wikode.user};

      default:
        return {};

    }
  },

  save: function(wikode, content, user) {
    const newWikode = update(wikode, {$merge: {
      content: content,
      user: user
    }});

    return function(dispatch) {
      popsicle.post({
        url: `/${newWikode.user}/${newWikode.slug}`,
        body: newWikode,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }).then((res) => {
        dispatch(actions.saveResponse(res));
      });
    }
  }

}
