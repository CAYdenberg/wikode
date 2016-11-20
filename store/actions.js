
const {
  SET_UI
} = require('./constants');


const actions = module.exports = {

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
