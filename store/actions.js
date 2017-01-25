const popsicle = require('popsicle');
const update = require('react-addons-update');
const {
  SAVE_WIKODE,
  SET_MODAL
} = require('../store/constants');


const actions = module.exports = {

  /**
   *  SAVING A DOCUMENT
   */
  saveResponse: function(res) {
    const data = JSON.parse(res.body);
    console.log(data);
    switch(res.status) {

      case 200:
        return {type: SAVE_WIKODE, datetime: data.wikode.datetime, user: data.wikode.user};

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
      popsicle.put({
        url: `/wikode/${newWikode.slug}`,
        body: newWikode,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
      .then((res) => {
        history.pushState({}, newWikode.title, `/wikode/${newWikode.user}/${newWikode.slug}`);
        dispatch(actions.saveResponse(res));
      });
    }
  },

  /**
   *  UI HANDLING
   */

  openModal: function(modal) {
    return {type: SET_MODAL, value: modal}
  },

  closeModals: function() {
    return {type: SET_MODAL, value: null}
  }
}
