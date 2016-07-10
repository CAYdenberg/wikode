const popsicle = require('popsicle');

module.exports = {

  createUserSubmit: function(data, store) {
    if (store) {
      popsicle.request({
        method: 'POST',
        url: '/user/new/',
        body: data
      }).then(res => {
        store.dispatch(this.createUserSubmitResponse(res));
      });
    }
    return null;
  },

  createUserSubmitResponse: function(res) {
    switch (res.status) {

      case 200:
        return {type: 'SWITCH_USER', hash: res.body.userHash, name: res.body.username};

      case 401:
        return {type: 'SET_UI', el: 'createUserForm', value: res.body.error};

      default:
        return {type: 'SET_UI', el: 'createUserForm', value: 'User could not be created'}

    }
  },

  /**
   *  SAVING A DOCUMENT
   */
  save: function(user, slug, data, store) {
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
    return {type: 'SET_UI', el: 'modal', value: modalName}
  },

  hideModals: function() {
    return {type: 'SET_UI', el: 'modal', value: null}
  }

};
