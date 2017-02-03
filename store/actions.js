const update = require('react-addons-update');
const popsicle = require('popsicle');

const {
  SAVE_WIKODE,
  SET_MODAL,
  SET_MESSAGE
} = require('./constants');

module.exports = exports.default = {

  /**
   *  SAVING A DOCUMENT
   */
  saveResponse: function(res) {
    const data = JSON.parse(res.body);
    switch(res.status) {

      case 200:
        return {type: SAVE_WIKODE, datetime: data.wikode.datetime, user: data.wikode.user};

      case 401:
        return {type: SET_MESSAGE, message: 'You must be logged in'};

      default:
        return {type: SET_MESSAGE, message: 'Network connection lost'};

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
  },



  save: function(wikode, content, user) {
    return (dispatch) => {
      const newWikode = update(wikode, {$merge: {
        content: content,
        user: user
      }});

      popsicle.put({
        url: `/wikode/${newWikode.slug}`,
        body: newWikode,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }

      }).then((res) => {
        history.pushState({}, newWikode.title, `/wikode/${newWikode.user}/${newWikode.slug}`);
        dispatch(this.saveResponse(res));
      });
    }
  }

}
