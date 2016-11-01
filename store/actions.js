const popsicle = require('popsicle');
const {
  LOGIN,
  LOGOUT,
  SET_UI,
  SAVE_WIKODE,
  FORK_WIKODE,
  NEW_WIKODE
} = require('./constants');


const actions = module.exports = {


  loginResponse: function(res) {
    switch (res.status) {

      case 200:
        return {type: LOGIN, hash: res.body.userHash, name: res.body.username};

      default:
        return {type: SET_UI, el: 'signinForm', value: 'Username or password is incorrect'}

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
        return {type: LOGIN, hash: res.body.userHash, name: res.body.username};

      case 400:
        return {type: SET_UI, el: 'createUserForm', value: res.body.error};

      default:
        return {type: SET_UI, el: 'createUserForm', value: 'User could not be created'}

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
    return {type: 'SET_UI', el: 'modal', value: modalName}
  },

  hideModals: function() {
    return {type: 'SET_UI', el: 'modal', value: null}
  }

};
