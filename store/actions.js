const popsicle = require('popsicle');
const {
  SET_UI
} = require('./constants');


const actions = module.exports = {

  /**
   *  SAVING A DOCUMENT
   */
  saveRequest: function() {
    return {type: 'SAVING'}
  },

  saveResponse: function(res) {
    switch(res.status) {

      case 200:
        return {type: 'SAVED', datetime: res.datetime};

      default:
        return {type: 'SAVE_ERROR'};

    }
  },

  save: function(url, content) {
    return function(dispatch) {
      dispatch(actions.saveRequest());
      popsicle.request({
        method: 'PUT',
        url: url,
        body: content
      }).then((res) => {
        dispatch(actions.saveResponse(res));
      });
    }
  },

  /**
   * ACTIONS CONTROLLING UI
   */
  modal: function(modalName) {
    return {type: SET_UI, el: 'modal', value: modalName}
  },

  hideModals: function() {
    return {type: SET_UI, el: 'modal', value: null}
  }

};
