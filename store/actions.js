const popsicle = require('popsicle');

module.exports = {

  saveContent: function(user, slug, data, store) {
    if (store) {
      popsicle.request({
        method: 'PUT',
        url: '/' + user + '/' + slug + '/',
        body: data
      }).then((res) => {
        store.dispatch(this.saveResponse(res));
      });
    }
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

  /**
   * ACTIONS CONTROLLING UI
   */
  modal: function(modalName) {
    return {type: 'MODAL', name: modalName}
  },

  hideModals: function() {
    return {type: 'MODAL', name: null}
  }

};
