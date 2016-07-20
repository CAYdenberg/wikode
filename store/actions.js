const popsicle = require('popsicle');

const actions = module.exports = {

  checkUserExistsResponse: function(res) {
    if (res.body.userExists) {
      return {type: 'SET_UI', el: 'uniqueUsername', value: 'User already exists. Please choose a different name'}
    } else {
      return {type: 'SET_UI', el: 'uniqueUsername', value: ''}
    }
  },

  checkUserExists: function(username) {
    return function(dispatch) {
      popsicle.request({
        method: 'GET',
        url: '/user/exists/' + username
      }).then(res => {
        dispatch(actions.checkUserExistsResponse(res));
      });
    }
  },

  loginResponse: function(res) {

    switch (res.status) {

      case 200:
        return {type: 'SWITCH_USER', hash: res.body.userHash, name: res.body.username};

      default:
        return {type: 'SET_UI', el: 'signinForm', value: 'Username or password is incorrect'}

    }
  },

  login: function(data) {
    return function(dispatch) {
      popsicle.request({
        method: 'POST',
        url: '/user/login/',
        body: data
      }).then(res => {
        dispatch(actions.loginResponse(res));
      });
    }
  },

  /**
   * CREATING A USER
   */

  createUserResponse: function(res) {

    switch (res.status) {

      case 200:
        return {type: 'SWITCH_USER', hash: res.body.userHash, name: res.body.username};

      case 401:
        return {type: 'SET_UI', el: 'createUserForm', value: res.body.error};

      default:
        return {type: 'SET_UI', el: 'createUserForm', value: 'User could not be created'}

    }
  },

  createUser: function(data) {
    return function(dispatch) {
      popsicle.request({
        method: 'POST',
        url: '/user/new/',
        body: data
      }).then(res => {
        dispatch(actions.createUserResponse(res));
      });
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
