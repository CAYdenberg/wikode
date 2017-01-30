const update = require('react-addons-update');

const {
  SAVE_WIKODE,
  SET_MODAL,
  SET_MESSAGE
} = require('./constants');

function Actions(ajax) {
  this.ajax = ajax;

  /**
   *  SAVING A DOCUMENT
   */
  this.saveResponse = function(res) {
    const data = JSON.parse(res.body);
    switch(res.status) {

      case 200:
        return {type: SAVE_WIKODE, datetime: data.wikode.datetime, user: data.wikode.user};

      default:
        return {};

    }
  };

  this.save = function(wikode, content, user) {
    return (dispatch) => {
      const newWikode = update(wikode, {$merge: {
        content: content,
        user: user
      }});

      this.ajax.put({
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
  };

  /**
   *  UI HANDLING
   */

  this.openModal = function(modal) {
    return {type: SET_MODAL, value: modal}
  };

  this.closeModals = function() {
    return {type: SET_MODAL, value: null}
  }
}

module.exports = (ajax) => new Actions(ajax);
